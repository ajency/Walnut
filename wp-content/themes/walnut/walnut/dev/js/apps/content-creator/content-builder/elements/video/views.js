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

      VideoView.prototype.template = '{{#video}} <video  class="video-js vjs-default-skin show-video" controls preload="none" width="100%" poster="' + SITEURL + '/wp-content/themes/walnut/images/video-poster.jpg" data-setup="{}" controls> </video> <div class="clearfix"></div> <div id="playlist-hover" class="row playlistHover m-l-0 m-r-0" style="z-index:20"> <div class="col-sm-1"><button class="btn btn-info btn-small"><i class="fa fa-list-ul"></i></button></div> <div class="video-list col-sm-9" id="video-list"></div> <div class="col-sm-1" id="prev"><button class="btn btn-info btn-small"><i class="fa fa-step-backward"></i></button></div> <div class="col-sm-1" id="next"><button class="btn btn-info btn-small pull-right"><i class="fa fa-step-forward"></i></button></div> </div> {{/video}} {{#placeholder}} <div class="video-placeholder show-video "><span class="bicon icon-uniF11E"></span>Add Video</div> {{/placeholder}}';

      VideoView.prototype.mixinTemplateHelpers = function(data) {
        data = VideoView.__super__.mixinTemplateHelpers.call(this, data);
        if (!this.model.get('video_ids').length) {
          data.placeholder = true;
        } else {
          data.video = true;
        }
        return data;
      };

      VideoView.prototype.events = {
        'click .show-video': function(e) {
          e.stopPropagation();
          return this.trigger("show:media:manager");
        },
        'mouseenter': 'showPlaylist',
        'mouseleave': 'hidePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo'
      };

      VideoView.prototype.onShow = function() {
        var height, videoId, videos, width;
        if (!this.model.get('video_ids').length) {
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
        videos = new Array();
        _.each(this.model.get('videoUrl'), function(url) {
          return videos.push({
            src: [url]
          });
        });
        this.videoElement.playList(videos, {
          getVideoSource: function(vid, cb) {
            return cb(vid.src);
          }
        });
        width = this.videoElement.width();
        height = 9 * width / 16;
        this.videoElement.height(height);
        this._setPlaylistPosition();
        return this._setVideoList();
      };

      VideoView.prototype._setPlaylistPosition = function() {};

      VideoView.prototype._setVideoList = function() {
        this.$el.find('#video-list').empty();
        return _.each(this.model.get('title'), (function(_this) {
          return function(title, index) {
            return _this.$el.find('#video-list').append("<div class='playlist-video' data-index=" + index + ">" + title + "</div>");
          };
        })(this));
      };

      VideoView.prototype.showPlaylist = function() {
        this._setVideoList();
        return this.$el.find('#playlist-hover').show();
      };

      VideoView.prototype.hidePlaylist = function() {
        return this.$el.find('#playlist-hover').hide();
      };

      VideoView.prototype._playPrevVideo = function() {
        return this.videoElement.prev();
      };

      VideoView.prototype._playNextVideo = function() {
        return this.videoElement.next();
      };

      VideoView.prototype._playClickedVideo = function(e) {
        var index;
        index = parseInt($(e.target).attr('data-index'));
        return this.videoElement.playList(index);
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
