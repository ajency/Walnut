var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.ImageWithText.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ImageWithTextView = (function(superClass) {
      extend(ImageWithTextView, superClass);

      function ImageWithTextView() {
        return ImageWithTextView.__super__.constructor.apply(this, arguments);
      }

      ImageWithTextView.prototype.className = 'imagewithtext';

      ImageWithTextView.prototype.template = '<img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive"/> <p class="editor"></p> <div class="clearfix"></div>';

      ImageWithTextView.prototype.mixinTemplateHelpers = function(data) {
        data = ImageWithTextView.__super__.mixinTemplateHelpers.call(this, data);
        data.holder = '';
        data.imageurl = function() {
          if (this.sizes != null) {
            if (this.sizes['thumbnail']) {
              return this.sizes['thumbnail'].url;
            } else {
              return this.sizes['full'].url;
            }
          }
        };
        data.alignclass = function() {
          switch (this.align) {
            case 'left':
              return 'pull-left';
            case 'right':
              return 'pull-right';
          }
        };
        return data;
      };

      ImageWithTextView.prototype.onShow = function() {
        var content;
        content = Marionette.getOption(this, 'templateHelpers').content;
        return this.$el.find('p').append(_.stripslashes(content));
      };

      return ImageWithTextView;

    })(Marionette.ItemView);
  });
});
