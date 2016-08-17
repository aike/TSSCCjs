TSSCCjs
====
Ctrl-C MML Player Chrome extension

##FEATURES
 - Ctrl-C to play interface
 - play sound with [TSS javascript sound driver](https://github.com/toyoshim/tss)
 - translate TSSCP type MML into TSS MML
 - support #A-#Z macro
 - support #FM macro

##MML EXAMPLE

    #TITLE <TSSCCjs's Theme>;
    t165;#A=dr8d16e16f2.r8gf8e8f8e.d.ec.d.efr8f16g16a2.r8b-a8g8d8fr8fr8fgr8gr8;
    #M=d.a2r8g.c+2r8c+.d.ef2.rd.a2r8g.c2r8c+.g.df2.r;#B=ar8a16g16a2.r8ga<d8c.>a
    .<c>a.a+.<c>a.b-16<c16d2.r8c.>a+ar8ar8a;#N=a.d8>a8.<d8.f8er8e8e8ef8g.a8a+8g
    a+8;#C=dgfdgdfd>a<fd>a<f>a<d>a<cgecgcec>a<ec>a<e>a<c>a<dgfdgdfdcgecgcec>b-<
    fd>b-<f>b-<d>b-;#O=fgfde.f8g.r8efg8aa+8ac+defgfde.f8g.r8efg8aa+8d2.r;#D=d.>
    a.<d>b-r8b-.<dc.>g.<c>ar8ar8a<d.>a.<dcr8cr8c>b-r8b-r8b-a16r16a16r16a16r16a1
    6r16<e>a<;#L=l16[dagfdfga][c+agfc+fga][eagfefga][dagfdfga];#F=[4arararar]<[
    drdrdrdr]frfrfrfrgrgrgrgr;#G=AeAa+MM;#H=B<cr8cr8c>B<c+r8c+r8c+Na2.rNa.d2r8N
    a2.rNa.d2r8;#I=l8Ca<ec>a<e>a<c>a<Ca<ec+>a<e>a<c+>al4<OO>;#J=DDLLLL;#K=l8[8r
    1]F[16r1];#X=%3v10ml3q4s5;#Y=%3v10mp1,4,1,2k1q4s5;#Z=%3q10s3;#FMC3(B2(A));X
    o6$G;Yo6$G;Zp1o6v6$G;#FMC3(B2(A));Xo5p2$H;Yo5p2$H;Zp2o5v6p2$H;#FMC3(B2(A));
    Xo5$I;Yo5$I;Zo5v4$I;#FMC4(B2(A));%3v15$q0s1o3J;%3v13$q0s3o3J;%3v4$q13s1o3J;
    o6v4q4s4$K;o6v4q4s4k5$K;o6v2q4s4r8.$K;o6v2q4s4k5r8.$K;o8%2q0s50l16v8$[16ara
    raraaarararaa][16araaaraaaraaaraa];%2q0l4o3s12,18v8$[7rara]ral16s20arrraaaa
    l4s12[7rara]ral16s20aaaaaaaal4s12[7rara]ral16s20arrraaaal4s12[7rara]ral16s2
    0aaaaaaaal4s12;%3o4v15s1,-15q1l16$[16crrrrrcrcrrrrrcr][16crccrcrccrccrcrc];


##INSTALL
1. Open chrome://extensions in your browser
1. Enable "Developer mode" checkbox
1. Click "Load unpacked extension…"
1. Select tssccjs/bin folder

##KEY ASSIGN
 - Ctrl-C Play/Stop
 - Command-C Play/Stop (Mac OS)

##BUILD

download dependencies

    make init

build runtime file into tssccjs/bin folder

    make build

test

    make test


##NOTE
TSSCCjs makes your browser's performance slightly slow.
So it is recommended that to disable the extension when you do not play MML.

##CREDIT
TSSCCjs program is licenced under MIT License.  
Contact: twitter @aike1000  

TSS - T'SoundSystem by toyoshim https://github.com/toyoshim/tss  
TSSCP - TSS Clipboard Player by keim

