var math = require('mathjs');
var Schema = require ('./warning');
var async = require('async');
var fs = require('fs');

exports.QueryDB = QueryDB;
exports.QueryDBMain = QueryDBMain;
exports.TestQuery = TestQuery;

function QueryDB(queryCB) {
	var jsonList = [];
	//var counter = 0;
	var projCount;

	Schema.Warning.find(function (err, returnTotalCount){
		if (err) return callback(err);
		var overTot;
		overTot = returnTotalCount.length;

		Schema.Warning.find().distinct('warningName', function (err, returnNames) {
			if (err) throw err;

			async.each(returnNames, function (name, next){
				var data = {};
				var typeTot;

				//console.log(name);
				async.series([
					function(callback) {

						/* # of projects */
						Schema.Warning.find().distinct('projID', function (err, returnCounts){
							if (err) return callback(err);
							projCount = returnCounts.length;

							data.projNumber = projCount;
							//console.log(counter + ' 1 Done!');
							callback();
						});
					},

					function(callback) {
						Schema.Warning.find({'warningName' : name}, function (err,returnTypeCount){
							if (err) return callback(err);
							typeTot = returnTypeCount.length;
							var avg = typeTot / projCount;

							data.average = Math.round(avg * 100) / 100;
							//console.log(counter + ' 2 Done!');
							callback();
						});
					},

					function(callback) {
						var pctOfTot = typeTot / overTot;
						data.percent = Math.round((pctOfTot * 100)*100) / 100;
						//onsole.log(counter + ' 3 Done!');
						callback();
					},

					function(callback) {
						/* Total warnings per project for IQR chart */
						/* and Min & Max range for a warning type   */
						Schema.Warning.aggregate(
							{$match : {'warningName' : name}},
							{$group : {_id : '$projID', total: {$sum : 1}}},
							{$sort : {'total' : 1}},
							function (err, projRange){
								if (err) return callback(err);

								var projTot = [];
								for (var z = projRange.length - 1; z >= 0; z--) {
									projTot.push(projRange[z].total);
								};
								// fill up array with 0's for projects not included
								for (x = projTot.length; x<projCount; x++){
									projTot.push(0);
								};

								var min = projRange[0].total;
								var max = projRange[projRange.length - 1].total;

								data.iqr = projTot;
								data.minimum = min;
								data.maximum = max;
								//console.log(counter + ' iqr done');
								callback();
						});
					},

					function(callback) {
						/* Std Dev of a warning type */
						Schema.Warning.aggregate(
							{$match : {'warningName' : name}},
							{$group : {_id : '$projID', totalPerProject: {$sum : 1}}},
							function (err, stdDevFunc){
								if (err) return callback(err);

								var projList = [];
								for(stdDevProjs = 0; stdDevProjs < stdDevFunc.length; stdDevProjs++) {
									projList.push(stdDevFunc[stdDevProjs].totalPerProject);
								};
								var stdDev = math.std(projList, 'uncorrected');

								data.deviation = Math.round(stdDev * 100) / 100;
								//console.log(counter + ' std dev done');
								callback();
							}
						);
					},

					function(callback) {
						/* Change over phase (array of avg for each phase) */
						Schema.Warning.aggregate(
							{$match : {'warningName' : name}},
							{$group : {_id : '$projPhase', project : {$addToSet: '$projID'}, totalPerPhase : {$sum: 1}}},
							{$sort : {'_id' : 1}},
							function (err, phaseFunc){
								if (err) return callback(err);
								//console.log(name);
								//console.log(phaseFunc);

								var sdAverage = 0;
								var ddAverage = 0;
								var cdAverage = 0;
								var caAverage = 0;

								for (n=0; n<phaseFunc.length; n++) {
									if (phaseFunc[n]._id === 'SD'){
										sdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
									};
									if (phaseFunc[n]._id === 'DD'){
										ddAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
									};
									if (phaseFunc[n]._id === 'CD'){
										cdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
									};
									if (phaseFunc[n]._id === 'CA'){
										caAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
									};
								};
								data.phases = [{'phase' : 'SD', 'average' : sdAverage}, {'phase' : 'DD', 'average' : ddAverage}, {'phase' : 'CD', 'average' : cdAverage}, {'phase' : 'CA', 'average' : caAverage}]
								//data.phases = {'SD' : sdAverage, 'DD' : ddAverage, 'CD' : cdAverage, 'CA' : caAverage};
								data.warnName = name;
								jsonList.push(data);
								//console.log(counter + ' phases done');
								callback();
							}
						);
					}],

					function(err, results) {
						if(err) return next(err);
						//console.log(data);
						//console.log(counter);
						//counter++;
						next(null, results);
					}); //end of async series

			}, function(err, results) {
				if (err) return next(err);
				console.log('All Done!');
				//console.log(jsonList);

				jsonList.sort(function(a, b) {
					return parseFloat(b.average) - parseFloat(a.average);
				});

				var outputFilename = './public/json/SortedData.json';
				fs.writeFile(outputFilename, JSON.stringify(jsonList, null, 4), function(err) {
					if (err) console.log(err);
					console.log("JSON saved to " + outputFilename);
					queryCB();
				});
				//everything else that happens in the program goes here
			});
		});
	});
}

