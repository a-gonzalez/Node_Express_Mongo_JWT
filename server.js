"use strict";

const express = require("express");
const app = express();

//const path = require("path");
const parser = require("body-parser");
const color = require("chalk");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/users", { useNewUrlParser: true }).then(
(connection) =>
{
	//console.info("Connect request was successful.");
	console.info(color.blue("Connect request was successful."), color.white(new Date().toLocaleTimeString()));
}).catch(
(error) =>
{
	console.info(color.red("Connect request failed.\n", error, new Date().toLocaleTimeString()));
}).finally(
() =>
{
	console.info(color.blue("Connect request complete.\n"));
});

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

const port = 3150;

app.get("/", (request, response) =>
{
	response.status(200).json({ "Status": "Running @ " + new Date().toLocaleString() });
	//response.send("Testing...");
});

app.get("/checking", (request, response) =>
{
	const token = {
		"token": "987bbf9d-2fbe-4be5-8fa6-36394afca93f"
	};

	console.info(color.blue("Sending token to client:"), color.white(token.token));
	/*response.status(200).json({
		"token": "987bbf9d-2fbe-4be5-8fa6-36394afca93f"
	});*/

	response.status(200).json(token);
	//response.send("Checking...");
});

const router = require("./routes/user");

app.use("/user", router);

app.listen(port, () =>
{
	//console.info("Server is running on port %d @ %s.\n", port, new Date().toLocaleString());
	console.info(color.blue("Server is running on port:"), color.red(port), color.white(new Date().toLocaleString()));
});