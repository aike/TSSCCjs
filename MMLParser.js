//
// MMLParser.js by aike
//
//   MML parser and macro processer
//
// licenced under MIT License.
//
var MMLParser = function() {
	this.macro = {};
	this.endParse = false;
	this.expandMode = true;
	this.noteShift = 0;
	this.dumpString = '';
	this.channel = 0;
	this.asciiA = 'A'.charCodeAt(0);
	this.commentMode = false;
	this.octUp = '<';
	this.octDown = '>';

	this.FmNode = [];
	this.FmPipe = -1;
	this.FmOps = 0;
	this.FmMode = false;
	this.FmCount = 0;

	this.number2name = ['c','c+','d','d+','e','f','f+','g','g+','a','a+','b'];
	this.name2number = {
						'c' :0,
						'c+':1,
						'd-':1,
						'd' :2,
						'd+':3,
						'e-':3,
						'e' :4,
						'f' :5,
						'f+':6,
						'g-':6,
						'g' :7,
						'g+':8,
						'a-':8,
						'a' :9,
						'a+':10,
						'b-':10,
						'b' :11
					};
};


MMLParser.prototype.initialize = function() {
	this.macro = {};
	this.endParse = false;
	this.expandMode = true;
	this.noteShift = 0;
	this.dumpString = '';
	this.channel = 0;
	this.asciiA = 'A'.charCodeAt(0);
	this.commentMode = false;
	this.octUp = '<';
	this.octDown = '>';

	this.FmNode = [];
	this.FmPipe = -1;
	this.FmOps = 0;
	this.FmMode = false;
	this.FmCount = 0;

	this.resetChannelString();
};

MMLParser.prototype.isString = function(obj) {
    return typeof (obj) == "string" || obj instanceof String;
};

MMLParser.prototype.octave = function(n) {
	return Math.floor(n / 12);
}

MMLParser.prototype.noteMod12 = function(n) {
	while (n < 0) {
		n += 12;
	}
	return n % 12;
}

MMLParser.prototype.adjustOctave = function(a, offset) {
	var oct = this.octave(this.noteShift + offset);
	if (oct > 0) {
		for (var i = 0; i < oct; i++) {
			a.push(['mml',this.octUp]);
			this.noteShift -= 12;
		}
	} else if (oct < 0) {
		for (var i = 0; i < -oct; i++) {
			a.push(['mml',this.octDown]);
			this.noteShift += 12;
		}
	}
}

MMLParser.prototype.repeat = function(c, n) {
	var s = '';
	for (var i = 0; i < n; i++) {
		s += c;
	}
	return s;
};

MMLParser.prototype.getChannelString = function() {
	var ret;
	var n0 = this.channel % 26;
	var n1 = Math.floor(this.channel / 26) - 1;

	if (n1 < 0) {
		ret = '#' + String.fromCharCode(this.asciiA + n0);
	} else {
		ret = '#' + String.fromCharCode(this.asciiA + n1) + String.fromCharCode(this.asciiA + n0);
	}

	this.channel++;

	return ret;
};

MMLParser.prototype.resetChannelString = function() {
	this.channel = 0;
};

MMLParser.prototype.expandWAVB = function(s) {
	var ret = '';

	if (s.length % 2 == 1) {
		s = s + '0';
	}

	for (var i = 0; i < s.length; i += 2) {
		if (i > 0) {
			ret += ',';
		}
		var hex = s.substring(i, i + 2);
		var num = parseInt(hex, 16) - 128;
		ret += num.toString(10);
	}

	return '<' + ret + '>';
};

MMLParser.prototype.parse = function(mml) {

	this.initialize();

	var ret = [];
	mml = mml.replace(/\n/g, '');
	var lines = mml.split(";");

	for (var i = 0; i < lines.length; i++) {
		var s = lines[i];
		this.noteShift = 0;
		var arr = this.parseLine(lines[i]);
		if (arr.length > 0) {
			ret.push(arr);
		}
		if (this.endParse) {
			break;
		}
	}

	return ret;
};

