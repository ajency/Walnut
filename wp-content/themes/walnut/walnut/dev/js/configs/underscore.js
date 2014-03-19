var __slice = [].slice;

define(['underscore', 'underscorestring'], function(_) {
  _.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
  };
  _.mixin(_.str.exports());
  return _.mixin({
    logAppMsg: function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.each(arguments, function(l, index) {
        return console.log(l);
      });
    },
    logAppErr: function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.each(arguments, function(l, index) {
        return console.log(l);
      });
    },
    idOrder: function(arr) {
      var newArray;
      newArray = [];
      _.each(arr, function(ele, index) {
        var i;
        i = ele.split('-');
        return newArray.push(parseInt(i[1]));
      });
      return newArray;
    },
    stripslashes: function(str) {
      return (str + "").replace(/\\(.?)/g, function(s, n1) {
        switch (n1) {
          case "\\":
            return "\\";
          case "0":
            return "\u0000";
          case "":
            return "";
          default:
            return n1;
        }
      });
    }
  });
});
