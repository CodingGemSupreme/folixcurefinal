// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const Treatment = require("./models/treatment.js");
const methodOverride = require("method-override");
const db = mongoose.connection
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
// DATABASE CONFIGURATION
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Database Connection Error/Success

db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('MONGO IS CONNECTED TO FOLI X CURE'));
db.on('disconnected', () => console.log('MONGO HAS DISCONNECTED FROM FOLI X CURE'));

// MIDDLEWARE  & BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/css', express.static('css'));
app.use(express.static('public'));
// ROUTES

// INDEX
app.get('/', (req, res) => {
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


app.listen(PORT, () => {
    console.log(`FOLI X CURE IS LISTENENING: ${PORT}`)
})