const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/model/User");
require("dotenv").config()


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});


/* 
Allow request if valid JWT is present

Reject request if token missing

Reject request if token invalid

Attach user info to req for later use */

// ! Missing Token
it("should block access if token is missing", async () => {
  const res = await request(app).get("/api/sweets");

  expect(res.statusCode).toBe(401);
});

// ! Invalid Token
it("should block access if token is invalid", async () => {
  const res = await request(app)
    .get("/api/sweets")
    .set("Authorization", "Bearer invalidtoken");

  expect(res.statusCode).toBe(401);
});

// ! valid Token
it("should allow access with valid token", async () => {
  const user = await User.create({
    name: "Amit",
    email: "amit@test.com",
    password: "hashed",
    role: "USER"
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  const res = await request(app)
    .get("/api/sweets")
    .set("Authorization", `Bearer ${token}`);

  expect(res.statusCode).not.toBe(401);
});
