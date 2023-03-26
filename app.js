require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(cookieParser());


mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PWD + "@cluster0.8jvshni.mongodb.net/tac_tac");

const auth = require("./exports/auth.js");
const schemas = require("./exports/schemas.js");

const Command = mongoose.model("Command", schemas.cmdSchema);



app.get("/", async (req, res)=>{
    const cmds = await Command.aggregate([
        {
          $group: {
            _id: '$phone_number',
            commands: { $push: '$$ROOT' } // group by number and put all commands in array
          }
        }
    ]).exec();
    res.render("index", {cmds: change_cmd(cmds)})
})


app.post("/", async (req, res)=>{
    const cmds = await Command.find({});
    res.render("index", {cmds: change_cmd(cmds)})
})


app.listen(process.env.PORT || 3000, () => {
    console.log("[+] Server is running...");
});





function change_cmd(cmds){
    const all_cmds = [];
    for (let i=0; i<cmds.length; i++){
        const new_cmds = [];
        const cmd = cmds[i];
        const phone_number = cmd._id;
        const commands = cmd.commands;
        for (let j=0; j<commands.length; j++){
            const command = commands[j];
            const desc = update_json(command, ["prod", "ingredient", "sauces", "salades", "Frites", "Size", "Pate", "price", "quantity", "delivery"]);
            console.log(desc);
            new_cmds.push(desc);
        }
        const new_command = {"phone_number": phone_number, "commands": new_cmds};
        all_cmds.push(new_command);
    }
    return all_cmds;
}

function update_json(json, includes){
    const new_json = {};
    for (let i=0; i<includes.length; i++){
        const prop = includes[i];
        new_json[prop] = json[prop];
    }
    return new_json;
}