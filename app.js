var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));


db = mongoose.connect('mongodb://localhost/bdb');

mongoose.connection.once('open',function(){
	console.log("database connection successful");
});


var blog = require('./schema.js');
var model = mongoose.model('bmodel');

//middlewares
app.use(function(req,res,next){
	console.log("Time n Date Log ",new Date());
	console.log("Request url Log ",req.originalUrl);
	console.log("Request Method Log ",req.method);
	console.log("Request Ip address Log ",req.ip);
	next();
});

//first page

app.get('/',function(req,res){

	res.send("First Page")
});

//end first page

//show all blogs

app.get('/blogs',function(req,res){



model.find(function(err,result){
	if(err){
		res.send(err)
	}
	else{
		res.send(result)
	}

});
});

//end of show all blogs


//create a blog
app.post('/create',function(req, res) {
		var newBlog = new model({

			title 		: req.body.title,
			subTitle 	: req.body.subTitle,
			blogBody 	: req.body.blogBody,
			author      : req.body.author

		}); // end newBlog

		//date
		var today = Date.now();
		newBlog.created = today;

		//tags
		var allTags = (req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):''
		newBlog.tags = allTags;

		// author
		var authorInfo = {fullName: req.body.authorFullName,email:req.body.authorEmail,website:req.body.authorWebsite};
		newBlog.authorInfo = authorInfo;

		newBlog.save(function(err){
			if(err){
				console.log(err, "something is not working");
				res.send(err);

			}
			else{
				res.send(newBlog);
			}

		});


	});

// end of Create a blog

//view a blog

app.get('/view/:id',function(req, res) {

	var view = req.body;

	model.findOne({'_id':req.params.id},view,function(err,result){

		if(err){
			console.log("something is not working");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});

});
// end of view a blog

// edit a blog
app.put('/:id/edit',function(req, res) {

	var update = req.body;

	model.findOneAndUpdate({'_id':req.params.id},update,function(err,result){

		if(err){
			console.log("something is not working");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});

});
// end of edit a blog



//  delete a blog
app.post('/:id/delete',function(req, res) {

	model.remove({'_id':req.params.id},function(err,result){

		if(err){
			console.log("some error");
			res.send(err)
		}
		else{
			res.send(result)
		}


	});
});

// end of delete blog

//middlewares

//404 error
app.use(function(req, res) {
   res.status('404').send("404: Page not Found");
});
//end of 404 error

//500 error
app.use(function (err, req, res, next) {
  res.status(500).send('Something broke!')
})
//end of 500 error

//port
app.listen(3000, function () {
  console.log('BlogApp  listening on port 3000!');
});
