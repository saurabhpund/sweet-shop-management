const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = require("../src/app");
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
    1) Fail if email or password missing

    2) Fail if user does not exist

    3) Fail if password is wrong

    4) Succeed with correct credentials

    5) Return JWT token

    6) Never return password
 */

// ! Missing Fields
it("should fail if email or password is missing", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "test@test.com" });

  expect(res.statusCode).toBe(400);
});

// ! User Not Found
it("should fail if user does not exist", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "nouser@test.com",
      password: "password123"
    });

  expect(res.statusCode).toBe(401);
});

// ! Wrong Password
it("should fail if password is incorrect", async () => {
  const hashedPassword = await bcrypt.hash("correctpass", 10);

  await User.create({
    name: "Amit",
    email: "amit@test.com",
    password: hashedPassword
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "amit@test.com",
      password: "wrongpass"
    });

  expect(res.statusCode).toBe(401);
});

// ! Password Not Returned
it("should not return password in response", async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  await User.create({
    name: "Amit",
    email: "amit@test.com",
    password: hashedPassword
  });

  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "amit@test.com",
      password: "password123"
    });

  expect(res.body.user.password).toBeUndefined();
});
