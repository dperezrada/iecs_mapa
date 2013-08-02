/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'Bob'
  });
};



exports.pathology = function(req, res) {
	var MongoClient = require('mongodb').MongoClient, 
		format = require('util').format;
	MongoClient.connect('mongodb://localhost:27017/iecsmapa', function(err, db){
		if(err) throw err;
		var resp = {};
		db.collection('studies').find({'Pathology': req.params['pathology']}).toArray(function (err, items){
			resp['studies'] = items;
			db.collection('pathologies').find({'pathology': req.params['pathology']}).toArray(function (err, item){
				resp['pathology'] = item[0];
				res.json(resp);
				db.close();
			});
		});

	});
};
exports.pathologies = function(req, res){
	var MongoClient = require('mongodb').MongoClient, 
		format = require('util').format;
	MongoClient.connect('mongodb://localhost:27017/iecsmapa', function(err, db){
		if(err) throw err;
		var resp = {};
		db.collection('pathologies').find({}, {'pathology': true, 'display_name': true}).toArray(function (err, items){
			resp['pathologies'] = items;
			res.json(resp);
			db.close();
		});
	});
};