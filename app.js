const express = require("express");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override"); // Fixed import
const path = require("path");
const fs = require("fs");
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
app.use(fileUpload());
app.use(methodOverride("_method"));

const uploadDir = "public/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.get("/", async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.render("index", { photos });
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).send("Photo not found.");
    res.render("photo", { photo });
  } catch (err) {
    console.error("Error loading photo page:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send("No file uploaded.");
    }

    let uploadedImage = req.files.image;
    let uploadPath = path.join(__dirname, "public/uploads", uploadedImage.name);

    uploadedImage.mv(uploadPath, async (err) => {
      if (err) {
        console.error("Error uploading file:", err);
        return res.status(500).send("Error uploading file.");
      }

      await Photo.create({
        ...req.body,
        image: "/uploads/" + uploadedImage.name,
      });

      res.redirect("/");
    });
  } catch (err) {
    console.error("Error saving photo:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/photos/edit/:id", async (req, res) => {
  try {
    const photo = await Photo.findOne({ _id: req.params.id }); // Fixed findByOne
    if (!photo) return res.status(404).send("Photo not found.");
    res.render("edit", { photo });
  } catch (err) {
    console.error("Error loading photo edit page:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id); // Fixed findOne → findById
    if (!photo) return res.status(404).send("Photo not found.");

    photo.title = req.body.title;
    photo.description = req.body.description;
    await photo.save();
    res.redirect(`/photos/${req.params.id}`);
  } catch (err) {
    console.error("Error updating photo:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/photos/:id", async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id); // Fixed findByOne → findByIdAndDelete
    if (!photo) return res.status(404).send("Photo not found.");
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
