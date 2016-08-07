// test.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}



describe('MML Parser:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});

	it ("Note", function() {
		var ret = parser.parseLine('cde');
		var expect = [
			["mml","c",""],
			["mml","d",""],
			["mml","e",""]
		];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Multi line", function() {
		var ret = parser.parse('cde; fg');
		var expect = [
			[
				["mml","c",""],
				["mml","d",""],
				["mml","e",""]
			],
			[
				["mml","f",""],
				["mml","g",""],
			]
		];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Macro", function() {
		var ret = parser.parse('#A=cde; A');
		var expect = [
			[
				["mml","c",""],
				["mml","d",""],
				["mml","e",""]
			]
		];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Transpose macro", function() {
		var ret = parser.parse('#A=cde; A(5)');
		var expect = [
			[
				["mml","f",""],
				["mml","g",""],
				["mml","a",""]
			]
		];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Transpose macro with Accidental", function() {
		var ret = parser.parse('#A=c+de-; A(5)');
		var expect = [[
			["mml","f+",""],
			["mml","g",""],
			["mml","g+",""]
		]];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Compile MML", function() {
		var ret = parser.compile('abcde', false);
		var expect = 'abcde\n';
	    assert(ret === expect);
	});

	it ("Compile MML with macro", function() {
		var ret = parser.compile('#A=c+de-; A(5)', false);
		var expect = 'f+gg+\n';
	    assert(ret === expect);
	});

	it ("#END directive", function() {
		var ret = parser.compile('abc#ENDdef;gab', false);
		var expect = 'abc\n';
	    assert(ret === expect);
	});

	it ("Comment", function() {
		var ret = parser.compile('abc{ comment }def', false);
		var expect = 'abcdef\n';
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
	})


});

