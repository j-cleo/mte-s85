const express = require("express");
const mongoose = require("mongoose");

const port = 4000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://admin:admin1234@ac-ds4tws7-shard-00-00.4tgaaxh.mongodb.net:27017,ac-ds4tws7-shard-00-01.4tgaaxh.mongodb.net:27017,ac-ds4tws7-shard-00-02.4tgaaxh.mongodb.net:27017/FitnessApp?ssl=true&replicaSet=atlas-ktgb23-shard-0&authSource=admin");

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error!"));

db.once("open", () => console.log("We're connected to the cloud database!"));

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});