chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index-app.html', {
    'bounds': {
      'width': 400,
      'height': 500
    }
  });
});