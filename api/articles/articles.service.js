const Article = require("./articles.model");

class ArticleService {
  createArticle(data, userId) {
    const article = new Article(data);
    article.user = userId;
    return article.save();
  }

  updateArticle(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  deleteArticle(id) {
    return Article.deleteOne({ _id: id });
  }

  getArticlesByUserId(userId) {
    return Article.find({ user: userId }).populate("user", "-password");
  }
}

module.exports = new ArticleService();
