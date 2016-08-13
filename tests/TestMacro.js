// TestMacro.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}


describe('Macro:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
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


	it ("Shift note macro", function() {
        var ret = parser.compile('#A=cdef;A(0)A(-2)A(2)A(e-)', false);
      	var expect = 'cdef>a+<cdd+def+gd+fgg+\n';
	    assert(ret === expect);
	});

	it ("Shift note macro with accidental", function() {
		var ret = parser.compile('#A=c+de-; A(5)', false);
		var expect = 'f+gg+\n';
	    assert(ret === expect);
	});

	it ("Shift note macro octave up", function() {
		var ret = parser.compile('#A=b<cd; A(1)', false);
		var expect = '<cc+d+\n';
	    assert(ret === expect);
	});

	it ("Shift note macro octave reverse", function() {
		var ret = parser.compile('#OCTAVE REVERSE; #A=b>cd; A(1)', false);
		var expect = '#OCTAVE REVERSE\n>cc+d+\n';
	    assert(ret === expect);
	});

	it ("Shift note with repeat []", function() {
		var ret = parser.compile('ab<[4c]', false);
		var expect = 'ab<[4c]\n';
	    assert(ret === expect);
	});

	it ("Shift note with repeat /: :/", function() {
		var ret = parser.compile('ab</:4c:/', false);
		var expect = 'ab</:4c:/\n';
	    assert(ret === expect);
	});

	it ("WAVB macro", function() {
		var ret = parser.compile('#WAVB0,8090a0b0c0d0e0f0f0e0d0c0b0a0908070605040302010000010203040506070;', false);
		var expect = '#WAV 0,<0,16,32,48,64,80,96,112,112,96,80,64,48,32,16,0,-16,-32,-48,-64,-80,-96,-112,-128,-128,-112,-96,-80,-64,-48,-32,-16>\n';
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




