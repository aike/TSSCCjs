// TestExtendedMML.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}


describe('TCP Extended MML:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});

	it ("Line separator ;", function() {
		var ret = parser.compile('abc;def', false);
		var expect = 'abc\ndef\n';
	    assert(ret === expect);
	});

	it ("#TEMP (ignore)", function() {
		var ret = parser.compile('#TEMP', false);
		var expect = '\n';
	    assert(ret === expect);
	});

});

describe('ATCP Extended MML:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});

	it ("#MACRO (ignore)", function() {
		var ret = parser.compile('#MACRO', false);
		var expect = '\n';
	    assert(ret === expect);

		var ret = parser.compile('#MACRO STATIC', false);
		var expect = '\n';
	    assert(ret === expect);
	});

	it ("#JUMP (ignore)", function() {
		var ret = parser.compile('#JUMP', false);
		var expect = '\n';
	    assert(ret === expect);
	});

	it ("FM Feedback @f (ignore)", function() {
		var ret = parser.compile('@f', false);
		var expect = '\n';
	    assert(ret === expect);

		var ret = parser.compile('@f3', false);
		var expect = '\n';
	    assert(ret === expect);
	});

	it ("Detune @k (ignore)", function() {
		var ret = parser.compile('@k', false);
		var expect = '\n';
	    assert(ret === expect);

		var ret = parser.compile('@k', false);
		var expect = '\n';
	    assert(ret === expect);
	});


});
