const mongoose = require('mongoose');

const blogPostSchema = mongoose.Scheme({
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

const blogPost = mongoose.model('blogPost', blogPostSchema);
module.exports = {blogPost};
