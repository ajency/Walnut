var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '{{#video}} <video  class="video-js vjs-default-skin" controls preload="none" width="100%" poster="' + THEMEURL + '/images/video-poster.jpg" data-setup="{}" controls> <source src="{{videoUrl}}" type="video/mp4" /> </video> <div class="clearfix"></div> {{/video}} {{#placeholder}} <div class="video-placeholder"><span class="bicon icon-uniF11E"></span>Add Video</div> {{/placeholder}}';

      VideoView.prototype.mixinTemplateHelpers = function(data) {
        data = VideoView.__super__.mixinTemplateHelpers.call(this, data);
        if (!this.model.get('video_id')) {
          data.placeholder = true;
        } else {
          data.video = true;
          data.videourl = '';
        }
        return data;
      };

      VideoView.prototype.events = {
        'click': function(e) {
          e.stopPropagation();
          return this.trigger("show:media:manager");
        }
      };

      VideoView.prototype.onShow = function() {
        var height, videoId, width;
        if (!this.model.get('video_id')) {
          return;
        }
        this.$el.find('video').resize((function(_this) {
          return function() {
            return _this.triggerMethod('video:resized');
          };
        })(this));
        videoId = _.uniqueId('video-');
        this.$el.find('video').attr('id', videoId);
        this.videoElement = videojs(videoId);
        width = this.videoElement.width();
        console.log(width);
        height = 9 * width / 16;
        this.videoElement.height(height);
        return console.log(height);
      };

      VideoView.prototype.onVideoResized = function() {
        var height, width;
        width = this.videoElement.width();
        height = 9 * width / 16;
        return this.videoElement.height(height);
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
