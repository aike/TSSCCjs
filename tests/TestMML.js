// test.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}


describe('MML abstract syntax tree:', function() {
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
});

describe('MML directive:', function() {
	var parser;
	before(function() {
		parser = new MMLParser();
	});

	it ("#MML", function() {
		var ret = parser.compile('#MML;abcdef;', false);
		var expect = 'abcdef\n';	// ignore
	    assert(ret === expect);
	});

	it ("#TITLE", function() {
		var ret = parser.compile('#TITLE<song title string>;abc;', true);
		var expect = '#TITLE <song title string>\n#CHANNEL 1\n#A\nabc\n';
	    assert(ret === expect);

		ret = parser.compile('abc;', true);
		expect = '#TITLE <>\n#CHANNEL 1\n#A\nabc\n';
	    assert(ret === expect);
	});

	it ("#CHANNEL", function() {
		var ret = parser.compile('#CHANNEL20;abc;', true);	
		var expect = '#TITLE <>\n#CHANNEL 1\n#A\nabc\n'; // generate correct number 
	    assert(ret === expect);
	});

	it ("#PRAGMA", function() {
		var ret, expect;
		ret = parser.compile('abc;#PRAGMAFAMICOM;def;', false);	
		expect = '#PRAGMA FAMICOM\nabc\ndef\n';
	    assert(ret === expect);

		ret = parser.compile('abc;#PRAGMAGAMEBOY;def;', false);	
		expect = '#PRAGMA GAMEBOY\nabc\ndef\n';
	    assert(ret === expect);
	});

	it ("#WAV", function() {
		var ret = parser.compile('#WAV0,<(127,-127),16,(-127,-127),16>;abc;', false);	
		var expect = '#WAV 0,<(127,-127),16,(-127,-127),16>\nabc\n';
	    assert(ret === expect);

		var ret = parser.compile('#WAV0<(127,-127),16,(-127,-127),16>;abc;', false); // omit comma
		var expect = '#WAV 0,<(127,-127),16,(-127,-127),16>\nabc\n'; // insert comma
	    assert(ret === expect);
	});

	it ("#TABLE", function() {
		var ret = parser.compile('#TABLE0,<(16,127),8,(127,0),136>;abc;', false);
		var expect = '#TABLE 0,<(16,127),8,(127,0),136>\nabc\n';
	    assert(ret === expect);

		ret = parser.compile('#TABLE0<(16,127),8,(127,0),136>;abc;', false); // omit comma
		expect = '#TABLE 0,<(16,127),8,(127,0),136>\nabc\n'; // insert comma
	    assert(ret === expect);
	});

	it ("#OCTAVE", function() {
		var ret, expect;
		ret = parser.compile('abc;#OCTAVENORMAL;def;', false);	
		expect = '#OCTAVE NORMAL\nabc\ndef\n';
	    assert(ret === expect);

		ret = parser.compile('abc;#OCTAVEREVERSE;def;', false);	
		expect = '#OCTAVE REVERSE\nabc\ndef\n';
	    assert(ret === expect);
	});

	it ("#VOLUME", function() {
		var ret, expect;
		ret = parser.compile('abc;#VOLUMENORMAL;def;', false);	
		expect = '#VOLUME NORMAL\nabc\ndef\n';
	    assert(ret === expect);

		ret = parser.compile('abc;#VOLUMEREVERSE;def;', false);	
		expect = '#VOLUME REVERSE\nabc\ndef\n';
	    assert(ret === expect);
	});

	it ("#FINENESS", function() {
		var ret = parser.compile('#FINENESS65535;abc;', false);	
		var expect = '#FINENESS 65535\nabc\n';
	    assert(ret === expect);
	});

	it ("#END", function() {
		var ret = parser.compile('abc;#ENDdef;gab', false);
		var expect = 'abc\n';
	    assert(ret === expect);
	});


});



describe('MML Parser:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});

	it ("Static Macro", function() {
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

	it ("Note shift macro with Accidental", function() {
		var ret = parser.parse('#A=c+de-; A(5)');
		var expect = [[
			["mml","f+",""],
			["mml","g",""],
			["mml","g+",""]
		]];
	    assert(to_s(ret) === to_s(expect));
	});

	it ("Static Macro (left)", function() {
		var ret = parser.compile('#A=v;A10abc;', false);
		var expect = 'v10abc\n';
	    assert(ret === expect);
	});

	it ("Static Macro (right)", function() {
		var ret = parser.compile('#A=10;abcvA;', false);
		var expect = 'abcv10\n';
	    assert(ret === expect);
	});

	it ("Static Macro (middle)", function() {
		var ret = parser.compile('#A=10;abcvAefg;', false);
		var expect = 'abcv10efg\n';
	    assert(ret === expect);
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

	it ("WAVB macro", function() {
		var ret = parser.compile('#WAVB0,8090a0b0c0d0e0f0f0e0d0c0b0a0908070605040302010000010203040506070;', false);
		var expect = '#WAV 0,<0,16,32,48,64,80,96,112,112,96,80,64,48,32,16,0,-16,-32,-48,-64,-80,-96,-112,-128,-128,-112,-96,-80,-64,-48,-32,-16>\n';
	    assert(ret === expect);
	});

	it ("Single line comment", function() {
		var ret = parser.compile('abc{ comment }def', false);
		var expect = 'abcdef\n';
	    assert(ret === expect);
	});

	it ("Multi line comment", function() {
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

