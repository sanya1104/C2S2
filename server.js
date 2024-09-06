const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas connection
// const uri = "mongodb+srv://ishita2166be21:1gwkD5TLQTUg788t@careers.2jziy.mongodb.net/myDatabaseName?retryWrites=true&w=majority";
const uri = "mongodb+srv://sanya791be22:mongoDB24@cluster0.w5qk5.mongodb.net/careersdb?retryWrites=true&w=majority";
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Define a schema and model for form data
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String,
    position: String
});

const FormData = mongoose.model('FormData', formSchema);

// POST route to submit form data
app.post('/submit-form', (req, res) => {
    const newFormData = new FormData({
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        position: req.body.position
    });

    newFormData.save()
        .then(() => res.status(200).send('Form data saved successfully!'))
        .catch(err => res.status(400).send('Error saving form data: ' + err));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
