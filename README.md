TSSCCjs
====
Ctrl-C MML Player Chrome extension

##FEATURES
 - Ctrl-C to play interface
 - play sound with TSS javascript sound driver
 - translate TSSCP MML to TSS MML
 - support #A-#Z macro
 - support #FM macro

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
GitHub: http://github.com/aike/tssccjs  
Contact: twitter @aike1000  

TSS - T'SoundSystem by toyoshim https://github.com/toyoshim/tss  
TSSCP - TSS Clipboard Player by keim

