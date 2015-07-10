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

      VideoView.prototype.template = '    {{#videoUrl}} <div class="videoContainer"></div> {{/videoUrl}} {{^videoUrl}} <video  class="video-js vjs-default-skin" controls preload="none" width="100%" poster="' + SITEURL + '/wp-content/themes/walnut/images/video-unavailable.png" data-setup="{}" controls src="{{videoUrl}}"> </video> {{/videoUrl}} <div class="clearfix"></div>';

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
        this.model.set({
          'autoplay': _.toBool(this.model.get('autoplay'))
        });
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
        this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
        return this._addVideoElement(this.videos[0], this.model.get('autoplay'));
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
        this.$el.find('.playlist-video').removeClass('currentVid');
        this.$el.find(".playlist-video[data-index='" + this.index + "']").addClass('currentVid');
        this.$el.find('#now-playing-tag').text(this.model.get('title')[this.index]);
        this.$el.find('video').attr('src', this.videos[this.index]);
        if (!this.videos[this.index]) {
          this.$el.find('video').attr('poster', SITEURL + '/wp-content/themes/walnut/images/video-unavailable.png');
        }
        return this._addVideoElement(this.videos[this.index], true);
      };

      VideoView.prototype._addVideoElement = function(videoUrl, autoplay) {
        var params, startTime, vidID;
        if (autoplay == null) {
          autoplay = false;
        }
        this.$el.find('.videoContainer').empty();
        if (_.str.contains(videoUrl, 'youtube.com')) {
          autoplay = autoplay ? 1 : 0;
          params = "&autoplay=" + autoplay;
          startTime = this.model.get('startTime') ? this.model.get('startTime') : 0;
          params += "&start=" + startTime;
          if (this.model.get('endTime') && this.model.get('endTime') !== '0') {
            params += "&end=" + this.model.get('endTime');
          }
          vidID = _.str.strRightBack(videoUrl, '?v=');
          return this.$el.find('.videoContainer').html('<div class="videoWrapper"> <iframe width="100%" height="349" src="https://www.youtube.com/embed/' + vidID + '?rel=0&amp;showinfo=0' + params + '" frameborder="0"> </iframe></div>');
        } else {
          videoUrl += "#t=";
          if (this.model.get('startTime')) {
            videoUrl += this.model.get('startTime');
          } else {
            videoUrl += 0;
          }
          if (this.model.get('endTime') && this.model.get('endTime') !== '0') {
            videoUrl += "," + this.model.get('endTime');
          }
          this.$el.find('.videoContainer').html('<video class="video-js vjs-default-skin show-video" controls preload="none" height="auto" width="100%" poster="' + SITEURL + '/wp-content/themes/walnut/images/video-poster.jpg" data-setup="{}" controls src="' + videoUrl + '"> </video>');
          this.$el.find('video')[0].load();
          if (autoplay) {
            return this.$el.find('video')[0].play();
          }
        }
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
