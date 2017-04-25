const express = require('express');
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const {blogPost} = require('./model');
const {DATABASE_URL} = require('./config');

const jsonParser = bodyParser.json();
const router = express.Router();


router.get('/', (req, res) => {
	blogPost.find().exec().
	then(allPosts => {
		res.status(200).json({
			allPosts: allPosts.map(post => post.showPost())
		});
	});
});

router.get('/:id', (req, res) => {
	blogPost.findById(req.params.id).exec()
	.then( post => res.json(post.showPost()) )
	.catch(err => {
		console.error(err);
		res.status(500).json({errMsg: 'Internal server error'});
	});
});


router.post('/', jsonParser, function(req, res) {
	const requiredFields = ['title', 'content', 'author'];
	let field = '';
	for (let i = 0; i < requiredFields.length; i++) {
		field = requiredFields[i];
		if (!(field in req.body)){
			const msg = `${field} not found in body`;
			return res.status(400).send(msg);
		}
	}
	blogPost.create({
		title: req.body.title,
		author: {
			firstName: req.body.author.firstName,
			lastName: req.body.author.lastName
		},
		content: req.body.content,
		created: Date.now()
	})
	.exec()
	.then( post => res.status(201).json(post.showPost()) )
	.catch(err => {
		console.error(err);
		res.status(500).json({errMsg: 'Internal server error'});
	});
});

router.put('/:id', jsonParser, function(req, res) {
	const updateableFields = ['title', 'author', 'content'];
	const toUpdate = {};
	updateableFields.forEach(field => {
		if (field in req.body) {toUpdate[field] = req.body[field];}
	});

	blogPost.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.exec()
	.then(post => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', function(req,res) {
	blogPost.findByIdAndRemove(req.params.id)
	.exec()
	.then(post => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;
