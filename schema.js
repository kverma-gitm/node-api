var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bschema = new Schema({

	id : {type:String,default:''},
	title : {type:String,default:'',required:true},
	subtitle : {type:String,default:''},
	body :{type:String,default:''},
	created : {type:Date,default:null},
	author : {type:String,default:''},
	comments : []



});

mongoose.model('bmodel',bschema);