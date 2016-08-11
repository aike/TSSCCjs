// TestFmMacro.js by aike
// licenced under MIT License.

var assert = require("power-assert");
var MMLParser = new require('../MMLParser.js');


function to_s(json) {
	return JSON.stringify(json).replace(/"/g, "'");
}



describe('FmMacro Parser:', function() {
	var parser;

	before(function() {
		parser = new MMLParser();
	});


	it ("One carrier", function() {
		var ret = parser.dumpFmMacro('D5(A+C2(B))');
		var expect = '    D<--5--\n'
				   + '            A<--0--\n'
				   + '            C<--2--\n'
				   + '                    B<--0--\n';
	    assert(ret === expect);
	});

	it ("Two carriers", function() {
   		var ret = parser.dumpFmMacro('D6(C)+B(A)');
		var expect = '    D<--6--\n'
				   + '            C<--0--\n'
				   + '    B<--3--\n'
				   + '            A<--0--\n';
	    assert(ret === expect);
	});

	it ("Three carriers", function() {
   		var ret = parser.dumpFmMacro('B1(A)+C2(A)+D3(A)');

		var expect = '    B<--1--\n'
				   + '            A<--0--\n'
				   + '    C<--2--\n'
				   + '            A<--0--\n'
				   + '    D<--3--\n'
				   + '            A<--0--\n';
	    assert(ret === expect);
	});

	it ("Four carriers", function() {
   		var ret = parser.dumpFmMacro('A+B+C+D');

		var expect = '    A<--0--\n'
				   + '    B<--0--\n'
				   + '    C<--0--\n'
				   + '    D<--0--\n';
	    assert(ret === expect);
	});

	it ("Ignore invalid number", function() {
   		var ret = parser.dumpFmMacro('D5(C(B2(A2)))'); // correct:D5(C(B2(A)))
		var expect = '    D<--5--\n'
				   + '            C<--3--\n'
				   + '                    B<--2--\n'
				   + '                            A<--0--\n'
	    assert(ret === expect);
	});

	it ("Eval one carrier", function() {
    	//	D<--5--
        //    		A<--0--
        //    		C<--2--
        //            		B<--0--
		parser.evalFmMacro('D5(A+C2(B))');
		var expect = [[ 0, 0, 1, 0 ],
				 	  [ 0, 0, 1, 1 ],
					  [ 2, 1, 2, 0 ],
					  [ 5, 0, 0, 0 ]];
		for (var i = 0; i < parser.FmOps; i++) {
		    assert(to_s(parser.FmNode[i]) === to_s(expect[i]));
		}
	});

	it ("Eval two carriers", function() {
		//    F<--3--
		//            E<--0--
		//    D<--5--
		//            A<--0--
		//            C<--2--
		//                    B<--0--
		parser.evalFmMacro('F(E)+D5(A+C2(B))');
		var expect = [[ 0, 0, 1, 1 ],
					  [ 0, 0, 1, 2 ],
					  [ 2, 2, 2, 1 ],
					  [ 5, 1, 0, 0 ],
					  [ 0, 0, 1, 0 ],
					  [ 3, 0, 0, 0 ]];
		for (var i = 0; i < parser.FmOps; i++) {
		    assert(to_s(parser.FmNode[i]) === to_s(expect[i]));
		}
	});

});

