var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Audio.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.AudioView = (function(_super) {
      __extends(AudioView, _super);

      function AudioView() {
        return AudioView.__super__.constructor.apply(this, arguments);
      }

      AudioView.prototype.className = 'audio';

      AudioView.prototype.template = '{{#audio}} <video  class="video-js vjs-default-skin" controls preload="none" width="100%" poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg" data-setup="{}" controls> <source src="{{videoUrl}}" type="video/mp4" /> </video> <div class="clearfix"></div> {{/audio}} {{#placeholder}} <div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Video</div> {{/placeholder}}';

      AudioView.prototype.mixinTemplateHelpers = function(data) {
        data = AudioView.__super__.mixinTemplateHelpers.call(this, data);
        data.audio = true;
        return data;
      };

      AudioView.prototype.events = {
        'click': function(e) {
          return e.stopPropagation();
        }
      };

      AudioView.prototype.onShow = function() {};

      return AudioView;

    })(Marionette.ItemView);
  });
});
