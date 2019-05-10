const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
	_id: Schema.Types.ObjectId,
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("User", user);