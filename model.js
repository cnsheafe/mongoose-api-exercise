const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
	title: {type: String, required: true},
	content: {type: String, required: true},
	author: {
		firstName: {type: String, required: true},
		lastName: {type: String, required: true}
	},
	created: {type: Number}
});

blogPostSchema.virtual('fullName').get(function() {
	return `${this.firstName} ${this.lastName}`.trim();
});

blogPostSchema.methods.showPost = function() {
	return {
		id: this._id,
		title: this.title,
		content: this.content,
		author: this.fullName,
		created: this.created || Date.now()
	};
};
// first arg is the singular noun of the collection to connect to
const blogPost = mongoose.model('Post', blogPostSchema);
module.exports = {blogPost};
