define(['underscore'], function(_) {
  return _.mixin({
    deferredErrorHandler: function(d) {
      return function(tx, error) {
        return d.reject(error);
      };
    },
    failureHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    transactionErrorHandler: function(error) {
      return console.log('ERROR: ' + error.message);
    },
    fileErrorHandler: function(error) {
      return console.log('FILE ERROR: ' + error.code);
    },
    fileSystemErrorHandler: function(evt) {
      return console.log('FILE SYSTEM ERROR: ' + evt.target.error.code);
    },
    fileTransferErrorHandler: function(error) {
      var err_msg;
      switch (error.code) {
        case 1:
          err_msg = 'FILE NOT FOUND';
          break;
        case 2:
          err_msg = 'INVALID URL';
          break;
        case 3:
          err_msg = 'CONNECTION';
          break;
        case 4:
          err_msg = 'ABORT';
          break;
        default:
          err_msg = 'UNKNOWN';
      }
      console.log('ERROR: ' + err_msg);
      console.log('ERROR SOURCE: ' + error.source);
      return console.log('ERROR TARGET: ' + error.target);
    }
  });
});