function QueryDBMain(queryCBMain) {
	console.log('Main Query Started');
	//var jsonList = [];
	var counter = 0;
	var projCount;
	//var name = "*";

	var data = {};
	var typeTot;
	var overTot;

	async.series([
		function(callback) {

			/* # of projects */
			Schema.Warning.find().distinct('projID', function (err, returnCounts){
				if (err) return callback(err);
				projCount = returnCounts.length;

				data.projNumber = projCount;
				//console.log(counter + ' 1 Done!');
				callback();
			});
		},

		function(callback) {
			Schema.Warning.find(function (err,returnTypeCount){
				if (err) return callback(err);
				typeTot = returnTypeCount.length;
				var avg = typeTot / projCount;

				data.average = Math.round(avg * 100) / 100;
				//console.log(counter + ' 2 Done!');
				callback();
			});
		},

		function(callback) {
			/* Total warnings per project for IQR chart */
			/* and Min & Max range for a warning type   */
			Schema.Warning.aggregate(
				//{$match : {'warningName' : name}},
				{$group : {_id : '$projID', total: {$sum : 1}}},
				{$sort : {'total' : 1}},
				function (err, projRange){
					if (err) return callback(err);

					var projTot = [];
					for (var z = projRange.length - 1; z >= 0; z--) {
						projTot.push(projRange[z].total);
					};
					// fill up array with 0's for projects not included
					for (x = projTot.length; x<projCount; x++){
						projTot.push(0);
					};

					var min = projRange[0].total;
					var max = projRange[projRange.length - 1].total;

					data.iqr = projTot;
					data.minimum = min;
					data.maximum = max;
					//console.log(counter + ' iqr done');
					callback();
			});
		},

		function(callback) {
			/* Std Dev of a warning type */
			Schema.Warning.aggregate(
				//{$match : {'warningName' : name}},
				{$group : {_id : '$projID', totalPerProject: {$sum : 1}}},
				function (err, stdDevFunc){
					if (err) return callback(err);

					var projList = [];
					for(stdDevProjs = 0; stdDevProjs < stdDevFunc.length; stdDevProjs++) {
						projList.push(stdDevFunc[stdDevProjs].totalPerProject);
					};
					var stdDev = math.std(projList, 'uncorrected');

					data.deviation = Math.round(stdDev * 100) / 100;
					//console.log(counter + ' std dev done');
					callback();
				}
			);
		},

		function(callback) {
			/* Change over phase (array of avg for each phase) */
			Schema.Warning.aggregate(
				//{$match : {'warningName' : name}},
				{$group : {_id : '$projPhase', project : {$addToSet: '$projID'}, totalPerPhase : {$sum: 1}}},
				{$sort : {'_id' : 1}},
				function (err, phaseFunc){
					if (err) return callback(err);
					//console.log(name);
					//console.log(phaseFunc);

					var sdAverage = 0;
					var ddAverage = 0;
					var cdAverage = 0;
					var caAverage = 0;

					for (n=0; n<phaseFunc.length; n++) {
						if (phaseFunc[n]._id === 'SD'){
							sdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
						};
						if (phaseFunc[n]._id === 'DD'){
							ddAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
						};
						if (phaseFunc[n]._id === 'CD'){
							cdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
						};
						if (phaseFunc[n]._id === 'CA'){
							caAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
						};
					};
					data.phases = [{'phase' : 'SD', 'average' : sdAverage}, {'phase' : 'DD', 'average' : ddAverage}, {'phase' : 'CD', 'average' : cdAverage}, {'phase' : 'CA', 'average' : caAverage}]
					//jsonList.push(data);
					callback();
				}
			);
		}],

		// call back for async.series
		function(err, results) {
			if(err) return (err);

			/* Copied from async.each callback */
			var outputFilename = './public/json/MainData.json';
			fs.writeFile(outputFilename, JSON.stringify(data, null, 4), function(err) {
				if (err) console.log(err);
				console.log("JSON saved to " + outputFilename);
				queryCBMain();
			});
		}); //end of async series
} // end of exported function

