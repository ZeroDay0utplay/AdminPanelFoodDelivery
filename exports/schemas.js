const mongoose = require("mongoose");


const userSchema = {
    "First_Name": String,
    "Last_Name": String,
    "phone_number": Number,
    "Password": {type: String},
    "Email_Address": String
};

const cmdSchema = {
    "phone_number": Number,
    "prod": String,
    "ingredient": [String],
    "sauces": Map,
    "salades": Map,
    "Frites": String,
    "Size": String,
    "Pate": String,
    "price": Number,
    "quantity": Number,
    "delivery": String
}





module.exports = {
    userSchema,
    cmdSchema,
}