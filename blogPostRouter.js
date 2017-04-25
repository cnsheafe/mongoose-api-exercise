const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const {blogPost} = require('./model');
const {DATABASE_URL} = require('./config');

const jsonParser = bodyParser.json();
const router = express.Router();
// mongoose.Promise = global.Promise;

// mongoose.connect(DATABASE_URL);
router.get('/', (req, res) => {
	blogPost.find().exec().then(allPosts => {
		res.status(200).json({
			allPosts: allPosts.map(post => post.showPost())
		});
	});
});

router.get('/:id', function (req, res) {
	const post = blogPost.get(req.params.id);
	if( post.constructor === Array ) {
		const msg = `Blog post with id:${req.params.id} does not exist`;
		console.info(msg);
		return res.status(404).send(msg);
	}
	return res.status(200).json(post);
});

router.post('/', jsonParser, function(req, res) {
	const requiredFields = ['title', 'content', 'author'];
	let field = '';
	for (let i = 0; i < requiredFields.length; i++) {
		field = requiredFields[i];
		console.log(req.body);
		if (!(field in req.body)){
			const msg = `${field} not found in body`;
			return res.status(400).send(msg);
		}
	}
	let date = null;
	if (typeof req.body.publishDate !== 'undefined') {
		date = req.body.publishDate;
	}

	const post = blogPost.create(req.body.title, req.body.content, req.body.author, date);
	res.status(201).json(post);
});

router.put('/:id', jsonParser, function(req, res) {
	console.log(req.params.id);
	const requiredFields = ['title', 'content', 'author'];
	let field = '';
	for (let i = 0; i < requiredFields.length; i++) {
		field = requiredFields[i];
		if (!(field in req.body)){
			const msg = `${field} not found in body`;
			return res.status(400).send(msg);
		}
	}
	for (let i = 0; i < blogPost.posts.length; i++) {
		if(req.params.id === blogPost.posts[i].id) {
			break;

		}
		else {
			const msg = `${req.params.id} does not exist`;
			return res.status(400).send(msg);
		}
	}
	res.status(204).json(blogPost.update(req.body));
});

router.delete('/:id', function(req,res) {
	for (let i = 0; i < blogPost.posts.length; i++) {
		if(req.params.id === blogPost.posts[i].id) {
			break;
		}
		else {
			const msg = `${req.params.id} does not exist`;
			return res.status(400).send(msg);
		}
	}
	res.status(204).json(blogPost.delete(req.params.id));
});

module.exports = router;
