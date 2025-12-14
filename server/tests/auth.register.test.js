const request = require("supertest");
const app = require("../src/app");
const mongoose = require("mongoose");
const User = require("../src/model/User");
require("dotenv").config()

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});


/* 
 1) What happens on successful registration?

 2) What if email already exists?

 3) What if required fields are missing?

 4) What if user tries to register as ADMIN?

 5) What should the response contain?

 6)What should it NOT contain? 
 */


it("should register a user with valid data", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Amit",
      email: "amit@test.com",
      password: "password123"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("id");
  expect(res.body.email).toBe("amit@test.com");
  expect(res.body.role).toBe("USER");
});

it("should not allow duplicate email registration", async () => {
  await User.create({
    name: "Amit",
    email: "amit@test.com",
    password: "hashed"
  });

  const res = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Another",
      email: "amit@test.com",
      password: "password123"
    });

  expect(res.statusCode).toBe(400);
});


it("should fail if required fields are missing", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email: "test@test.com"
    });

  expect(res.statusCode).toBe(400);
});

it("should store hashed password, not plain text", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Amit",
      email: "amit@test.com",
      password: "password123"
    });

  const user = await User.findOne({ email: "amit@test.com" });

  expect(user.password).not.toBe("password123");
});
