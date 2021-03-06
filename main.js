
(function() {
	var parser = new MMLParser();
    var looper, master, player;
    var lastsel = '';

	document.onkeydown = function (e){
		var ctrl = (e.ctrlKey || e.metaKey);
		if (ctrl && e.keyCode === 67) {

			if (player === undefined) {
			    looper = new AudioLooper(2048);
			    master = new MasterChannel();
			    master.setVolume(1);

			    player = new TsdPlayer();
			    player.device = new TssChannel();
			    player.device.setPlayer(player);

			    master.addChannel(player.device);
			    player.setMasterChannel(master);				
			}

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
			if (tssmml === '') {
				console.log('MML not found');
				return;
			}

			var ret = tsc.compile(tssmml);
			if (ret === null) {
				console.log("MML compile error");
			} else {
				setTimeout(function() {
				    looper.setChannel(master);
					player.play(ret);
				}, 300);
			}
		}
	}
})();
