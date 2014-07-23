var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        this._firstTimePlay = __bind(this._firstTimePlay, this);
        this._playVideo = __bind(this._playVideo, this);
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '<video id="video1" class="video-js vjs-default-skin" poster="/images/video-poster.jpg" width="100%" data-setup="{}" src="{{videoUrl}}" controls> </video> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click .show-playlist': 'togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo'
      };

      VideoView.prototype.onShow = function() {
        var videosWebDirectory;
        if (!this.model.get('video_ids').length) {
          return;
        }
        this.videos = this.model.get('videoUrls');
        this.index = 0;
        this.$el.find('video').on('ended', (function(_this) {
          return function() {
            console.log("ended");
            return _this._playNextVideo();
          };
        })(this));
        if (_.size(this.videos) > 1) {
          this._setVideoList();
        }
        this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
        if (_.platform() === 'DEVICE') {
          videosWebDirectory = _.createVideosWebDirectory();
          return videosWebDirectory.done((function(_this) {
            return function() {
              return _.each(_this.videos, function(videosource, index) {
                return (function(videosource, index) {
                  var decryptFile, decryptedVideoPath, encryptedVideoPath, url, videoUrl, videosWebUrl;
                  url = videosource.replace("media-web/", "");
                  videosWebUrl = url.substr(url.indexOf("uploads/"));
                  videoUrl = videosWebUrl.replace("videos-web", "videos");
                  encryptedVideoPath = "SynapseAssets/SynapseMedia/" + videoUrl;
                  decryptedVideoPath = "SynapseAssets/SynapseMedia/" + videosWebUrl;
                  decryptFile = _.decryptVideoFile(encryptedVideoPath, decryptedVideoPath);
                  return decryptFile.done(function(videoPath) {
                    console.log(videoPath);
                    _this.videos[index] = videoPath;
                    console.log(_this.videos);
                    console.log(JSON.stringify(_this.videos));
                    return console.log(JSON.stringify(_this.videos[index]));
                  });
                })(videosource, index);
              });
            };
          })(this));
        }
      };

      VideoView.prototype._setVideoList = function() {
        this.$el.append('<div id="playlist-hover" class="playlistHover"> <div class="row m-l-0 m-r-0 p-b-5 m-b-5"> <div class="col-sm-8 nowPlaying"> <span class="small text-muted">Now Playing:</span> <span id="now-playing-tag">' + this.model.get('title')[0] + '</span> </div> <div class="col-sm-4"> <button class="btn btn-white btn-small pull-right show-playlist"> <i class="fa fa-list-ul"></i> Playlist </button> </div> </div> <div class="row m-l-0 m-r-0 playlist-hidden vidList animated fadeInRight" style="display: none;"> <div class="video-list col-sm-8" id="video-list"></div> <div class="col-sm-4 p-t-5 m-b-5"> <button class="btn btn-info btn-small pull-right" id="next"> <i class="fa fa-step-forward"></i> </button> <button class="btn btn-info btn-small pull-right m-r-10" id="prev"> <i class="fa fa-step-backward"></i> </button> </div> </div> </div>');
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
        var videosAll;
        this.$el.find('.playlist-video').removeClass('currentVid');
        this.$el.find(".playlist-video[data-index='" + this.index + "']").addClass('currentVid');
        this.$el.find('#now-playing-tag').text(this.model.get('title')[this.index]);
        if (_.platform() === 'DEVICE') {
          console.log(JSON.stringify(this.videos));
          videosAll = {};
          videosAll["video1"] = this.videos[this.index];
          console.log("video1");
          console.log(videosAll["video1"]);
          window.plugins.html5Video.initialize(videosAll);
          return window.plugins.html5Video.play("video1");
        } else {
          this.$el.find('video').attr('src', this.videos[this.index]);
          this.$el.find('video')[0].load();
          return this.$el.find('video')[0].play();
        }
      };

      VideoView.prototype._firstTimePlay = function() {
        return this._playVideo();
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
