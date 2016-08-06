help:
	@echo "clean ... clean up"
	@echo "init  ... checkout third party libraries"
	@echo "build ... generate runtime file"
	@echo "test  ... test script"

clean:
	rm -rf node_modules bower_components

init:
	bower install
	npm install

build:
	cat \
		compat.js \
		bower_components/tss/js/tss/AudioLooper.js \
		bower_components/tss/js/tss/MasterChannel.js \
		bower_components/tss/js/tss/TssChannel.js \
		bower_components/tss/js/tss/TString.js \
		bower_components/tss/js/tss/TsdPlayer.js \
		bower_components/tss/js/tss/TssCompiler.js \
		| \
	node ./bower_components/uglify-js/bin/uglifyjs \
		--output tsscc.min.js

test:
	npm test

