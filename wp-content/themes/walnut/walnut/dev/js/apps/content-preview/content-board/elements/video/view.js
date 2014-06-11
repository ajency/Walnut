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

      VideoView.prototype.template = '<video class="video-js vjs-default-skin" poster="http://www.eyespot.com/2013/wp-content/uploads/2013/04/video-clip.jpg" width="100%" data-setup="{}" controls></video> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click': function(e) {
          return e.stopPropagation();
        }
      };

      VideoView.prototype.onShow = function() {
        var url, videoId, videoPath, videoUrl, videos;
        console.log(this.model);
        videoId = _.uniqueId('video_');
        this.$el.find('video').attr('id', videoId);
        if (_.platform() === 'DEVICE') {
          url = this.model.get('videoUrl');
          videoUrl = url.substr(url.indexOf("uploads/"));
          videoPath = "SynapseAssets/SynapseImages/" + videoUrl;
          videos = {};
          videos[videoId] = videoPath;
          window.plugins.html5Video.initialize(videos);
          return window.plugins.html5Video.play(videoId);
        }
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
