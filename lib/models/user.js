require('../db');
const mongoose = require('mongoose');

// schema
const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        match: /^[a-zA-Z\d]+$/,
        minlength: 4,
        maxlength: 20,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: 100,
        required: true
    },
    email: {
        type: String,
        match: /^\w+@\w+(\.\w+)+$/,
        required: false,
        unique: true,
        sparse: true
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
const User = mongoose.model('User', UserSchema);

module.exports = User;
