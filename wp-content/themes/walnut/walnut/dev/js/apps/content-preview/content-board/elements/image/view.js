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

      ImageView.prototype.template = '<img src="{{imageurl}}" alt="{{title}}" class="img-responsive" width="100%" onerror="this.onerror=null;this.src=\'/images/img-not-found.jpg\';"/> <div class="clearfix"></div>';

      ImageView.prototype.mixinTemplateHelpers = function(data) {
        data = ImageView.__super__.mixinTemplateHelpers.call(this, data);
        if (data.sizes != null) {
          data.imageurl = data.sizes[data.size].url;
        }
        return data;
      };

      ImageView.prototype.onShow = function() {};

      return ImageView;

    })(Marionette.ItemView);
  });
});
