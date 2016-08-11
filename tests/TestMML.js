// TestMML.js by aike
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

	it ("Note name abcdefg", function() {
		var ret = parser.compile('cdefgab', false);
		var expect = 'cdefgab\n';
	    assert(ret === expect);

		var ret = parser.compile('c10d10e10f10g10a10b10', false);
		var expect = 'c10d10e10f10g10a10b10\n';
	    assert(ret === expect);
	});

	it ("Accidental mark +-", function() {
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

	it ("Pitch modulation mp", function() {
		var ret = parser.compile('mp65535,100,100,-128,100', false);
		var expect = 'mp65535,100,100,-128,100\n';
	    assert(ret === expect);
	});

	it ("Note envelope nt", function() {
		var ret = parser.compile('nt100,100', false);
		var expect = 'nt100,100\n';
	    assert(ret === expect);
	});

	it ("Panpot p", function() {
		var ret = parser.compile('p', false);
		var expect = 'p\n';
	    assert(ret === expect);

		var ret = parser.compile('p2', false);
		var expect = 'p2\n';
	    assert(ret === expect);
	});


	//////////////////////////////////////////////////////////
	it ("Volume v", function() {
		var ret = parser.compile('v', false);
		var expect = 'v\n';
	    assert(ret === expect);

		var ret = parser.compile('v10', false);
		var expect = 'v10\n';
	    assert(ret === expect);
	});

	it ("Stereo volume v", function() {
		var ret = parser.compile('v10,10c', false);
		var expect = 'v10,10c\n';
	    assert(ret === expect);

		var ret = parser.compile('v10,c', false);
		var expect = 'v10,c\n';
	    assert(ret === expect);

		var ret = parser.compile('v,10c', false);
		var expect = 'v,10c\n';
	    assert(ret === expect);
	});

	it ("Extnded volume @v", function() {
		var ret = parser.compile('@v', false);
		var expect = '@v\n';
	    assert(ret === expect);

		var ret = parser.compile('@v100', false);
		var expect = '@v100\n';
	    assert(ret === expect);
	});

	it ("Extended stereo volume @v", function() {
		var ret = parser.compile('@v100,100c', false);
		var expect = '@v100,100c\n';
	    assert(ret === expect);

		var ret = parser.compile('@v100,c', false);
		var expect = '@v100,c\n';
	    assert(ret === expect);

		var ret = parser.compile('@v,100c', false);
		var expect = '@v,100c\n';
	    assert(ret === expect);
	});

	it ("Volume up/down ()", function() {
		var ret = parser.compile('ab(c)ba', false);
		var expect = 'ab(c)ba\n';
	    assert(ret === expect);
	});

	// unsupported command in TSS JavaScript version
	it ("Volume relative up ~ (ignore)", function() {
		var ret = parser.compile('ab~cd', false);
		var expect = 'abcd\n';
	    assert(ret === expect);

		var ret = parser.compile('ab~100cd', false);
		var expect = 'abcd\n';
	    assert(ret === expect);
	});

	// unsupported command in TSS JavaScript version
	it ("Volume relative down _ (ignore)", function() {
		var ret = parser.compile('ab_cd', false);
		var expect = 'abcd\n';
	    assert(ret === expect);

		var ret = parser.compile('ab_100cd', false);
		var expect = 'abcd\n';
	    assert(ret === expect);
	});

	it ("Volume envelope na", function() {
		var ret = parser.compile('na100,100c', false);
		var expect = 'na100,100c\n';
	    assert(ret === expect);
	});

	it ("Mode x", function() {
		var ret = parser.compile('x1,1c', false);
		var expect = 'x1,1c\n';
	    assert(ret === expect);

		var ret = parser.compile('x1,c', false);
		var expect = 'x1,c\n';
	    assert(ret === expect);

		var ret = parser.compile('x,1c', false);
		var expect = 'x,1c\n';
	    assert(ret === expect);
	});

	it ("FM input @i", function() {
		var ret = parser.compile('@i8,2', false);
		var expect = '@i8,2\n';
	    assert(ret === expect);
	});

	it ("FM output @o", function() {
		var ret = parser.compile('@o1,2', false);
		var expect = '@o1,2\n';
	    assert(ret === expect);
	});

});




