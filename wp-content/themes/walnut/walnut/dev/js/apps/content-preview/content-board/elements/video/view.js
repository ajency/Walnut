var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        this._playVideo = __bind(this._playVideo, this);
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '<video class="video-js vjs-default-skin" poster="/images/video-poster.jpg" width="100%" data-setup="{}" controls > </video> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click .show-playlist': '_togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo'
      };

      VideoView.prototype.onShow = function() {
        var heightRatio, setHeight, videosWebDirectory, widthRatio;
        alert("width");
        console.log(this.$el.find('video').attr('width'));
        if (!this.model.get('video_ids').length) {
          return;
        }
        this.videos = this.model.get('videoUrls');
        this.index = 0;
        this.videoId = _.uniqueId('video_');
        this.$el.find('video').attr('id', this.videoId);
        widthRatio = 16;
        heightRatio = 9;
        setHeight = (this.$el.find('video').width() * heightRatio) / widthRatio;
        this.$el.find('video').attr('height', setHeight);
        console.log(this.$el.find('video').attr('height'));
        this.$el.find('video').on('ended', (function(_this) {
          return function() {
            console.log("done");
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
              return _.each(_this.videos, function(videoSource, index) {
                return (function(videoSource, index) {
                  var decryptFile, decryptedVideoPath, encryptedVideoPath, url, videoUrl, videosWebUrl;
                  url = videoSource.replace("media-web/", "");
                  videosWebUrl = url.substr(url.indexOf("uploads/"));
                  videoUrl = videosWebUrl.replace("videos-web", "videos");
                  encryptedVideoPath = "SynapseAssets/SynapseMedia/" + videoUrl;
                  decryptedVideoPath = "SynapseAssets/SynapseMedia/" + videosWebUrl;
                  decryptFile = _.decryptVideoFile(encryptedVideoPath, decryptedVideoPath);
                  return decryptFile.done(function(videoPath) {
                    _this.videos[index] = 'file:///mnt/sdcard/' + videoPath;
                    if (index === 0) {
                      _this.$el.find('#' + _this.videoId)[0].src = _this.videos[index];
                      return _this.$el.find('#' + _this.videoId)[0].load();
                    }
                  });
                })(videoSource, index);
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

      VideoView.prototype._togglePlaylist = function() {
        return this.$el.find('.playlist-hidden').toggle();
      };

      VideoView.prototype._playPrevVideo = function(e) {
        e.stopPropagation();
        this.$el.find('video').attr('height', 'auto !important');
        if (this.index > 0) {
          this.index--;
        }
        return this._playVideo();
      };

      VideoView.prototype._playNextVideo = function(e) {
        if (e != null) {
          e.stopPropagation();
        }
        this.$el.find('video').attr('height', 'auto !important');
        if (this.index < this.videos.length - 1) {
          this.index++;
          return this._playVideo();
        }
      };

      VideoView.prototype._playClickedVideo = function(e) {
        var index;
        e.stopPropagation();
        this.$el.find('video').attr('height', 'auto !important');
        index = parseInt($(e.target).attr('data-index'));
        this.index = index;
        return this._playVideo();
      };

      VideoView.prototype._playVideo = function() {
        console.log(this.index);
        this.$el.find('video').attr('height', 'auto !important');
        this.$el.find('.playlist-video').removeClass('currentVid');
        this.$el.find(".playlist-video[data-index='" + this.index + "']").addClass('currentVid');
        this.$el.find('#now-playing-tag').text(this.model.get('title')[this.index]);
        this.$el.find('video')[0].src = this.videos[this.index];
        console.log(this.videos[this.index]);
        this.$el.find('video')[0].load();
        return this.$el.find('video')[0].play();
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
