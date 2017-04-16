help:
	@echo "clean ... clean up"
	@echo "init  ... checkout third party libraries"
	@echo "build ... generate runtime file"
	@echo "test  ... test script"

clean:
	rm -rf node_modules tss bin/tsscc.min.js bin/manifest.json

init:
	npm install
	git clone https://github.com/toyoshim/tss.git

build:
	cat \
		compat.js \
		tss/js/tss/AudioLooper.js \
		tss/js/tss/MasterChannel.js \
		tss/js/tss/TssChannel.js \
		tss/js/tss/TString.js \
		tss/js/tss/TsdPlayer.js \
		tss/js/tss/TssCompiler.js \
		MMLParser.js \
		main.js \
		| \
		node ./bower_components/uglify-js/bin/uglifyjs \
			--output bin/tsscc.min.js
		cp manifest.json bin/
		cp icons/tsscc16.png bin/
		cp icons/tsscc48.png bin/
		cp icons/tsscc128.png bin/

store:
	cp bin/tsscc.min.js   zip/tsscc/
	cp bin/manifest.json  zip/tsscc/
	cp icons/tsscc16.png  zip/tsscc/
	cp icons/tsscc48.png  zip/tsscc/
	cp icons/tsscc128.png zip/tsscc/
	cd zip; zip -r tsscc.zip tsscc/

test:
	npm test

