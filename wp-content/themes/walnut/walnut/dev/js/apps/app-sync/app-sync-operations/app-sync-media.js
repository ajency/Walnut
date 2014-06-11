define(['underscore'], function(_) {
  return _.mixin({
    getListOfMediaFilesFromLocalDirectory: function() {
      return setTimeout((function(_this) {
        return function() {
          return _.downloadMediaFiles();
        };
      })(this), 3000);
    },
    downloadMediaFiles: function() {
      return $('#syncMediaSuccess').css("display", "block").text("Contacting server...");
    }
  });
});
