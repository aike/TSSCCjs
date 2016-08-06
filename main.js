var MMLParser = require('./MMLParser.js');

var parser = new MMLParser();

var mml = 
	  't128;#OCTAVEREVERSE;#TABLE0,<(16,127),8,(127,0),136>;#A=%2q0l16$;#B=s0r2;#C=%3q0'
	+ 'l16/:32r[3r|rc];#D=cr4.:/s0r4..;#E=v11s33,;#F=[7r1];#G=Fr2r8.[5;#H=d8/:3>d<d/d>d'
	+ '<dd:/;#I=HH;#J=%3l16o3[4II(5)]/:[3I(5)]/H(2)H(7):/H(3)a+8>[a+<a+a+>]a+s0r4..;#K='
	+ 'v0na0,2q0s0$;#L=v5q15$s2;#M=%3l1o4[4f^c^];#N=M/:[e^|d+^]/g^:/fg+2B;#O=M(4)/:[3g^'
	+ ']/b^:/g+>c2B;#P=/:/:a>a<ar>a/<ar>a<:/rar:/;#Q=/:o4[gb>df+]rgb>df+gb>f+:/;#R=o4[g'
	+ 'a+>df]rga+>d;#S=Rfga+>f;#T=[g+>cd+g];#U=l8o6Fr1/:4[4d16e;#V=]r1^4;#W=gr16gr16<gr'
	+ '16;#X=[4Wr16gr4.>W|gr.>]r16^4>;#Y=((((;#Z=q0l8o6[32r1][e1<a2>d4.^24c+24c24<|b1^1'
	+ '>r2e2<a2>a2g1^1]b^1.[g.a.>|e^2<]d^2<g.>c.<b1^1>[g..^1.g+32a4f^1.|c.d.g.^1.b32>c3'
	+ '2^4<b1a1]d.c.d1.<g.f+.g>d2....f+32g4.f8B;#FMC5(B2(A));v15$q0s1J;v13$q0s8J;v8$q13'
	+ 's0J;#FMD4(C)+B4(A);KN;LN;ns7KN;ns7LN;#FMD4(C)+B4(A);KO;LO;ns7KO;ns7LO;q0l16$/:v1'
	+ '4%1@1s36o5[4PP(-2)])))%3/:QSSQ/Q:/R(-2)>>d+ga+>f/o5TB:/o4TT;#FMB5(A);%3v10q0ns12'
	+ '$s4UV:/XX;%3v5q9$s9U)VY:/XX;%0v12q5k1$s11U))VYY:/XX;#FMD1(C)+B1(A);%3v15ml4$s3Z;'
	+ '%3v8k-1ml2$s4Z;%3v15ml7$s3Z;%3v8k-1$s4Z;%5@1v6k2ml2$s1Z;%3o4$[63v14s1,-15q1c4s9,'
	+ '-70)>q0d8.<)))>d16<]B;Ao3/:32s0r4s12,18[v11a8.)))/|a^4]a:/aB;Ao8[126v10s50aa))s7'
	+ '<f8>]B;%3q0l16o5E-5$FFr1.rgg8ggggGg]Fr1;Ao4E-15FFr1.r>bb8<bbbbGb]Fr1;#FMB7(A);v1'
	+ '4o2$s1Cv9>s0na0,3ana0,0v14</s1Ds1Cr/D;v7o8$s30,-128C)s13c(/s30,-128Ds30,-128Cr/D';


console.log(parser.x);

var json = parser.parse(mml);
var s = parser.compile(json);

console.log("hello world");
