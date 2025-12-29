import Article from "../models/articleModel.js";


export const enhanceArticle = async (req, res) => {
    try {
        // Find one article with status "pending"
        const article = await Article.findOne({ status: "pending" });
        console.log(article);

        // extract title from article
        const articleTitle = article.title;

        

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
