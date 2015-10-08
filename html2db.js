var cheerio = require('cheerio');
var crypto = require('crypto');
var Schema = require('./warning');
var name = require('./namereplace');
var fs = require('fs');
var iconv = require('iconv-lite');
var async = require('async');

var shaSum = "";


exports.ParseUpload = ParseUpload;
exports.RemoveProject = RemoveProject;

function ParseUpload(file, phase, mainCB) {
  //console.log('html2db activated!');
  var decodedString = iconv.decode(file,'utf16-le');
  var	$ = cheerio.load(decodedString, {
  		normalizeWhitespace: true,
  	});

  var trNodes = [];
  $('tr').each(function(z, elem) {
  	trNodes[z] = $(this).html().trim();
  });

  // hash the resulting nodes and compare to db, fail if found
  hashFile(trNodes, function(hashError){
    if(hashError) {
      console.log('there was a hash error');
      mainCB(hashError);
    } else {
      console.log('Hash Complete');

      var warningsArray = [];

      // office entry is deprecated due to anonymity concerns. The field is entered
      // as "BLANK", but still exists for possible future integration with secure system
      var offic = "BLANK";
      var pID = shaSum;
      var pPh = phase;
      var d = new Date();

      // each trNode represents a warning
      // iterate through array and add db Object from each item
      for(i=0; i < trNodes.length; i++) {
      	var trNode = cheerio.load(trNodes[i]);

      	var tdNodes = [];
      	trNode('td').each(function(y, elem) {
      		tdNodes[y] = trNode(this).html().trim();
      	});

      	//tdNodes[0] contains warning name
      	//tdNodes[1] contains elements for parsing
      	tdNodes[0] = regExApos(tdNodes[0]);
        var finalName = name.NameReplace(tdNodes[0]);

      	if (tdNodes[1].indexOf("<br>") === -1) {
      		var toParse = [];
      		toParse.push(tdNodes[1]);
      		toParse[0] = regEx(toParse[0]);
      		var elems = extract(toParse);
      	} else {
      		var cleanArray = [];
      		var splitArr = tdNodes[1].split("<br>");
      		for(n=0;n<splitArr.length;n++){
      			var buf = regEx(splitArr[n]);
      			if(buf.length > 1) {
      				cleanArray.push(buf);
      			}
      		}
      		var elems = extract(cleanArray);
      	}

      	var warn = new Schema.Warning({
      		office: offic,
      		projID: pID,
      		projPhase: pPh,
      		uploadTime: d,
      		warningName: finalName,
      		elementTypes: elems
      	});
        warningsArray.push(warn);
      }

      async.each(warningsArray, function(warnItem, callback){
        warnItem.save(function(err){
          if(err) throw err;
          //console.log('Schema.Warning Saved');
          callback();
        });
      }, function(err) {
        if(err) {
          console.log('something failed to process');
        } else {
          //console.log('All files processed');
          mainCB();
        }
      });
    }
  });
}

function RemoveProject(file, rmCallback) {
  var decodedString = iconv.decode(file,'utf16-le');
  var	$ = cheerio.load(decodedString, {
      normalizeWhitespace: true,
    });

  var trNodes = [];
  $('tr').each(function(z, elem) {
    trNodes[z] = $(this).html().trim();
  });

  dehashFile(trNodes, function(dehashError){
    console.log('dehash Complete');
    rmCallback();
  });
}

function extract (stringArr) {
	var elements = [];
	for(y=0; y < stringArr.length; y++) {
		if (stringArr[y] === undefined) {
			elements.push('');
			return elements;
		}
		var parseArr = stringArr[y].split(":",3);
		if(parseArr[1] === '') {
			elements.push(parseArr[2].trim());
		} else {
			elements.push(parseArr[1].trim());
		}
	}
	return elements;
}

function regEx (string) {
	var step1 = string.replace(/<(?!\/)/ig,"");
	var step2 = step1.replace(/="">/ig,"");
	var step3 = step2.replace(/(<([^>]+)>)/ig,"");
	var step4 = step3.replace(/>/ig,"");
	var step5 = step4.replace(/:=""/ig,"");
	var step6 = step5.replace(/=""/ig,"");
	var step7 = step6.replace(/\&quot;/ig,"");
	return step7;
}

function regExApos (string) {
	var step1 = string.replace(/\&apos;/ig,"");
	var step2 = step1.replace(/\&quot;/ig,"");
	return step2;
}

function hashFile(inputArray, cb) {
  shaSum = crypto.createHash('md5').update(inputArray.toString()).digest('hex');

  Schema.Warning.find({'projID' : shaSum}, function (err,returnTypeCount){
    if (err) return (err);
    if (returnTypeCount.length > 0) {
      var hashError = true;
      console.log('This already exists');
      cb(hashError);
    } else {
      cb();
    }
  });
}

function dehashFile(inputArray, cb) {
  shaSum = crypto.createHash('md5').update(inputArray.toString()).digest('hex');
  Schema.Warning.find({ projID:shaSum }).remove( function(){
    //if (err) return err;
    console.log('Errors Removed');
    cb();
  } );
}
