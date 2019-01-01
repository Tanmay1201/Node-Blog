var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/add',function(req, res, next){
    var category = db.get('categories');
    category.find({},{}, function(err, category){
            res.render('addpost',{
            'title': 'Add Post',
            'categories' : 'category'
        });
    });
});

/*router.get('/show/:id', function(req,res,next){
    var db = req.db;
    var posts = db.get('posts');
    posts.findbyId(req.params.id, function(err, posts){
        res.render('show',{
            "posts": posts
        });
    });
});*/

router.post('/add', function(req,res,next){
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author_name = req.body.author_name;
    var date = new Date();

    if(req.files.mainimage){
        console.log('uploading picture..');
        var mainimageoriginalimage = req.file.mainimage.originalname;
        var mainimagename          = req.file.mainimage.name;
        var mainimagemime          = req.file.mainimage.mimetype;
        var mainimagepath          = req.file.mainimage.path;
        var mainimageext           = req.file.mainimage.extension;
        var mainimagesize          = req.file.mainimage.size;
      } else {
          var mainimagename = 'noimage.png';
      }
  
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){
        res.render('addpost',{
            "errors": errors,
            "title": title,
            "body": body
        });
    } else {
        var posts = db.get('posts');
        posts.insert({
            "title": title,
            "body": body,
            "category": category,
            "date" : date,
            "author": author_name,
            "mainimage": mainimagename
        }, function(err,post){
        if(err){
            res.send('There is issue');
        } else {
            req.flash('success', 'Post Submitted');
            res.location('/');
            res.redirect('/');
        }
    }); 
    
    }
});
module.exports = router;
