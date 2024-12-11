const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
// const uri = "mongodb+srv://ishita2166be21:1gwkD5TLQTUg788t@careers.2jziy.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
const uri =
  "mongodb+srv://sanya791be22:mongoDB24@cluster0.w5qk5.mongodb.net/careersdb?retryWrites=true&w=majority";
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// User schema for login/signup
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Define a schema and model for form data
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  position: String,
});

const FormData = mongoose.model("FormData", formSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists. Please log in." });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error creating user", error });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    // Successful login
    res.status(200).send({
      message: "Login successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).send({ message: "Error logging in", error });
  }
});

app.post("/logout", async (req, res) => {
  localStorage.clear();
});

// POST route to submit form data
app.post("/submit-form", (req, res) => {
  const newFormData = new FormData({
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    position: req.body.position,
  });

  newFormData
    .save()
    .then(() => res.status(200).send("Form data saved successfully!"))
    .catch((err) => res.status(400).send("Error saving form data: " + err));
});

const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email provider
  auth: {
    user: "officeofstudentaffairs24@gmail.com", // Your email address
    pass: "enqe dhvp syry bzba", // Your email password or app-specific password
  },
});

// Route to send email
app.post("/send-email", (req, res) => {
  const { email } = req.body; // Get the user's email from the request

  const mailOptions = {
    from: "officeofstudentaffairs24@gmail.com",
    to: email,
    subject: "Welcome to Our Service!",
    text: "We are glad to have you on board! We will provide you with more information shortly.",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: "Error sending email", error });
    }
    res.status(200).send({ message: "Email sent successfully", info });
  });
});

// DELETE route to delete form data entry by ID
app.delete("/entries/:id", async (req, res) => {
  try {
    // Find and delete the entry by its ID from the FormData collection
    const deletedEntry = await FormData.findByIdAndDelete(req.params.id);

    if (!deletedEntry) {
      return res.status(404).send({ message: "Entry not found" });
    }

    res.status(200).send({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting entry", error });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
