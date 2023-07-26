//create webserver
var express = require('express');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var fs = require('fs');
var cors = require('cors');
var path = require('path');
var mongoose = require('mongoose');
var Comment = require('./models/comment');
var config = require('./config');
var router = express.Router();

mongoose.connect(config.getDbConnectionString());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/api', router);

//get all comments
router.route('/comments')
    .get(function(req, res) {
        Comment.find(function(err, comments) {
            if (err) {
                res.send(err);
            }
            res.json(comments);
        });
    });

//post new comment
router.route('/comments')
    .post(function(req, res) {
        var comment = new Comment();
        comment.author = req.body.author;
        comment.text = req.body.text;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Post created!'});
        });
    });

//delete comment
router.route('/comments/:comment_id')
    .delete(function(req, res) {
        Comment.remove({
            _id: req.params.comment_id
        }, function(err, comment) {
            if (err) {
                res.send(err);
            }
            res.json({message: 'Successfully deleted'});
        });
    });

//update comment
router.route('/comments/:comment_id')
    .put(function(req, res) {
        Comment.findById(req.params.comment_id, function(err, comment) {
            if (err) {
                res.send(err);
            }
            comment.author = req.body.author;
            comment.text = req.body.text;
            comment.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Comment updated!'});
            });
        });
    });

app.listen(port);
console.log('Server is running on port ' + port);