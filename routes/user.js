const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("bcrypt");
const jwt = require("jsonwebtoken");
const color = require("chalk");

const User = require("../models/user");
const config = require("../config/config");

router.get("/", (request, response) =>
{
	console.info(color.blue("Testing user route."), color.white(new Date().toLocaleTimeString()));

	const message = {
		testing: true,
		epoch: new Date().toLocaleString()
	};

	response.status(200).json(message);
});

router.post("/register", (request, response) =>
{
	crypto.hash(request.body.password, 10, (error, hash) =>
	{
		if (error)
		{
			console.info(color.red(error), color.white(new Date().toLocaleTimeString()));

			return response.status(500).json({ error: error });
		}
		else
		{
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email: request.body.email,
				password: hash
			});

			user.save().then(
			(user) =>
			{
				console.info(color.blue("Add request was successful.\n"), color.white(user));

				response.status(201).json(user);
			}).catch(
			(error) =>
			{
				console.log(color.red("Add request failed"), color.red(error));
				
				response.status(500).json("Add request failed.");
			}).finally(
			() =>
			{
				console.log(color.blue("Add request complete."));
			});
		}
	});
});

router.post("/login", (request, response) =>
{
	const email = {
		email: request.body.email
	};

	User.findOne(email).exec().then(
	(user) =>
	{
		if (user)
		{
			console.info("%s\n%s", color.blue("findOne request was successful."), color.white(user.email));

			const password = request.body.password;

			crypto.compare(password, user.password).then(
			(result) =>
			{
				console.info("%s\nPassword is %s.", color.blue("Compare request was successful."), color.green(result ? "valid" : "not valid"));

				if (result)
				{
					const secret = config.key;
					const seed = {
						email: user.email,
						_id: user._id
					};
					const options = {
						expiresIn: config.duration
					}
	
					const token = jwt.sign(seed, secret, options);

					response.setHeader("x-access-token", token);
					response.status(200).json({ authenticated: true, token: token });
				}
				else
				{
					response.status(401).json({ authenticated: false });
				}
			}).catch(
			(error) =>
			{
				console.info(color.red("Compare request failed.\n"), color.white(error));

				response.status(401).json({ authenticated: false });
			}).finally(
			() =>
			{
				console.info(color.blue("Compare request complete.\n"));
			});
		}
		else
		{
			console.info("User: %s was not found.\n", color.white(request.body.email));

			//response.status(404).json({ message: "User was not found." });
			response.status(401).json({ authenticated: false });
		}
	}).catch(
	(error) =>
	{
		console.info(color.red("findOne request failed.\n"), color.white(error));

		response.status(500).json( {error: error });
	}).finally(
	() =>
	{
		console.info(color.blue("findOne request complete.\n"));
	});
});

module.exports = router;