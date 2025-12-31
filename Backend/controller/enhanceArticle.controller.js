import Article from "../models/articleModel.js";
import puppeteer from "puppeteer";
import { updateArticleContent } from "../utils/updateArticleContentHuggingFace.js";

export const enhanceArticle = async (req, res) => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    try {
        const article = await Article.findOne({ status: "pending" });
        if (!article) return res.status(404).json({ message: "No pending article" });

        const articleTitle = article.title;

        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        await page.goto(
            `https://duckduckgo.com/?q=${encodeURIComponent(articleTitle)}&ia=web`,
            { waitUntil: "networkidle2" }
        );

        const blockedDomains = [
            "amazon.com", "amazon.ca", "beyondchats.com", "flipkart.com", "youtube.com", "facebook.com", "twitter.com", "instagram.com", "linkedin.com", "pinterest.com", "tiktok.com", "google.com"
        ];

        const isLikelyArticle = (url) => {
            const lower = url.toLowerCase();
            return !(
                lower.includes("/dp/") || lower.includes("/product/") || lower.includes("/shop/") || lower.includes("/category/") || lower.includes("/collections/")
            );
        };

        const collectedLinks = new Set();

        for (let i = 0; i < 2; i++) {
            // 1 Extract links (STABLE SELECTOR)
            const rawLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".eVNpHGjtxRBq_gLOfGDr"))
                    .map(a => a.href)
                    .filter(h => h.startsWith("http"));
            });

            // 2 Filter
            rawLinks.forEach(link => {
                try {
                    const hostname = new URL(link).hostname.replace("www.", "");
                    if (
                        !blockedDomains.includes(hostname) &&
                        isLikelyArticle(link)
                    ) {
                        collectedLinks.add(link);
                    }
                } catch { }
            });

            if (collectedLinks.size >= 2) break;

            // 3 Scroll
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            // await page.waitForTimeout(1500);
            await delay(2000);

            // 4 Click "More Results" (STABLE SELECTOR)
            const moreBtn = await page.$("#more-results");
            if (moreBtn) {
                console.log("⬇ Clicking More Results");
                await moreBtn.click();
                await delay(2000);
            } else {
                console.log(" No More Results button");
            }
        }

        const finalLinks = Array.from(collectedLinks).slice(0, 2);


        // Scrape main content from each link
        const newConttentsFromLink = []

        for (const link of finalLinks) {
            const newPage = await browser.newPage();

            if (finalLinks.indexOf(link) === 0) {
                await newPage.goto(link, { waitUntil: "networkidle2" });
                // const text = await newPage.evaluate(() => {
                //     const el = document.querySelector(".pw-post-body-paragraph")``
                //     return el ? el.innerText.trim() : "";

                // });
                const text = await newPage.evaluate(() => {
                    const paragraphs = Array.from(
                        document.querySelectorAll("article p.pw-post-body-paragraph")
                    );

                    return paragraphs
                        .map(p => p.innerText.trim())
                        .filter(Boolean)
                        .join("\n\n");
                });

                newConttentsFromLink.push({
                    url: link,
                    content: text.slice(0, 500)
                });

            }
            if (finalLinks.indexOf(link) === 1) {
                await newPage.goto(link, { waitUntil: "networkidle2" });
                const text = await newPage.evaluate(() => {
                    const el = document.querySelector(".content-body")
                    // console.log("link 2 text = ", el ? el.innerText.trim() : "");
                    return el ? el.innerText.trim() : "";

                }); // Limiting to first 2000 characters

                newConttentsFromLink.push({
                    url: link,
                    content: text.slice(0, 500)
                });
            }
        }

        // console.log("new context =", newConttentsFromLink);
        const result = await updateArticleContent(article.excerpt, newConttentsFromLink)

        console.log("rs",result);
        
        // await browser.close();

        return res.status(200).json({ message: "Article enhancement process completed." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
