const UnauthorizedError = require("../../errors/unauthorized");
const articlesService = require("./articles.service");

class ArticlesController {
  async create(req, res, next) {
    try {
      const userId = req.user._id;
      const article = await articlesService.createArticle(req.body, userId);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      const user = req.user;
      if (user.role !== "admin") {
        throw new UnauthorizedError("Not authorized to update this article.");
      }

      const data = req.body;
      const articleModified = await articlesService.updateArticle(id, data);
      req.io.emit("article:update", { id });
      res.status(200).json(articleModified);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const user = req.user;

      if (user.role !== "admin") {
        throw new UnauthorizedError("Not authorized to delete this article.");
      }

      await articlesService.deleteArticle(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
