if (!window['exports'])
  window['exports'] = {};
if (!window['Log']) {
  window['Log'] = {
    enabled: false,
    log: [ ],
    on: function() { Log.enabled = true; },
    off: function() { Log.enabled = false; },
    flush: function() { var d = Log.log.join('\n'); Log.log = []; return d; },
    getLog: function() { return Log; },
    
    /*
    info: function(m) { console.info(m); if (Log.enabled) Log.log.push(m); },
    warn: function(m) { console.warn(m); if (Log.enabled) Log.log.push(m); },
    error: function(m) { console.error(m); if (Log.enabled) Log.log.push(m); },
    fatal: function(m) { console.fatal(m); if (Log.enabled) Log.log.push(m); }
    */

    info: function(m) {},
    warn: function(m) {},
    error: function(m) { if (Log.enabled) Log.log.push(m); },
    fatal: function(m) { if (Log.enabled) Log.log.push(m); }
  };
}
