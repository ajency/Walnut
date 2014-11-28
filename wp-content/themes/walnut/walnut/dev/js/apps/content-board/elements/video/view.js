var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'bootbox'], function(App, bootbox) {
  return App.module('ContentPreview.ContentBoard.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(_super) {
      __extends(VideoView, _super);

      function VideoView() {
        this._playFirstVideo = __bind(this._playFirstVideo, this);
        this.onError = __bind(this.onError, this);
        this.ontimeUpdate = __bind(this.ontimeUpdate, this);
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '    {{#videoUrl}} <video class="video-js vjs-default-skin" controls poster="/images/video-poster.jpg" preload="none" width="100%" data-setup="{}" > </video> {{/videoUrl}} <img src="/images/video-unavailable.png" alt="no video" class="hidden" width="100%"/> <div class="clearfix"></div>';

      VideoView.prototype.events = {
        'click .show-playlist': 'togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo',
        'click .video-js': '_playFirstVideo'
      };

      VideoView.prototype.onShow = function() {
        var heightRatio, setHeight, widthRatio;
        $('img').addClass('hidden');
        $('video').removeClass('hidden');
        if (!this.model.get('video_ids').length) {
          return;
        }
        this.videos = this.model.get('videoUrls');
        this.index = 0;
        this.count = 0;
        this.timeUpdateValue = 0;
        this.$el.find('video').on('ended', (function(_this) {
          return function() {
            return _this._playNextVideo();
          };
        })(this));
        if (_.size(this.videos) > 1) {
          this._setVideoList();
        }
        this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
        widthRatio = 16;
        heightRatio = 9;
        setHeight = (this.$el.find('video').width() * heightRatio) / widthRatio;
        this.$el.find('video').attr('height', setHeight);
        this.$el.find('video')[0].currentTime;
        this.$el.find('video')[0].addEventListener('timeupdate', this.ontimeUpdate);
        return this.$el.find('video')[0].addEventListener('error', this.onError, true);
      };

      VideoView.prototype.ontimeUpdate = function() {
        this.videoTimeUpdate = this.$el.find('video')[0].currentTime;
        this.timeUpdateValue = this.timeUpdateValue + 1;
        if (this.timeUpdateValue === 1) {
          return setTimeout((function(_this) {
            return function() {
              return _this.ontimeUpdate();
            };
          })(this), 1000);
        } else {
          setTimeout((function(_this) {
            return function() {
              return _this.videoTimeUpdate = _this.$el.find('video')[0].currentTime;
            };
          })(this), 300);
          if (this.videoTimeUpdate === 0) {
            this.$el.find('img').attr('height', 'auto !important');
            $('img').removeClass('hidden');
            $('video').addClass('hidden');
          }
          return this.$el.find('video')[0].removeEventListener('timeupdate', this.ontimeUpdate, false);
        }
      };

      VideoView.prototype.onError = function(evt) {
        this.$el.find('img').attr('height', 'auto !important');
        $('img').removeClass('hidden');
        $('video').addClass('hidden');
        return this.$el.find('video')[0].removeEventListener('error', this.onError, true);
      };

      VideoView.prototype._setVideoList = function() {
        console.log(this.model);
        this.$el.append('<div id="playlist-hover" class="playlistHover"> <div class="row m-l-0 m-r-0 p-b-5 m-b-5"> <div class="col-sm-8 nowPlaying"> <span class="small text-muted">Now Playing:</span> <span id="now-playing-tag">' + this.model.get('title')[0] + '</span> </div> <div class="col-sm-4"> <button class="btn btn-white btn-small pull-right show-playlist"> <i class="fa fa-list-ul"></i> Playlist </button> </div> </div> <div class="row m-l-0 m-r-0 playlist-hidden vidList animated fadeInRight" style="display: none;"> <div class="video-list col-sm-8" id="video-list"></div> <div class="col-sm-4 p-t-5 m-b-5"> <button class="btn btn-info btn-small pull-right" id="next"> <i class="fa fa-step-forward"></i> </button> <button class="btn btn-info btn-small pull-right m-r-10" id="prev"> <i class="fa fa-step-backward"></i> </button> </div> </div> </div>');
        this.$el.find('#video-list').empty();
        return _.each(this.model.get('title'), (function(_this) {
          return function(title, index) {
            return _this.$el.find('#video-list').append("<div class='playlist-video' data-index=" + index + ">" + title + "</div>");
          };
        })(this));
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

      VideoView.prototype.togglePlaylist = function() {
        return this.$el.find('.playlist-hidden').toggle();
      };

      VideoView.prototype._playPrevVideo = function(e) {
        var heightRatio, setHeight, widthRatio;
        $('img').addClass('hidden');
        $('video').removeClass('hidden');
        widthRatio = 16;
        heightRatio = 9;
        setHeight = (this.$el.find('video').width() * heightRatio) / widthRatio;
        this.$el.find('video').attr('height', setHeight);
        e.stopPropagation();
        if (this.index > 0) {
          this.index--;
        }
        return this._playVideo();
      };

      VideoView.prototype._playNextVideo = function(e) {
        var heightRatio, setHeight, widthRatio;
        $('img').addClass('hidden');
        $('video').removeClass('hidden');
        widthRatio = 16;
        heightRatio = 9;
        setHeight = (this.$el.find('video').width() * heightRatio) / widthRatio;
        this.$el.find('video').attr('height', setHeight);
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
        var heightRatio, index, setHeight, widthRatio;
        $('img').addClass('hidden');
        $('video').removeClass('hidden');
        widthRatio = 16;
        heightRatio = 9;
        setHeight = (this.$el.find('video').width() * heightRatio) / widthRatio;
        this.$el.find('video').attr('height', setHeight);
        e.stopPropagation();
        index = parseInt($(e.target).attr('data-index'));
        this.index = index;
        return this._playVideo();
      };

      VideoView.prototype._playVideo = function() {
        this.timeUpdateValue = 0;
        this.$el.find('video')[0].currentTime;
        this.count++;
        this.$el.find('.playlist-video').removeClass('currentVid');
        this.$el.find(".playlist-video[data-index='" + this.index + "']").addClass('currentVid');
        this.$el.find('#now-playing-tag').text(this.model.get('title')[this.index]);
        if (_.platform() === 'BROWSER') {
          this.$el.find('video').attr('src', this.videos[this.index]);
          this.$el.find('video').attr('poster', SITEURL + '/wp-content/themes/walnut/images/video-unavailable.png');
        } else {
          this.$el.find('video')[0].src = this.videos[this.index];
        }
        this.$el.find('video')[0].load();
        this.$el.find('video')[0].play();
        return this.$el.find('video')[0].addEventListener('timeupdate', this.ontimeUpdate);
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
