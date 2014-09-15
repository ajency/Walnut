var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Image.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ImageView = (function(_super) {
      __extends(ImageView, _super);

      function ImageView() {
        return ImageView.__super__.constructor.apply(this, arguments);
      }

      ImageView.prototype.className = 'image';

      ImageView.prototype.template = '<img src="{{imageurl}}" alt="{{title}}" class="img-responsive" width="100%" style="position:relative;"/> <div class="clearfix"></div>';

      ImageView.prototype.mixinTemplateHelpers = function(data) {
        data = ImageView.__super__.mixinTemplateHelpers.call(this, data);
        if (data.sizes != null) {
          data.imageurl = data.sizes[data.size].url;
        }
        return data;
      };

      ImageView.prototype.initialize = function(options) {
        this.imageHeightRatio = Marionette.getOption(this, 'imageHeightRatio');
        return this.positionTopRatio = Marionette.getOption(this, 'positionTopRatio');
      };

      ImageView.prototype.onShow = function() {
        this.$el.css('overflow', 'hidden');
        if (this.imageHeightRatio !== 'auto') {
          this.$el.height(parseFloat(this.imageHeightRatio) * this.$el.width());
        }
        if (this.positionTopRatio) {
          return this.$el.find('img').css('top', "" + (this.positionTopRatio * this.$el.width()) + "px");
        }
      };

      return ImageView;

    })(Marionette.ItemView);
  });
});
