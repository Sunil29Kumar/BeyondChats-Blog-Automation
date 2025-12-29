import Article from "../models/articleModel.js";
import puppeteer from "puppeteer";


export const enhanceArticle = async (req, res) => {
    try {
        // Find one article with status "pending"
        const article = await Article.findOne({ status: "pending" });
        console.log(article);

        // extract title from article
        const articleTitle = article.title;

        // =============== step 1 :  Searches this article’s title on Google ================

        //  using puppeteer to automate browser
        let browser;
        browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        // 1️ Open Google search with article title
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(articleTitle)}`, {
            waitUntil: "networkidle2",
        });


        // 2 wait till articles load
        await page.waitForSelector("body");

        // // debugger 
        // const debughtml = await page.evaluate(() => {
        //     return [...document.querySelectorAll("a")].map(a => a.href).join("\n");
        // })
        // console.log("👀 Debug HTML:", debughtml);

        // return

        // take top 2 search results links
        const links = await page.evaluate(() => {
            const anchorNodes = [...document.querySelectorAll("a")];
            const urls = anchorNodes
                .map(a => a.href)
                .filter(href => href.startsWith("http") && !href.includes( "beyoundchats.com", "youtube.com"))
                .slice(0, 2);
            return urls;
        });
        console.log("🔗 Links Found:", links);


    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
