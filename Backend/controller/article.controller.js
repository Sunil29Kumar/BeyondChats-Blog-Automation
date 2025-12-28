import Article from "../models/articleModel.js";

/*  CREATE */
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/*  READ ALL  */
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*  READ ONE  */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Article not found" });

    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
export const updateArticle = async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedArticle)
      return res.status(404).json({ message: "Article not found" });

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* DELETE */
export const deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Article not found" });

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