function TestQuery(testqueryCB) {
	console.log('Function Started At: ');
	var startMainClock = new Date().getTime();
	console.log(startMainClock);
	//var jsonList = [];
	var counter = 0;
	var projCount;
	var name = "Highlighted walls overlap. One of them may be ignored when Revit finds room boundaries. Use Cut Geometry to embed one wall within the other.";

	var data = {};
	var typeTot;
	var overTot;

	Schema.Warning.find(function (err, returnTotalCount){
		if (err) return callback(err);
		overTot = returnTotalCount.length;

		async.series([
			function(callback) {
				/* # of projects */
				var startClock = new Date().getTime();
				Schema.Warning.find().distinct('projID', function (err, returnCounts){
					if (err) return callback(err);
					projCount = returnCounts.length;

					data.projNumber = projCount;
					//console.log(counter + ' 1 Done!');
					var stopClock = new Date().getTime();
					var time = stopClock - startClock;
					console.log('Project Count Query Took: ');
					console.log(time);
					callback();
				});
			},

			function(callback) {
				/* Average # of warnings */
				var startClock = new Date().getTime();
				Schema.Warning.find({'warningName' : name}, function (err,returnTypeCount){
					if (err) return callback(err);
					typeTot = returnTypeCount.length;
					var avg = typeTot / projCount;

					data.average = avg;
					//console.log(counter + ' 2 Done!');
					var stopClock = new Date().getTime();
					var time = stopClock - startClock;
					console.log('Schema.Warning Average Query Took: ');
					console.log(time);
					callback();
				});
			},

			function(callback) {
				/* Percent of total */
				var startClock = new Date().getTime();
				var pctOfTot = typeTot / overTot;

				data.percent = Math.round((pctOfTot * 100)*100) / 100;
				//onsole.log(counter + ' 3 Done!');
				var stopClock = new Date().getTime();
				var time = stopClock - startClock;
				console.log('Schema.Warning Percent Query Took: ');
				console.log(time);
				callback();
			},

			function(callback) {
				/* Total warnings per project for IQR chart */
				/* and Min & Max range for a warning type   */
				var startClock = new Date().getTime();
				Schema.Warning.aggregate(
					{$match : {'warningName' : name}},
					{$group : {_id : '$projID', total: {$sum : 1}}},
					{$sort : {'total' : 1}},
					function (err, projRange){
						if (err) return callback(err);

						var projTot = [];
						for (var z = projRange.length - 1; z >= 0; z--) {
							projTot.push(projRange[z].total);
						};
						// fill up array with 0's for projects not included
						for (x = projTot.length; x<projCount; x++){
							projTot.push(0);
						};

						var min = projRange[0].total;
						var max = projRange[projRange.length - 1].total;

						data.iqr = projTot;
						data.minimum = min;
						data.maximum = max;
						//console.log(counter + ' iqr done');
						var stopClock = new Date().getTime();
						var time = stopClock - startClock;
						console.log('Schema.Warning IQR Query Took: ');
						console.log(time);
						callback();
				});
			},

			function(callback) {
				/* Std Dev of a warning type */
				var startClock = new Date().getTime();
				Schema.Warning.aggregate(
					{$match : {'warningName' : name}},
					{$group : {_id : '$projID', totalPerProject: {$sum : 1}}},
					function (err, stdDevFunc){
						if (err) return callback(err);

						var projList = [];
						for(stdDevProjs = 0; stdDevProjs < stdDevFunc.length; stdDevProjs++) {
							projList.push(stdDevFunc[stdDevProjs].totalPerProject);
						};
						var stdDev = math.std(projList, 'uncorrected');

						data.deviation = Math.round(stdDev * 100) / 100;
						//console.log(counter + ' std dev done');
						var stopClock = new Date().getTime();
						var time = stopClock - startClock;
						console.log('Schema.Warning Deviation Query Took: ');
						console.log(time);
						callback();
					}
				);
			},

			function(callback) {
				/* Change over phase (array of avg for each phase) */
				var startClock = new Date().getTime();
				Schema.Warning.aggregate(
					{$match : {'warningName' : name}},
					{$group : {_id : '$projPhase', project : {$addToSet: '$projID'}, totalPerPhase : {$sum: 1}}},
					{$sort : {'_id' : 1}},
					function (err, phaseFunc){
						if (err) return callback(err);
						//console.log(name);
						//console.log(phaseFunc);

						var sdAverage = 0;
						var ddAverage = 0;
						var cdAverage = 0;
						var caAverage = 0;

						for (n=0; n<phaseFunc.length; n++) {
							if (phaseFunc[n]._id === 'SD'){
								sdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
							};
							if (phaseFunc[n]._id === 'DD'){
								ddAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
							};
							if (phaseFunc[n]._id === 'CD'){
								cdAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
							};
							if (phaseFunc[n]._id === 'CA'){
								caAverage = (phaseFunc[n].totalPerPhase)/(phaseFunc[n].project.length);
							};
						};
						data.phases = [{'phase' : 'SD', 'average' : sdAverage}, {'phase' : 'DD', 'average' : ddAverage}, {'phase' : 'CD', 'average' : cdAverage}, {'phase' : 'CA', 'average' : caAverage}]
						//jsonList.push(data);
						var stopClock = new Date().getTime();
						var time = stopClock - startClock;
						console.log('Schema.Warning Phase Query Took: ');
						console.log(time);
						callback();
					}
				);
			}],

			// call back for async.series
			function(err, results) {
				if(err) return (err);
				var stopMainClock = new Date().getTime();
				var mainTime = stopMainClock - startMainClock;
				console.log('Function Ended at: ');
				console.log(stopMainClock);
				console.log('Total Time: ');
				console.log(mainTime);
				testqueryCB();
			}); //end of async series
	});
} // end of exported function
