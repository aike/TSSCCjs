// TestAST.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}


describe('AST:', function() {
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

	it ("Static macro", function() {
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

	it ("Note shift macro", function() {
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

	it ("Note shift macro with accidental", function() {
		var ret = parser.parse('#A=c+de-; A(5)');
		var expect = [[
			["mml","f+",""],
			["mml","g",""],
			["mml","g+",""]
		]];
	    assert(to_s(ret) === to_s(expect));
	});
});
