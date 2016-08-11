// testDirective.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}

describe('Directive:', function() {
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
