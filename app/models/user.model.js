const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    fullName: String,
    profileFor: String,
    phone: String,
    status: Number,
    tsCreatedAt: Number,
    tsModifiedAt: Number

});
module.exports = mongoose.model('User', UserSchema, 'Users');