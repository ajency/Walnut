var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Video.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.VideoView = (function(superClass) {
      extend(VideoView, superClass);

      function VideoView() {
        this._showProperties = bind(this._showProperties, this);
        this._playVideo = bind(this._playVideo, this);
        return VideoView.__super__.constructor.apply(this, arguments);
      }

      VideoView.prototype.className = 'video';

      VideoView.prototype.template = '{{#video}} <div class="videoContainer"></div> <div class="clearfix"></div> {{/video}} {{#placeholder}} <div class="video-placeholder show-video "><span class="bicon icon-uniF11E"></span>Add Video</div> {{/placeholder}}';

      VideoView.prototype.mixinTemplateHelpers = function(data) {
        data = VideoView.__super__.mixinTemplateHelpers.call(this, data);
        if (!this.model.get('video_ids').length) {
          data.placeholder = true;
        } else {
          data.video = true;
          data.videourl = data.videoUrls[0];
        }
        return data;
      };

      VideoView.prototype.events = {
        'click .show-video': '_showMediaManager',
        'click .show-playlist': 'togglePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo',
        'click': function() {
          return this.trigger("show:video:properties");
        }
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
        this.$el.find(".playlist-video[data-index='0']").addClass('currentVid');
        this._addVideoElement(this.videos[0]);
        this.$el.closest('.element-wrapper').off('click', this._showProperties);
        return this.$el.closest('.element-wrapper').on('click', this._showProperties);
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
        return this._addVideoElement(this.videos[this.index], true);
      };

      VideoView.prototype._showMediaManager = function(e) {
        e.stopPropagation();
        return this.trigger("show:media:manager");
      };

      VideoView.prototype._addVideoElement = function(videoUrl, autoplay) {
        var vidID;
        if (autoplay == null) {
          autoplay = false;
        }
        this.$el.find('.videoContainer').empty();
        if (_.str.contains(videoUrl, 'youtube.com')) {
          vidID = _.str.strRightBack(videoUrl, '?v=');
          return this.$el.find('.videoContainer').html('<div class="videoWrapper"> <iframe width="100%" height="349" src="https://www.youtube.com/embed/' + vidID + '?rel=0&amp;showinfo=0&autoplay=1" frameborder="0"> </iframe></div>');
        } else {
          this.$el.find('.videoContainer').html('<video class="video-js vjs-default-skin show-video" controls preload="none" height="auto" width="100%" poster="' + SITEURL + '/wp-content/themes/walnut/images/video-poster.jpg" data-setup="{}" controls src="' + videoUrl + '"> </video>');
          this.$el.find('video')[0].load();
          return this.$el.find('video')[0].play();
        }
      };

      VideoView.prototype._showProperties = function(evt) {
        this.trigger("show:video:properties");
        return evt.stopPropagation();
      };

      return VideoView;

    })(Marionette.ItemView);
  });
});
