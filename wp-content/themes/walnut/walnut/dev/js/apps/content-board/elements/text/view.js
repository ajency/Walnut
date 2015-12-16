var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Text.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(superClass) {
      extend(TextView, superClass);

      function TextView() {
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.className = 'text';

      TextView.prototype.onShow = function() {
        return this.$el.append(_.stripslashes(this.model.get('content')));
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
