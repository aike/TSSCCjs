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

    #TITLE <TSSCCjs's Theme by aike CC-BY>;
    t165;#A=l4dr8d16e16f2.r8gf8e8f8e.d.ec.d.efr8f16g16a2.r8b-a8g8d8fr8fr8fgr8gr8;
    #B=d.a2r8g.c+2r8c+.d.ef2.rd.a2r8g.c2r8c+.g.df2.r;#C=l4ar8a16g16a2.r8ga<d8c.>a
    .<c>a.a+.<c>a.b-16<c16d2.r8c.>a+ar8ar8a;#D=a.d8>a8.<d8.f8er8e8e8ef8g.a8a+8ga+
    8;#E=dgfdgdfd>a<fd>a<f>a<d>a<cgecgcec>a<ec>a<e>a<c>a<dgfdgdfdcgecgcec>b-<fd>b
    -<f>b-<d>b-;#F=fgfde.f8g.r8efg8aa+8ac+defgfde.f8g.r8efg8aa+8d2.r;#G=l4d.>a.<d
    >b-r8b-.<dc.>g.<c>ar8ar8a<d.>a.<dcr8cr8c>b-r8b-r8b-a16r16a16r16a16r16a16r16<e
    >a<;#H=l16[dagfdfga][c+agfc+fga][eagfefga][dagfdfga];#I=[4arararar]<[drdrdrdr
    ]frfrfrfrgrgrgrgr;#J=AeAa+BB;#K=C<cr8cr8c>C<c+r8c+r8c+Da2.rDa.d2r8Da2.rDa.d2r
    8;#L=l8Ea<ec>a<e>a<c>a<Ea<ec+>a<e>a<c+>al4<FF>;#M=GGHHHH;#N=l8[8r1]I[16r1];#O
    =%3v10ml3q6s5;#P=%3v10mp1,4,1,2,0k1q6s5;#Q=%3q10s3;#FMC3(B2(A));Oo6$J;Po6$J;Q
    p1o6v6$J;#FMC3(B2(A));Oo5p2$K;Po5p2$K;Qp2o5v6p2$K;#FMC3(B2(A));Oo5$L;Po5$L;Qo
    5v4$L;#FMC4(B2(A));%3o4l4v15$q0s1o3M;%3o4l4v13$q0s3o3M;%3o4l4v4$q13s1o3M;o6v4
    q4s4$N;o6v4q4s4k5$N;o6v2q4s4r8.$N;o6v2q4s4k5r8.$N;o8%2q0s50l16v8$[16arararaaa
    rararaa][16araaaraaaraaaraa];#R=[7rara]ral16s20;%2q0l4o3s12,18v8$Rarrraaaal4s
    12Raaaaaaaal4s12Rarrraaaal4s12Raaaaaaaal4s12;%3o4v15s1,-15q1l16$[16crrrrrcrcr
    rrrrcr][16crccrcrccrccrcrc];


##INSTALL
Install from Chrome web store:  
https://goo.gl/0UJQcT

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
TSSCCjs's Theme MML is licenced under CC-BY License.  
Contact: twitter @aike1000  

TSS - T'SoundSystem by toyoshim https://github.com/toyoshim/tss  
TSSCP - TSS Clipboard Player by keim

