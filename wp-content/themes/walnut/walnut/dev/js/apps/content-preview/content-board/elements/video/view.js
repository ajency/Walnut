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

      VideoView.prototype.template = '    <video class="video-js vjs-default-skin" poster="/images/video-poster.jpg" width="100%" data-setup="{}" controls> </video> <div class="clearfix"></div> <div id="playlist-hover" class="row" style="position: absolute; background-color: #000000;  z-index:20;  display: none"> <div class="col-sm-2" id="prev"><button>Prev</button></div> <div class="row video-list col-sm-8" id="video-list"></div> <div class="col-sm-2" id="next"><button>Next</button></div> </div>';

      VideoView.prototype.events = {
        'mouseenter': 'showPlaylist',
        'mouseleave': 'hidePlaylist',
        'click #prev': '_playPrevVideo',
        'click #next': '_playNextVideo',
        'click .playlist-video': '_playClickedVideo'
      };

      VideoView.prototype.onShow = function() {
        var videoId;
        videoId = _.uniqueId('video-');
        this.$el.find('video').attr('id', videoId);
        this._setPlaylistPosition();
        return this._setVideoList();
      };

      VideoView.prototype._setPlaylistPosition = function() {
        var position;
        position = this.$el.position();
        return this.$el.find('#playlist-hover').css({
          'top': position.top + this.$el.height(),
          'left': position.left + 15,
          'width': this.$el.width()
        });
      };

      VideoView.prototype._setVideoList = function() {
        this.$el.find('#video-list').empty();
        return _.each(this.model.get('title'), (function(_this) {
          return function(title, index) {
            return _this.$el.find('#video-list').append("<div class='col-sm-6 playlist-video' data-index=" + index + ">" + title + "</div>");
          };
        })(this));
      };

      VideoView.prototype.showPlaylist = function() {
        this._setPlaylistPosition();
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

      return VideoView;

    })(Marionette.ItemView);
  });
});
