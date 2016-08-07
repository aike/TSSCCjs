
(function() {
	var parser = new MMLParser();

    var looper = new AudioLooper(2048);
    var master = new MasterChannel();
    master.setVolume(1);

    var player = new TsdPlayer();
    player.device = new TssChannel();
    player.device.setPlayer(player);

    master.addChannel(player.device);
    player.setMasterChannel(master);

    var lastsel = '';

	document.onkeydown = function (e){
		var ctrl = (e.ctrlKey || e.metaKey);
		if (ctrl && e.keyCode === 67) {

			var sel = String(document.getSelection());

			if (looper.channel) {
				looper.setChannel(null); // stop
				if (sel === lastsel) {
					return;
				} 
			}

			lastsel = sel;

			var tsc = new TssCompiler();

			var tssmml = parser.compile(sel);
			if (e.shiftKey) {
				console.log(tssmml);
			}

			var ret = tsc.compile(tssmml);
			if (ret === null) {
				console.log("MML compile error");
			} else {
			    looper.setChannel(master);
				player.play(ret);
			}
		}
	}


})();
