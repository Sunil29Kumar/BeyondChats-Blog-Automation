import puppeteer from "puppeteer";
import Article from "../models/articleModel.js";

export const scrapeBeyondChatsBlogs = async (req, res) => {
    let browser;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {

        browser = await puppeteer.launch({
            headless: true,
            // args: ["--no-sandbox", "--disable-setuid-sandbox"],
            args: ["--no-sandbox", "--disable-setuid-sandbox"],

        });

        const page = await browser.newPage();

        // 1️ Open blogs page
        await page.goto("https://beyondchats.com/blogs/", {
            waitUntil: "networkidle2",
        });

        // wait till articles load
        await page.waitForSelector("article");


        // 2 Detect LAST PAGE number
        const lastPage = await page.evaluate(() => {
            const links = [...document.querySelectorAll("a")];

            const pageNumbers = links.map(a => a.textContent.trim())
                .filter(text => /^\d+$/.test(text))
                .map(Number);

            return Math.max(...pageNumbers);
        });
        await delay(2000);


        console.log(lastPage);


        // 3️ Navigate to LAST PAGE
        await page.goto(`https://beyondchats.com/blogs/page=${lastPage}`, {
            waitUntil: "networkidle2",

        });

        await page.waitForSelector("article");

        // 4 Extract OLDEST articles (max 5)
        const articles = await page.evaluate(() => {
            const nodes = [...document.querySelectorAll("article")];

            return nodes.slice(0, 5).map(article => ({
                title: article.querySelector("h2")?.innerText.trim() || "",
                url: article.querySelector("h2 a")?.href || "",
                excerpt: article.querySelector("p")?.innerText.trim() || "",
                author:
                    article.querySelector("span")?.innerText.trim() || "",
            }));
        });

        console.log("📰 Articles Found:", articles.length);
        console.log(articles);

        await browser.close();

        // store in DB 
        for (const article of articles) {
            if (!article.url) continue;

            await Article.updateOne(
                { url: article.url },
                { $setOnInsert: article },
                { upsert: true }
            );
        }

        return res.status(200).json({
            success: true,
            count: articles.length,
            articles,
        });

    } catch (error) {
        console.error(" Scraping Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to scrape BeyondChats blogs",
        });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
