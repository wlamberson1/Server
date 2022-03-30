require('../db');
const mongoose = require('mongoose');

// schema
const CourseSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    subject: {
        type: String,
        minlength: 4,
        maxlength: 4,
        uppercase: true,
        required: true
    },
    number: {
        type: Number,
        validate: {
            validator: (value) => value == Math.trunc(value),
            message: '{VALUE} is not an integer'
        },
        min: 1000,
        max: 6999,
        required: true
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200,
        required: false
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    students: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        default: [],
        required: false,
        index: true,
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
CourseSchema.index({ subject: 1, number: 1 }, { unique: true });
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
