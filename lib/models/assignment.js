require('../db');
const mongoose = require('mongoose');

// schema
const AssignmentSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        trim: true,
        required: true
    },
    due: {
        type: Date,
        set: (value) => value.toLocaleString(),
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
},  {
    toJSON: {
        getters: false,
        virtuals: false,
        transform: (doc, obj, options) => {
            obj.id = obj._id;
            delete obj._id;
            delete obj.__v;
            return obj;
        }
    }
});
const Assignment = mongoose.model('Assignment', AssignmentSchema);

module.exports = Assignment;
