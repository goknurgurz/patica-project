const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const Photo = require("./models/Photo");

const app = express();

mongoose.connect("mongodb://localhost/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.render("index", { photos });
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", (req, res) => {
  try {
    res.render("about");
  } catch (err) {
    console.error("Error loading about page:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/add", (req, res) => {
  try {
    res.render("add");
  } catch (err) {
    console.error("Error loading add page:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/photos", async (req, res) => {
  try {
    await Photo.create(req.body);
    res.redirect("/");
  } catch (err) {
    console.error("Error adding photo:", err);
    res.status(500).send("Failed to add photo.");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
