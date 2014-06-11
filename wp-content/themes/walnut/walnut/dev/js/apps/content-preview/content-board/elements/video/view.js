var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '<video  class="video-js vjs-default-skin" controls preload="none" width="100%" poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg" data-setup="{}" controls> <source src="{{videoUrl}}" type="video/mp4" /> </video> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click': function(e) {
          return e.stopPropagation();
        }
      };

      VideoView.prototype.onShow = function() {
        var height, videoId, width;
        console.log(this.model);
        videoId = _.uniqueId('video-');
        this.$el.find('video').attr('id', videoId);
        this.videoElement = videojs(videoId);
        width = this.videoElement.width();
        height = 9 * width / 16;
        return this.videoElement.height(height);
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
