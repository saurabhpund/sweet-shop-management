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
 1) Allow access only if user is ADMIN

 2) Block access for USER

 3) Assume req.user is already set by auth middleware 
*/

// ! Test 1: Block USER Role
it("should block access for non-admin users", async () => {
  const user = await User.create({
    name: "User",
    email: "user@test.com",
    password: "hashed",
    role: "USER"
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET
  );

  const res = await request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Ladoo",
      category: "Indian",
      price: 10,
      quantity: 20
    });

  expect(res.statusCode).toBe(403);
});

// ! Test 2: Allow ADMIN Role
it("should allow access for admin users", async () => {
  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password: "hashed",
    role: "ADMIN"
  });

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET
  );

  const res = await request(app)
    .post("/api/sweets")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Barfi",
      category: "Indian",
      price: 15,
      quantity: 30
    });

  expect(res.statusCode).not.toBe(403);
});