MMLParser.prototype.expandMacro = function(s) {
	if (this.commentMode) {
		return s;
	}
	s = s.replace(/{[^}]*}/g, '');	// one line comment
	s = s.replace(/{[^}]*$/, '{');	// nulti line comment
	if (s.match(/^ *#/)) {			// directive line
		return s;
	}

	this.noteShift = 0;
	var replaceCount = 0;
	var r = s.match(/([A-Z])(\([+\-]?[0-9]+\)|\([a-g][+\-]?\))?/);
	while (r) {
		var shift_in;
		var shift_out;
		var nameStr = RegExp.$1;
		var rangeStr = RegExp.$2.replace('(','').replace(')','');
		var range;
		if (rangeStr !== '') {
			if (rangeStr.match(/[+\-]?[0-9]+/)) {
				range = parseInt(rangeStr, 10);
			} else {
				range = this.name2number[rangeStr];
			}
			shift_in = '@ns' +  String(range);
			shift_out = '@ns' + String(-range);
		} else {
			shift_in = '';
			shift_out = '';
		}
		s = s.substring(0,r.index) + shift_in + this.macro[nameStr] + shift_out + s.substring(r.index + r[0].length);

		r = s.match(/([A-Z])(\([+\-]?[0-9]+\)|\([a-g][+\-]?\))?/);
		nameStr = RegExp.$1;
		rangeStr = RegExp.$2.replace('(','').replace(')','');

		replaceCount++;
		if (replaceCount > 300) {
			break;
		}
	}
	return s;
}

