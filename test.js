// Generated by CoffeeScript 1.3.3
(function() {
  var child_process, curlRunning, local, localReady, runCurl, server, serverReady;

  child_process = require('child_process');

  local = child_process.spawn('node', ['local.js']);

  server = child_process.spawn('node', ['server.js']);

  local.on('exit', function() {
    return server.kill();
  });

  server.on('exit', function() {
    return local.kill();
  });

  localReady = false;

  serverReady = false;

  curlRunning = false;

  runCurl = function() {
    var curl;
    curlRunning = true;
    curl = child_process.spawn('curl', ['-v', 'http://www.google.com/', '-L', '--socks5', '127.0.0.1:1080']);
    curl.on('exit', function(code) {
      local.kill();
      server.kill();
      if (code === 0) {
        console.log('Test passed');
        return process.exit(0);
      } else {
        console.error('Test failed');
        return process.exit(code);
      }
    });
    curl.stdout.on('data', function(data) {
      return console.log(data.toString());
    });
    return curl.stderr.on('data', function(data) {
      return console.warn(data.toString());
    });
  };

  local.stderr.on('data', function(data) {
    return console.warn(data.toString());
  });

  server.stderr.on('data', function(data) {
    return console.warn(data.toString());
  });

  local.stdout.on('data', function(data) {
    console.log(data.toString());
    if (data.toString().indexOf('listening at port')) {
      localReady = true;
      if (localReady && serverReady && !curlRunning) {
        return runCurl();
      }
    }
  });

  server.stdout.on('data', function(data) {
    console.log(data.toString());
    if (data.toString().indexOf('listening at port')) {
      serverReady = true;
      if (localReady && serverReady && !curlRunning) {
        return runCurl();
      }
    }
  });

}).call(this);
