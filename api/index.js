const express = require("express");

// DATABASE SETUP
var mongoose = require('mongoose') //.set('debug', true);
var mongodbUri = require('mongodb-uri');
const moment = require('moment')

var Infer = require('./app/models/Infer');
var Agent = require('./app/models/Agent');


var ObjectId = require('mongoose').Types.ObjectId;


// Create express app as usual
const app = express();


if ("MONGODB" in process.env) {
	mongoose.connect(mongodbUri.formatMongoose(process.env["MONGODB"]));
} else {
	mongoose.connect('mongodb://localhost:27017/cocoonaks');
}

// Handle the connection event
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("DB connection alive");
});


// CORS
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


function getForceGraph(results) {
	const nodes = []
	const tmp_nodes = []
	const links = []

	let lastObject = ""

	for (t in results) {

		for (var i = 0; i < results[t].results.length; i++) {
			if (!tmp_nodes.includes(results[t].results[i])) {
				tmp_nodes.push(results[t].results[i])
			}

			if (i > 0) {
				links.push({ from: results[t].results[i-1], to: results[t].results[i] })
			}
		}
		
		//console.log(results[t].results);
		for (n in results[t].results) {
			//console.log(n);
			//console.log(results[t].results[n]);
			//tmp_nodes.push(results[t].results[n])
		}
		//console.log(results[t].results);
		// if (results[t]["results"].length > 1) {
		// 	let from = results[t]["results"][0] 

		// 	if (!tmp_nodes.includes(from)) {
		// 		tmp_nodes.push(from)
		// 	}

		// 	if (results[t]["results"].length > 2) {
		// 		let to = results[t]["results"][1] 


		// 		if (!tmp_nodes.includes(to)) {
		// 			tmp_nodes.push(to)
		// 		}

		// 		links.push({ from: from, to: to })
		// 	}
		// }
		lastObject = results[t]["_id"]
	}


	for (i in tmp_nodes) {
		nodes.push({ title: tmp_nodes[i],label: tmp_nodes[i], id: tmp_nodes[i], "group": i, font: '30px arial black' })
	}

	const edges = links
	results = { nodes, edges, lastObject }
	return results
}




app.get('/api/coco/vis', function (req, res) {

	console.log("Getting vis");
	
	Infer.find({}, function (err, transactions) {
		if (err) {
			console.log(err);
		} else {
			results = getForceGraph(transactions);
			res.json(results);
		}
	}).sort([['_id', -1]]).limit(10);
});


app.get('/api/coco/vis/:lastObject', function (req, res) {

	console.log("Getting vis delta");
	console.log(req.params.lastObject);
	Infer.find({"_id": {"$gt": new ObjectId(req.params.lastObject)}}, function (err, transactions) {
		if (err) {
			console.log(err);
		} else {
			results = getForceGraph(transactions);
			res.json(results);
		}
	});
});




app.get('/api/coco/clear', function (req, res) {

	
	mongoose.connection.db.dropCollection('agents', function(err, result) {
		console.log("Cleared Down agents");
	});
	mongoose.connection.db.dropCollection('inferences', function(err, result) {
		console.log("Cleared Down inferences");
	});

	res.json({"message": "OK"})
});


app.get('/api/coco/agents', function (req, res) {

	
	console.log("Getting Agents");
	Agent.find({}, function (err, results) {
		if (err) {
			console.log(err);
		} else {
			res.json({agents: results.length});
		}
	});
});


app.get('/api/coco/cost', function (req, res) {

	
	console.log("Getting Cost");
	Agent.find({}, function (err, results) {
		if (err) {
			console.log(err);
		} else {
			let totalSeconds = 0
			let totalCost = 0 

			for (a in results) {
				totalSeconds = totalSeconds + ((Date.now() - results[a]["date"])/1000)
				totalCost = (totalSeconds * 0.000006) + (totalSeconds * 0.000018)
			}

			res.json({cost: totalCost.toPrecision(3)});
		}
	});
});


app.get('/api/coco/stats', function (req, res) {
	
	console.log("Getting Stats");
	var d = new Date();
	d.setMinutes(d.getMinutes() - 1);

	Infer.count({"date": {"$gt": d}}, function (err, results) {
		if (err) {
			console.log(err);
		} else {
			res.json({tpm: results});
		}
	}).count()

});




app.get('/api/coco/images/:lastObject', function (req, res) {

	console.log("Getting vis images");

	Infer.find({"_id": {"$gt": new ObjectId(req.params.lastObject)}},{image:1},  function (err, results) {
		if (err) {
			console.log(err);
		} else {
			res.json(results);
		}
	});
});

const PORT = process.env.PORT || 7071;

app.listen(PORT, () => console.log(`API listening on port ${PORT}!`))