var etl = require('etl');
var fs = require('fs');
var JSONStream = require('JSONStream');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://192.168.0.117:9200', //Do change the URL
  log: 'trace'
});

var path = process.argv[2];
var key = process.argv[3];
var index = process.argv[4];
var type = process.argv[5];

const main = () => {
	if(path == undefined) return console.log("node json-loader.js <file path> <object key> <index> <type>");
	if(key == undefined) return console.log("node json-loader.js <file path> <object key> <index> <type>");
	if(index == undefined) return console.log("node json-loader.js <file path> <object key> <index> <type>");
	if(type == undefined) return console.log("node json-loader.js <file path> <object key> <index> <type>");
	sendData(fs.createReadStream(path));
}

const sendData = (stream) => {
	stream    
	.pipe(JSONStream.parse(`${key}.*`))    
	.pipe(etl.collect(200))    
	.pipe(etl.elastic.index(client, index, type))
}
  
main()