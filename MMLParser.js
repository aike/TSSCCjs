//
// MMLParser.js by aike
//
//   MML parser and macro processer
//
// licenced under MIT License.
//
var MMLParser = function() {
	this.macro = {};
	this.transpose = [0];
	this.endParse = false;
	this.expandMacro = true;
	this.noteShift = 0;
	this.dump = '';
	this.channel = 0;
	this.asciiA = 'A'.charCodeAt(0);

	this.FmNode = [];
	this.FmPipe = -1;
	this.FmOps = 0;
	this.FmMode = false;
	this.FmCount = 0;

	this.number2name = ['a','a+','b','c','c+','d','d+','e','f','f+','g','g+'];
	this.name2number = {'a' :0,
						'a+':1,
						'b-':1,
						'b' :2,
						'c' :3,
						'c+':4,
						'd-':4,
						'd' :5,
						'd+':6,
						'e-':6,
						'e' :7,
						'f' :8,
						'f+':9,
						'g-':9,
						'g' :10,
						'g+':11,
						'a-':11
					};
};

MMLParser.prototype.isString = function(obj) {
    return typeof (obj) == "string" || obj instanceof String;
};

MMLParser.prototype.repeat = function(c, n) {
	var s = '';
	for (var i = 0; i < n; i++) {
		s += c;
	}
	return s;
}

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
}

MMLParser.prototype.resetChannelString = function() {
	this.channel = 0;
}

MMLParser.prototype.parse = function(mml) {
	this.resetChannelString();
	this.endParse = false;
	var ret = [];
	mml = mml.replace(/\n/g, '');
	var lines = mml.split(";");

	for (var i = 0; i < lines.length; i++) {
		var s = lines[i];
		this.noteShift = 0;
		var arr = this.parseLine(lines[i], 0);
		if (arr.length > 0) {
			ret.push(arr);
		}
		if (this.endParse) {
			break;
		}
	}

	return ret;
};


MMLParser.prototype.parseLine = function(s, transpose) {
	var org_s = s;

	this.endParse = false;

	if (transpose === undefined) {
		transpose = 0;
	}

	var a = [];

	if (!s.match(/#TITLE/)) {
		s = s.replace(/ /g, '');
	}

	while (true) {

		if (this.expandMacro) {
			while (s.match(/^([A-Z])(\([+\-]?[0-9]+\))?/)) {
				// expand macro
				var trans = 0;
				if (RegExp.$2 !== '') {
					trans = parseInt(RegExp.$2.replace('(','').replace(')',''), 10);
				}
				s = s.replace(/^([A-Z])(\([+\-]?[0-9]+\))?/, '');

				var exp = this.parseLine(this.macro[RegExp.$1] + s, trans);
				a = a.concat(exp);
				s = '';
			}
		} else {
			while (s.match(/^([A-Z])(\([+\-]?[0-9]+\))?/)) {
				s = s.replace(/^([A-Z])(\([+\-]?[0-9]+\))?/, '');
				a.push(['macro', RegExp.$1, RegExp.$2]);
			}
		}


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
			if (!this.expandMacro) {
				a.push(['exmml', RegExp.$1, RegExp.$2]);
			}
			this.noteShift = parseInt(RegExp.$2, 10);

		} else if (s.match(/^(ml)([+\-]?[0-9]+)/)) {
			// unsupported command
			s = s.replace(/^(ml)([+\-]?[0-9]+)/, '');
			if (!this.expandMacro) {
				a.push(['exmml(unsupported)', RegExp.$1, RegExp.$2]);
			}

		} else if (s.match(/^([l])([+\-]?[0-9]+)/)) {
			// MML command with mandatory one arg
			s = s.replace(/^([l])([+\-]?[0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^([sv])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/)) {
			// MML command with two args
			s = s.replace(/^([sv])([+\-]?[0-9]+)?(,[+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^([hijkmnopqrtuwxyz])([+\-]?[0-9]+)?/)) {
			// MML command with optional one arg
			s = s.replace(/^([hijkmnopqrstuvwxyz])([+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^([abcdefg][+\-]?)([0-9]+)?/)) {
			// note name
			s = s.replace(/^([abcdefg][+\-]?)([0-9]+)?/, '');
			var pitch = this.name2number[RegExp.$1];
			pitch = (pitch + transpose + this.noteShift + 24) % 12;
			a.push(['mml', this.number2name[pitch], RegExp.$2]);

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
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(:\/)/)) {
			// repeat end
			s = s.replace(/^(:\/)/, '');
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^(\[)([0-9]*)/)) {
			// repeat start
			s = s.replace(/^(\[)([0-9]*)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(\])/)) {
			// repeat end
			s = s.replace(/^(\])/, '');
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^([,.|$^()<>\/])/)) {
			s = s.replace(/^([,.|$^()<>\/])/, '');
			a.push(['mml', RegExp.$1]);

		} else if (s.match(/^(@[a-z])([+\-]?[0-9]+)?/)) {
			// @x arg
			s = s.replace(/^(@[a-z])([+\-]?[0-9]+)?/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(@[a-z])([+\-]?[0-9]+)?,([+\-]?[0-9]+)/)) {
			// @x arg1, arg2
			s = s.replace(/^(@[a-z])([+\-]?[0-9]+)?,([+\-]?[0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(%)([0-9]+)/)) {
			// %x change module
			s = s.replace(/^(%)([0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2 + ' ']);

		} else if (s.match(/^([@])([0-9]+)/)) {
			s = s.replace(/^([@])([0-9]+)/, '');
			a.push(['mml', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^({[^}]*})/)) {
			// comment
			s = s.replace(/^({[^}]*})/, '');

		} else if (s.match(/^(#OCTAVE|#VOLUME)(REVERSE|NORMAL)/)) {
			s = s.replace(/^(#OCTAVE|#VOLUME)(REVERSE|NORMAL)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2]);

		} else if (s.match(/^(#TABLE)([0-9]+),(<[^>]*>)/)) {
			s = s.replace(/^(#TABLE)([0-9]+),(<[^>]*>)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2, RegExp.$3]);

		} else if (s.match(/^(#WAV)([0-9]+),(<[^>]*>)/)) {
			s = s.replace(/^(#WAV)([0-9]+),(<[^>]*>)/, '');
			a.push(['directive', RegExp.$1, RegExp.$2, RegExp.$3]);

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
			if (!this.expandMacro) {
				a.push(['def', RegExp.$1, RegExp.$2]);
			}
//			console.log('#' + RegExp.$1 + '=' + RegExp.$2);
			this.macro[RegExp.$1] = RegExp.$2;

		} else {
			if (s !== '') {
				console.log("parse error:[" + s + ']');
				console.log('      >>> ' + org_s);
				console.log('      >>> ' + ext_s);
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

			} else if (s.match(/^([A-Z])/)) {
				// carrier without modulator
				a.push([RegExp.$1, '0', '']);
				s = s.replace(/^([A-Z])/, '');

			} else if (s.match(/^\+/)) {
				a.push('+');
				s = s.replace(/^\+/, '');
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

	this.dump = '';
	this.dumpFmMacroSub(a, 0);

	return this.dump;
}

MMLParser.prototype.dumpFmMacroSub = function(a, nest) {
	for (var i = 0; i < a.length; i++) {
		if (this.isString(a[i])) {
			if (a[i].match(/[A-Z]/)) {
				this.dump += this.repeat(' ', nest * 4) + a[i] + '<--' + a[i + 1] + '--\n';
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
	var w = this.expandMacro;
	this.expandMacro = false;
	var arr = this.parse(mml);
	this.expandMacro = w;

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
