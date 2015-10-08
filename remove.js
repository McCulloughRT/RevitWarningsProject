var cheerio = require('cheerio');
var crypto = require('crypto');
var Schema = require('./warning');
var iconv = require('iconv-lite');

var shaSum = "";


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
    console.log('Hash Complete');
    rmCallback();
  });
}


function dehashFile(inputArray, cb) {
  shaSum = crypto.createHash('md5').update(inputArray.toString()).digest('hex');
  Schema.Warning.find({ projID:shaSum }).remove( function(){
    console.log('Errors Removed');
    cb();
  } );
}
