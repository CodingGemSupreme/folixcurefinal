const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
	treatment: { type: String, required: true },
	clinic: { type: String, required: true },
	
	completed: Boolean,
});

const Treatment = mongoose.model('Treatment', treatmentSchema);

module.exports = Treatment;