MMLParser.prototype.parseLine = function(s) {
	var org_s = s;
	this.endParse = false;
	var a = [];

	s = this.expandMacro(s);
	this.noteShift = 0;

	if (!s.match(/#TITLE/)) {
		// eliminate all spaces
		s = s.replace(/ /g, '');
	} else {
		// eliminate string around title
		s = s.replace(/^.*#TITLE[^<]*/g, '#TITLE');
	}

	if (this.commentMode) {
		if (s.match(/^[^}]*}/)) {
			s = s.replace(/^[^}]*}/, '');
			this.commentMode = false;
		} else {
			return [];
		}
	}


	var cnt = 0;
	while (true) {
		cnt++;

		var ext_s = s;

		if (s.match(/^(mp)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// two character command with five args
			s = s.replace(/^(mp)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$4, RegExp.$5, RegExp.$6]);

		} else if (s.match(/^(na|nt)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// two character command with two args
			s = s.replace(/^(na|nt)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(ns)([+\-]?[0-9]+)/)) {
			// two character command with one args
			s = s.replace(/^(ns)([+\-]?[0-9]+)/, '');
			if (!this.expandMode) {
				a.push(['exmml', RegExp.$1, RegExp.$2]);
			}
			this.noteShift = parseInt(RegExp.$2, 10);

		} else if (s.match(/^(ml|ph)([+\-]?[0-9]+)/)) {
			// unsupported command
			s = s.replace(/^(ml|ph)([+\-]?[0-9]+)/, '');
			if (!this.expandMode) {
				a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2]);
			}

		} else if (s.match(/^([svx])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// MML command with two args
			s = s.replace(/^([svx])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^([hijklmnopqrtuwxyz])([+\-]?[0-9]+)?/)) {
			// MML command with optional one arg
			s = s.replace(/^([hijklmnopqrstuvwxyz])([+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^([abcdefg][+\-]?)([0-9]+)?/)) {
			// note name
			s = s.replace(/^([abcdefg][+\-]?)([0-9]+)?/, '');
			if (this.noteShift === 0) {
				a.push(['mml', RegExp.$1, RegExp.$2]);
			} else {
				var pitch = this.name2number[RegExp.$1];
				this.adjustOctave(a, pitch);
				var newPitch = pitch + this.noteShift;
				a.push(['mml', this.number2name[this.noteMod12(newPitch)], RegExp.$2]);
			}

		} else if (s.match(/^([r])([0-9]*)/)) {
			// rest
			s = s.replace(/^([r])([0-9]*)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(\^)([0-9]*)/)) {
			// tie
			s = s.replace(/^(\^)([0-9]*)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(\/:)([0-9]*)/)) {
			// repeat start
			s = s.replace(/^(\/:)([0-9]*)/, '');
			this.adjustOctave(a, 0);
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(:\/)/)) {
			// repeat end
			s = s.replace(/^(:\/)/, '');
			this.adjustOctave(a, 0);
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^(\[)([0-9]*)/)) {
			// repeat start
			s = s.replace(/^(\[)([0-9]*)/, '');
			this.adjustOctave(a, 0);
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(\])/)) {
			// repeat end
			s = s.replace(/^(\])/, '');
			this.adjustOctave(a, 0);
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^(\$)/)) {
			// endless repeat
			s = s.replace(/^(\$)/, '');
			this.adjustOctave(a, 0);
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^([<>])/)) {
			if (this.noteshift === 0) {
				a.push(['mml', RegExp.$1]);
			} else {
				if (RegExp.$1 === this.octUp) {
					this.noteShift += 12;
				} else {
					this.noteShift -= 12;		
				}
			}
			s = s.replace(/^([<>])/, '');

		} else if (s.match(/^([,.|^()\/])/)) {
			s = s.replace(/^([,.|^()\/])/, '');
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^(@kr|@ks|@ml|@apn)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// @x arg1, arg2
			s = s.replace(/^(@kr|@ks|@ml|@apn)([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(@ns)([+\-]?[0-9]+)/)) {
			s = s.replace(/^(@ns)([+\-]?[0-9]+)/, '');
			if (!this.expandMode) {
				a.push(['exmml', RegExp.$1, RegExp.$2]);
			}
			this.noteShift += parseInt(RegExp.$2, 10);

		} else if (s.match(/^(@[vio])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)/)) {
			// @x arg1, arg2
			s = s.replace(/^(@[vio])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(@[v])([+\-]?[0-9]+)?/)) {
			// @x arg
			s = s.replace(/^(@[v])([+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(@[a-z])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// @x arg1, arg2
			s = s.replace(/^(@[a-z])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^([&*])/)) {
			s = s.replace(/^([&*])/, '');
			a.push(['exmml(unsupported)', RegExp.$1]);

		} else if (s.match(/^(%)([0-9]+)/)) {
			// %x change module
			s = s.replace(/^(%)([0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2 + ' ']);

		} else if (s.match(/^([@])([0-9]+)/)) {
			s = s.replace(/^([@])([0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^([~_])([0-9]+)?/)) {
			s = s.replace(/^([~_])([0-9]+)?/, '');
			a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^{[^}]*}/)) {
			// single line comment
			s = s.replace(/^{[^}]*}/, '');

		} else if (s.match(/^{[^}]*$/)) {
			// multi line comment
			s = s.replace(/^{[^}]*$/, '');
			this.commentMode = true;

		} else if (s.match(/^(#OCTAVE|#VOLUME)(REVERSE|NORMAL)/)) {
			s = s.replace(/^(#OCTAVE|#VOLUME)(REVERSE|NORMAL)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2]);
			if (RegExp.$2 === 'REVERSE') {
				this.octUp = '>';
				this.octDown = '<';
			}

		} else if (s.match(/^(#TABLE)([0-9]+),?(<[^>]*>)/)) {
			s = s.replace(/^(#TABLE)([0-9]+),?(<[^>]*>)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(#WAV)([0-9]+),?(<[^>]*>)/)) {
			s = s.replace(/^(#WAV)([0-9]+),?(<[^>]*>)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(#WAVB)([0-9]+),?([0-9a-fA-F]+)/)) {
			s = s.replace(/^(#WAVB)([0-9]+),?([0-9a-fA-F]+)/, '');
			a.push(['directive', '#WAV', RegExp.$2, this.expandWAVB(RegExp.$3)]);

		} else if (s.match(/^(#FINENESS)([0-9]+)/)) {
			s = s.replace(/^(#FINENESS)([0-9]+)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(#TITLE) *(<[^>]*>)/)) {
			s = s.replace(/^(#TITLE) *(<[^>]*>)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(#CHANNEL)([0-9]+)/)) {
			s = s.replace(/^(#CHANNEL)([0-9]+)/, '');

		} else if (s.match(/^(#PRAGMA)(FAMICOM|GAMEBOY)/)) {
			s = s.replace(/^(#PRAGMA)(FAMICOM|GAMEBOY)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(#MML)/)) {
			s = s.replace(/^(#MML)/, '');

		} else if (s.match(/^(#END)/)) {
			s = '';
			this.endParse = true;
			break;

		} else if (s.match(/^(#FM)(.*)/)) {
			s = s.replace(/^(#FM)(.*)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^#([A-Z])=(.*)/)) {
			s = s.replace(/^#([A-Z])=(.*)/, '');
			if (!this.expandMode) {
				a.push(['def', RegExp.$1, RegExp.$2]);
			}
			//console.log('#' + RegExp.$1 + '=' + RegExp.$2);
			this.macro[RegExp.$1] = RegExp.$2;

		} else if (s.match(/^(#FILTER)([0-9]+),?(<[^>]*>)/)) {
			s = s.replace(/^(#FILTER)([0-9]+),?(<[^>]*>)/, '');
			a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(#[A-Z]+)/)) {
			s = s.replace(/^(#[A-Z]+)/, '');
			a.push(['exmml(unsupported)', RegExp.$1]);

		} else {
			if (s !== '') {
				console.log("parse error:[" + s + ']');
				console.log('      >>> ' + org_s);
				console.log('      >>> ' + ext_s);
				throw new Error("parse error");
			}
			break;
		}
	}

	return a;
};

MMLParser.prototype.parseFmMacro = function(s) {
	// ope := [A-Z]
	// carrier := ope | ope(exp)
	// exp := carrier | carrier + exp

	var nest = 0;
	var a = [];
	var modulator_str = '';
	var carrier;
	var level;
	var org_s = s;

	while (s.length > 0) {

		if (nest === 0) {
			if (s.match(/^ +/)) {
				// white space
				s = s.replace(/^ +/, '');

			} else if (s.match(/^([A-Z])([0-8])?\(/)) {
				// carrier with modurator 
				modulator_str = '';
				carrier = RegExp.$1;
				if (RegExp.$2 !== '') {
					level = RegExp.$2;
				} else {
					level = '3';
				}
				nest++;
				s = s.replace(/^([A-Z])([0-8])?\(/, '');

			} else if (s.match(/^([A-Z])([0-8])?/)) {
				// carrier without modulator
				a.push([RegExp.$1, '0', '']);
				s = s.replace(/^([A-Z])([0-8])?/, '');

			} else if (s.match(/^\+/)) {
				a.push('+');
				s = s.replace(/^\+/, '');

			} else {
				if (s !== '') {
					console.log("FM macro parse error:[" + s + ']');
					console.log('      >>> ' + org_s);
					//throw new Error("parse error");
				}
				break;
			}

		} else {
			if (s.match(/^\)/)) {
				nest--;
				if (nest === 0) {
					a.push([
						carrier,
						level,
						this.parseFmMacro(modulator_str)
					]);
					s = s.substring(1);
				} else {
					modulator_str += s.charAt(0);
					s = s.substring(1);
				}
			} else if (s.match(/^\(/)) {
				nest++;
				modulator_str += s.charAt(0);
				s = s.substring(1);
			} else {
				modulator_str += s.charAt(0);
				s = s.substring(1);				
			}
		}
	}

	return a;
}

MMLParser.prototype.evalFmMacro = function(s) {
	// this.FmNode =
	//    [
	//        [in, im, on, om],  // A
	//        [in, im, on, om],  // B
	//        [in, im, on, om]   // C
	//    ]
	// 
	//    in: 0:no modulator, 1-8:modulagtor level
	//    im: 0-3:source pipe
	//    on: 0:to speaker, 1:overwrite, 2:additive
	//    om: 0-3:destination pipe

	this.FmNode = new Array(26);
	this.FmPipe = -1;
	this.FmOps = 0;
	var a = this.parseFmMacro(s);
	this.evalFmMacroSub(a, 0, 1);
	this.FmMode = true;
	this.FmCount = 0;
}

MMLParser.prototype.evalFmMacroSub = function(a, nest, mode) {
	var childMode = 1;
	for (var i = 0; i < a.length; i++) {
		if (this.isString(a[i])) {
			if (a[i].match(/[A-Z]/)) {
				this.FmOps++;
				var idx = a[i].charCodeAt(0) - this.asciiA;
				this.FmNode[idx] = [];
				node = this.FmNode[idx];
				if (a[i + 1] === '0') {
					node[0] = 0;
					node[1] = 0;
					node[3] = this.FmPipe;
				} else {
					this.FmPipe++;
					node[0] = parseInt(a[i + 1], 10);
					node[1] = this.FmPipe;
					node[3] = this.FmPipe - 1;
				}
				if (nest === 1) {
					node[2] = 0;
					node[3] = 0;
				} else {
					node[2] = mode;
				}
				i++;
			} else if (a[i] === '+') {
				childMode = 2;
			}
		} else {
			this.evalFmMacroSub(a[i], nest + 1, childMode);
		}
	}
}


MMLParser.prototype.dumpFmMacro = function(s) {
	var a = this.parseFmMacro(s);

	this.dumpString = '';
	this.dumpFmMacroSub(a, 0);

	return this.dumpString;
}

MMLParser.prototype.dumpFmMacroSub = function(a, nest) {
	for (var i = 0; i < a.length; i++) {
		if (this.isString(a[i])) {
			if (a[i].match(/[A-Z]/)) {
				this.dumpString += this.repeat(' ', nest * 4) + a[i] + '<--' + a[i + 1] + '--\n';
				i++;
			}
		} else {
			this.dumpFmMacroSub(a[i], nest + 1);
		}
	}
}


MMLParser.prototype.compile = function(mml, addDirective) {
	if (addDirective === undefined) {
		addDirective = true;
	}

	var arr = this.parse(mml);

	var title = '<>';

	var s = '';
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][0][0] === 'directive') {
			var type = arr[i][0][1];
			if (type === '#TITLE') {
				title = arr[i][0][2];
			} else if ((type === '#TABLE') || (type === '#WAV')) {
				s += arr[i][0][1] + ' ' + arr[i][0][2] + ',' + arr[i][0][3] + '\n';
			} else if (type !== '#FM') {
				s += arr[i][0][1] + ' ' + arr[i][0][2] + '\n';
			}
		}
	}

	for (var i = 0; i < arr.length; i++) {		
		if (arr[i][0][0] === 'directive') {
			// Check FM definition
			var type = arr[i][0][1];
			if (type === '#FM') {
				// s += '{ ' + arr[i][0][1] + ' ' + arr[i][0][2] + ' }\n';
				this.evalFmMacro(arr[i][0][2]);
			}
			continue;
		}

		if (addDirective) {
			// add channel name (e.g. "#A")
			s += this.getChannelString() + '\n';
		}

		var j = 0
		if (arr[i][j][1] == '%') {
			// prioritize change module command (e.g. %3)
			// more than FM definition
			s += arr[i][j][1] + arr[i][j][2];
			j++;
		}

		if (addDirective) {
			if (this.FmMode) {
				// inject FM definition
				var node = this.FmNode[this.FmCount];
				s += '@i' + node[0] + ',' + node[1] + '@o' + node[2] + ',' + node[3];
				this.FmCount++;
				if (this.FmCount >= this.FmOps) {
					this.FmMode = false;
				}
			}
		}

		for (; j < arr[i].length; j++) {
			// mml command
			for (var k = 1; k < arr[i][j].length; k++) {
				if (arr[i][j][0] === 'exmml(unsupported)') {
					continue;
				}
				s += arr[i][j][k];
			}
		}
		s += '\n';
	}

	var ret = '';
	if (addDirective) {
		// inject mandatory directives
		ret += '#TITLE ' + title + '\n';
		ret += '#CHANNEL ' + Math.min(this.channel, 26) + '\n';
	}
	ret += s;

	return ret;
}

MMLParser.prototype.dump = function(mml) {
	var w = this.expandMode;
	this.expandMode = false;
	var arr = this.parse(mml);
	this.expandMode = w;

	console.log('=========================');
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			var cmd = '';
			for (var k = 0; k < arr[i][j].length; k++) {
				cmd += arr[i][j][k] + ' ';
			}
			console.log(cmd);
		}
		console.log('-------');
	}
	console.log('=========================');
}

if (typeof(module) != 'undefined') {
	module.exports = MMLParser;
}
