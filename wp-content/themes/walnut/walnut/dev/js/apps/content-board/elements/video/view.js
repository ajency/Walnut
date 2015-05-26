var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        this.onError = __bind(this.onError, this);
        this._playVideo = __bind(this._playVideo, this);
        this._playClickedVideo = __bind(this._playClickedVideo, this);
        this._playNextVideo = __bind(this._playNextVideo, this);
        this._playPrevVideo = __bind(this._playPrevVideo, this);
        this._playFirstVideo = __bind(this._playFirstVideo, this);
        this.onShow = __bind(this.onShow, this);
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '    {{#videoUrl}} <div class="videoContainer"></div> {{/videoUrl}} <img src="./images/video-unavailable.png" alt="no video" class="hidden" width="100%"/> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click .show-playlist': 'togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo',
        'click .video-js': '_playFirstVideo'
      };

      VideoView.prototype.onShow = function() {
        if (!this.model.get('video_ids').length) {
          return;
        }
        this.videos = this.model.get('videoUrls');
        this.index = 0;
        if (_.size(this.videos) > 1) {
          this._setVideoList();
        }
        this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
        if (_.platform() === 'BROWSER') {
          this._addVideoElement(this.videos[0]);
        }
        if (_.platform() === 'DEVICE') {
          this.count = 0;
          return this._decryptLocalVideoFiles();
        }
      };

      VideoView.prototype._setVideoList = function() {
        console.log('@model');
        console.log(this.model);
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

      VideoView.prototype._playFirstVideo = function() {
        if (this.count === 0) {
          this.count++;
          this.$el.find('video')[0].src = this.videos[0];
          this.$el.find('video')[0].load();
          return setTimeout((function(_this) {
            return function() {
              return _this.$el.find('video')[0].play();
            };
          })(this), 300);
        }
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
          this.count++;
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
        this.$el.find('#now-playing-tag').text(this.model.get('title')[this.index]);
        if (_.platform() === 'BROWSER') {
          this.$el.find('video').attr('src', this.videos[this.index]);
          if (!this.videos[this.index]) {
            this.$el.find('video').attr('poster', SITEURL + '/wp-content/themes/walnut/images/video-unavailable.png');
          }
        }
        return this._addVideoElement(this.videos[this.index], true);
      };

      VideoView.prototype._decryptLocalVideoFiles = function() {
        var deferreds, youtubeVideoDeferred;
        navigator.notification.activityStart("Please wait", "Loading content...");
        deferreds = [];
        youtubeVideoDeferred = function(videoSource) {
          var defer;
          defer = $.Deferred();
          defer.resolve(videoSource);
          return defer.promise();
        };
        return _.createVideosWebDirectory().done((function(_this) {
          return function() {
            _.each(_this.videos, function(videoSource, index) {
              var decryptedPath, decryptedVideoPath, encryptedPath, encryptedVideoPath, option, url, value, videoUrl, videosWebUrl;
              if (videoSource.indexOf('youtube.com') < 0) {
                url = videoSource.replace("media-web/", "");
                videosWebUrl = url.substr(url.indexOf("uploads/"));
                videoUrl = videosWebUrl.replace("videos-web", "videos");
                encryptedPath = "SynapseAssets/SynapseMedia/" + videoUrl;
                decryptedPath = "SynapseAssets/SynapseMedia/" + videosWebUrl;
                value = _.getStorageOption();
                option = JSON.parse(value);
                encryptedVideoPath = decryptedVideoPath = '';
                if (option.internal) {
                  encryptedVideoPath = option.internal + '/' + encryptedPath;
                  decryptedVideoPath = option.internal + '/' + decryptedPath;
                } else if (option.external) {
                  encryptedVideoPath = option.external + '/' + encryptedPath;
                  decryptedVideoPath = option.external + '/' + decryptedPath;
                }
                return deferreds.push(_.decryptLocalFile(encryptedVideoPath, decryptedVideoPath));
              } else {
                return deferreds.push(youtubeVideoDeferred(videoSource));
              }
            });
            return $.when.apply($, deferreds).done(function() {
              var videoPaths;
              videoPaths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              _.each(videoPaths, function(localVideoPath, index) {
                if (localVideoPath.indexOf('youtube.com') < 0) {
                  return _this.videos[index] = 'file://' + localVideoPath;
                }
              });
              console.log('_decryptLocalVideoFiles done');
              navigator.notification.activityStop();
              return _this._addVideoElement(_this.videos[0]);
            });
          };
        })(this));
      };

      VideoView.prototype._addVideoElement = function(videoUrl, autoplay) {
        var ratio, setHeight, vidID;
        if (autoplay == null) {
          autoplay = false;
        }
        this.$el.find('.videoContainer').empty();
        if (_.str.contains(videoUrl, 'youtube.com')) {
          vidID = _.str.strRightBack(videoUrl, '?v=');
          return this.$el.find('.videoContainer').html('<div class="videoWrapper"> <iframe width="100%" height="349" src="https://www.youtube.com/embed/' + vidID + '?rel=0&amp;showinfo=0&autoplay=1" frameborder="0"> </iframe></div>');
        } else {
          this.$el.find('.videoContainer').html('<video class="video-js vjs-default-skin" controls preload="none" width="100%" poster="./images/video-poster.jpg" src="' + videoUrl + '" data-setup="{}"> </video>');
          if (_.platform() === 'BROWSER') {
            this.$el.find('video')[0].load();
            this.$el.find('video')[0].play();
          }
          if (_.platform() === 'DEVICE') {
            this.count++;
            ratio = {
              width: 16,
              height: 9
            };
            setHeight = (this.$el.find('video').width() * ratio.height) / ratio.width;
            this.$el.find('video').attr('height', setHeight);
            $('img').addClass('hidden');
            $('video').removeClass('hidden');
            this.$el.find('video')[0].addEventListener('error', this.onError, true);
            this.$el.find('video').on('ended', (function(_this) {
              return function() {
                return _this._playNextVideo();
              };
            })(this));
            this.$el.find('video')[0].load();
            return setTimeout((function(_this) {
              return function() {
                return _this.$el.find('video')[0].play();
              };
            })(this), 500);
          }
        }
      };

      VideoView.prototype.onError = function(evt) {
        $('img').removeClass('hidden');
        $('video').addClass('hidden');
        return this.$el.find('video')[0].removeEventListener('error', this.onError, true);
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
