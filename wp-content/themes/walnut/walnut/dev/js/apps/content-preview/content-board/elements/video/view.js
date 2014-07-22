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

      VideoView.prototype.template = '    <video  class="video-js vjs-default-skin" controls preload="none" width="100%" poster="' + SITEURL + '/wp-content/themes/walnut/images/video-poster.jpg" data-setup="{}" controls src="{{videoUrl}}"> </video> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click .show-playlist': 'togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo'
      };

      VideoView.prototype.onShow = function() {
        if (!this.model.get('video_ids').length) {
          return;
        }
        this.videos = this.model.get('videoUrls');
        this.index = 0;
        this.$el.find('video').on('ended', (function(_this) {
          return function() {
            return _this._playNextVideo();
          };
        })(this));
        if (_.size(this.videos) > 1) {
          this._setVideoList();
        }
        return this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
      };

      VideoView.prototype._setVideoList = function() {
        this.$el.append('<div id="playlist-hover" class="row playlistHover m-l-0 m-r-0" style="z-index:20"> <div class="col-sm-1 show-playlist"><button class="btn btn-info btn-small"><i class="fa fa-list-ul"></i></button></div> <div class="video-list col-sm-9 playlist-hidden" id="video-list" style="display: none;"></div> <div class="col-sm-1 playlist-hidden" id="prev" style="display: none;"><button class="btn btn-info btn-small"><i class="fa fa-step-backward"></i></button></div> <div class="col-sm-1 playlist-hidden" id="next" style="display: none;"><button class="btn btn-info btn-small pull-right"><i class="fa fa-step-forward"></i></button></div> </div>');
        this.$el.find('#video-list').empty();
        return _.each(this.model.get('title'), (function(_this) {
          return function(title, index) {
            return _this.$el.find('#video-list').append("<div class='playlist-video' data-index=" + index + ">" + title + "</div>");
          };
        })(this));
      };

      VideoView.prototype.togglePlaylist = function() {
        return this.$el.find('.playlist-hidden').toggle();
      };

      VideoView.prototype._playPrevVideo = function(e) {
        e.stopPropagation();
        if (this.index > 0) {
          this.index--;
        }
        return this._playVideo();
      };

      VideoView.prototype._playNextVideo = function(e) {
        if (e != null) {
          e.stopPropagation();
        }
        if (this.index < this.videos.length - 1) {
          this.index++;
          return this._playVideo();
        }
      };

      VideoView.prototype._playClickedVideo = function(e) {
        var index;
        e.stopPropagation();
        index = parseInt($(e.target).attr('data-index'));
        this.index = index;
        return this._playVideo();
      };

      VideoView.prototype._playVideo = function() {
        this.$el.find('.playlist-video').removeClass('currentVid');
        this.$el.find(".playlist-video[data-index='" + this.index + "']").addClass('currentVid');
        this.$el.find('video').attr('src', this.videos[this.index]);
        this.$el.find('video')[0].load();
        return this.$el.find('video')[0].play();
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
