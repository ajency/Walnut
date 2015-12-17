var slice = [].slice;

define(['underscore', 'underscorestring'], function(_) {
  _.templateSettings = {
    evaluate: /\{\[([\s\S]+?)\]\}/g,
    interpolate: /\{\{([\s\S]+?)\}\}/g
  };
  _.mixin(_.str.exports());
  return _.mixin({
    logAppMsg: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return _.each(arguments, function(l, index) {
        return console.log(l);
      });
    },
    logAppErr: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
    },
    convertHex: function(hex, opacity) {
      var b, g, r, result;
      if (opacity == null) {
        opacity = 1;
      }
      hex = hex.replace('#', '');
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
      return result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    },
    getOrdinal: function(n) {
      var s, v;
      if (parseFloat(n) === parseInt(n) && !_.isNaN(n)) {
        s = ["th", "st", "nd", "rd"];
        v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      }
      return n;
    }
  });
});
