chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('/wp-content/themes/walnut/walnut/index-app.html', {
    'bounds': {
      'width': 1000,
      'height': 600
    }
  });
});