// testMML.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}


describe('MML:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});


	//////////////////////////////////////////////////////////
	it ("Tempo t", function() {
		var ret = parser.compile('t', false);
		var expect = 't\n';
	    assert(ret === expect);

		var ret = parser.compile('t120', false);
		var expect = 't120\n';
	    assert(ret === expect);
	});

	it ("Loop $", function() {
		var ret = parser.compile('abc$def', false);
		var expect = 'abc$def\n';
	    assert(ret === expect);
	});

	it ("Loop [|]", function() {
		var ret = parser.compile('abc[def|gab]cde', false);
		var expect = 'abc[def|gab]cde\n';
	    assert(ret === expect);

		var ret = parser.compile('abc[4def|gab]cde', false);
		var expect = 'abc[4def|gab]cde\n';
	    assert(ret === expect);
	});

	it ("Loop /:/:/", function() {
		var ret = parser.compile('abc/:def/gab:/cde', false);
		var expect = 'abc/:def/gab:/cde\n';
	    assert(ret === expect);

		var ret = parser.compile('abc/:4def/gab:/cde', false);
		var expect = 'abc/:4def/gab:/cde\n';
	    assert(ret === expect);
	});

	it ("Single line comment {}", function() {
		var ret = parser.compile('abc{ comment }def', false);
		var expect = 'abcdef\n';
	    assert(ret === expect);
	});

	it ("Multi line comment {}", function() {
		var ret, expect;

		ret = parser.compile('abc{ str1 ; str2 }def', false);
		expect = 'abc\ndef\n';
	    assert(ret === expect);

		ret = parser.compile('abc{ str1 \n  str2 }def', false);
		expect = 'abcdef\n';
	    assert(ret === expect);

		ret = parser.compile('abc{ str1 \n  str2 \n str 3 }def', false);
		expect = 'abcdef\n';
	    assert(ret === expect);
	});

	//////////////////////////////////////////////////////////
	it ("Sustain s", function() {
		var ret = parser.compile('s', false);
		var expect = 's\n';
	    assert(ret === expect);

		var ret = parser.compile('s100', false);
		var expect = 's100\n';
	    assert(ret === expect);
	});

	it ("Extended sustain s", function() {
		var ret = parser.compile('s100,100', false);
		var expect = 's100,100\n';
	    assert(ret === expect);

		var ret = parser.compile('s100,-100', false);
		var expect = 's100,-100\n';
	    assert(ret === expect);
	});

	it ("Module %", function() {
		var ret = parser.compile('%5', false);
		var expect = '%5 \n';
	    assert(ret === expect);
	});

	it ("Timbre @", function() {
		var ret = parser.compile('@5', false);
		var expect = '@5\n';
	    assert(ret === expect);
	});


	//////////////////////////////////////////////////////////
	it ("Octave o", function() {
		var ret = parser.compile('o', false);
		var expect = 'o\n';
	    assert(ret === expect);

		var ret = parser.compile('o4', false);
		var expect = 'o4\n';
	    assert(ret === expect);
	});

	it ("Octave up/down <>", function() {
		var ret = parser.compile('ab<c>ba', false);
		var expect = 'ab<c>ba\n';
	    assert(ret === expect);
	});


	it ("Note name", function() {
		var ret = parser.compile('cdefgab', false);
		var expect = 'cdefgab\n';
	    assert(ret === expect);

		var ret = parser.compile('c10d10e10f10g10a10b10', false);
		var expect = 'c10d10e10f10g10a10b10\n';
	    assert(ret === expect);
	});

	it ("Accidental mark", function() {
		var ret = parser.compile('c+d+f+g+a+;d-e-g-a-b-', false);
		var expect = 'c+d+f+g+a+\nc+d+f+g+a+\n';  // '-' regularized to '+'
	    assert(ret === expect);

		var ret = parser.compile('c+5d+5f+5g+5a+5;d-5e-5g-5a-5b-5', false);
		var expect = 'c+5d+5f+5g+5a+5\nc+5d+5f+5g+5a+5\n';  // '-' regularized to '+'
	    assert(ret === expect);
	});

	it ("Rest r", function() {
		var ret = parser.compile('r', false);
		var expect = 'r\n';
	    assert(ret === expect);

		var ret = parser.compile('r100', false);
		var expect = 'r100\n';
	    assert(ret === expect);
	});

	it ("Detune k", function() {
		var ret = parser.compile('k', false);
		var expect = 'k\n';
	    assert(ret === expect);

		var ret = parser.compile('k100', false);
		var expect = 'k100\n';
	    assert(ret === expect);

		var ret = parser.compile('k-100', false);
		var expect = 'k-100\n';
	    assert(ret === expect);
	});




	it ("Two args", function() {
		var ret = parser.compile('abs10cd', false);
		var expect = 'abs10cd\n';
	    assert(ret === expect);

		ret = parser.compile('abs10,10cd', false);
		expect = 'abs10,10cd\n';
	    assert(ret === expect);
	});

	it ("Channel Strings", function() {
		parser.resetChannelString();
		var a = [];
		for (var i = 0; i < 100; i++) {
			a.push(parser.getChannelString());
		}

		assert(a[ 0] == '#A');
		assert(a[25] == '#Z');
		assert(a[26] == '#AA');
		assert(a[51] == '#AZ');
		assert(a[52] == '#BA');
	});

});




