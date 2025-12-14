const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/model/User");
const Sweet = require("../src/model/Sweet");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterEach(async () => {
  await User.deleteMany();
  await Sweet.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});


/* 
    1) Allow ADMIN to add sweet

   2) Block USER

   3) Fail if required fields missing

   4) Create sweet with correct data

   5) Accept optional imageUrl
 */

// ! USER cannot add sweet
it("should block non-admin user from adding sweet", async () => {
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
      quantity: 50
    });

  expect(res.statusCode).toBe(403);
});

// ! Test 2: Missing Required Fields
it("should fail if required fields are missing", async () => {
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
      name: "Barfi"
    });

  expect(res.statusCode).toBe(400);
});


// ! Test 3: Admin can add sweet

it("should allow admin to add a sweet", async () => {
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
      name: "Rasgulla",
      category: "Indian",
      price: 20,
      quantity: 100,
      imageUrl: "https://example.com/rasgulla.jpg"
    });

  expect(res.statusCode).toBe(201);
  expect(res.body.name).toBe("Rasgulla");
});
