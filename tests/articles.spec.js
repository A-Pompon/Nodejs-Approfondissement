const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const User = require("../api/users/users.model");
const Article = require("../api/articles/articles.model");

describe("tester API articles", () => {
  let token;
  const USER_ID = "fake";
  const ARTICLE_ID = "fake";
  const MOCK_USER_DATA = {
    _id: USER_ID,
    name: "Arnaud",
    email: "arnaud@mail.com",
    password: "Arnaud123!",
    role: "admin",
  };

  const MOCK_ARTICLE_CREATED = {
    title: "Titre article n°TEST",
    content: "Lorem ipsum dolor sit amet.",
    user: MOCK_USER_DATA._id,
    status: "draft",
  };

  const MOCK_ARTICLE_UPDATED = {
    _id: ARTICLE_ID,
    title: "Titre article n°TEST Modifié",
    content: "Lorem ipsum dolor sit amet.",
    user: MOCK_USER_DATA._id,
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER_DATA, "findOne");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE_UPDATED, "findOneAndUpdate");
  });

  test("[Article] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    console.log("===== CREATE =====", res.body);
    console.log("===== CREATE =====", res.status);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_CREATED.content);
  });

  test("[Article] Update Article", async () => {
    const res = await request(app)
      .put("/api/articles/" + ARTICLE_ID)
      .send(MOCK_ARTICLE_UPDATED)
      .set("x-access-token", token);
    console.log("===== UPDATE =====", res.body);
    console.log("===== UPDATE =====", res.status);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE_UPDATED.title);
    expect(res.body.content).toBe(MOCK_ARTICLE_UPDATED.content);
  });

  test("[Article] Delete Article", async () => {
    const res = await request(app)
      .delete("/api/articles/" + ARTICLE_ID)
      .set("x-access-token", token);
    console.log("===== DELETE =====", res.body);
    console.log("===== DELETE =====", res.status);
    expect(res.status).toBe(204);
    expect(res.body).toStrictEqual({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
