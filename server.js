// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Treatment = require("./models/treatment.js");
const methodOverride = require("method-override");

// DATABASE CONFIGURATION
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('MONGO IS CONNECTED TO FOLI X CURE'));
db.on('disconnected', () => console.log('MONGO HAS DISCONNECTED FROM FOLI X CURE'));

// MIDDLEWARE  & BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/css', express.static('css'));

// ROUTES

// INDEX
app.get('/treatments', (req, res) => {
    Treatment.find({}, (error, allTreatments) => {
        res.render('index.ejs', {
            treatments: allTreatments,
        });
    });
});

// NEW
app.get("/treatments/new", (req, res) => {
    res.render('new.ejs')
});

// DELETE
app.delete("/treatments/:id", (req, res) => {
    Treatment.findByIdAndDelete(req.params.id, (err, data) => {
        res.redirect("/treatments")
    })
});

// UPDATE
app.put("/treatments/:id", (req, res) => {
    if (req.body.completed === "on") {
        req.body.completed = true
    } else {
        req.body.completed = false
    }

    Treatment.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
        },
        (error, updatedTreatment) => {
            res.redirect(`/treatments/${req.params.id}`)
        }
    )
});

// CREATE
app.post("/treatments", (req, res) => {
    if (req.body.completed === 'on') {
        //if checked, req.body.completed is set to 'on'
        req.body.completed = true;
    } else {
        //if not checked, req.body.completed is undefined
        req.body.completed = false;
    }
    Treatment.create(req.body, (error, createdTreatment) => {
        res.redirect("/treatments");
    });
})

// EDIT
app.get("/treatments/:id/edit", (req, res) => {
    Treatment.findById(req.params.id, (error, foundTreatment) => {
        res.render("edit.ejs", {
            treatment: foundTreatment,
        })
    })
})

// SHOW
app.get("/treatments/:id", (req, res) => {
    Treatment.findById(req.params.id, (err, foundTreatment) => {
        res.render("show.ejs", { treatment: foundTreatment })
    })
})

// LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`FOLI X CURE IS LISTENENING: ${PORT}`)
})