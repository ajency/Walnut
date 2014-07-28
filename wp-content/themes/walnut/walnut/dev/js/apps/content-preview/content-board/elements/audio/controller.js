var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/audio/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Audio', function(Audio, App, Backbone, Marionette, $, _) {
    return Audio.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getAudioView = function() {
        return new Audio.Views.AudioView({
          model: this.layout.model
        });
      };

      Controller.prototype._parseInt = function() {
        var audio_ids;
        audio_ids = new Array();
        if (!this.layout.model.get('audio_ids') && this.layout.model.get('audio_id')) {
          this.layout.model.set('audio_ids', [this.layout.model.get('audio_id')]);
          this.layout.model.set('audioUrls', [this.layout.model.get('audioUrl')]);
        }
        _.each(this.layout.model.get('audio_ids'), function(id) {
          return audio_ids.push(parseInt(id));
        });
        return this.layout.model.set('audio_ids', audio_ids);
      };

      Controller.prototype._getAudioLocalPath = function() {
        var audioPaths, audiosWebDirectory, decryptFile, deferreds, localAudioPath;
        localAudioPath = new Array();
        decryptFile = [];
        deferreds = [];
        audioPaths = [];
        audiosWebDirectory = _.createAudiosWebDirectory();
        return audiosWebDirectory.done((function(_this) {
          return function() {
            var allAudioUrls;
            allAudioUrls = _this.layout.model.get('audioUrls');
            return _.each(allAudioUrls, function(allAudioPaths, index) {
              var _ref;
              (function(allAudioPaths, index) {
                var audiosWebUrl, decryptedAudioPath, encryptedAudioPath, url;
                url = allAudioPaths.replace("media-web/", "");
                audiosWebUrl = url.substr(url.indexOf("uploads/"));
                console.log(audiosWebUrl);
                audioPaths = audiosWebUrl.replace("audio-web", "audios");
                console.log(audioPaths);
                encryptedAudioPath = "SynapseAssets/SynapseMedia/" + audioPaths;
                decryptedAudioPath = "SynapseAssets/SynapseMedia/" + audiosWebUrl;
                decryptFile = _.decryptVideoFile(encryptedAudioPath, decryptedAudioPath);
                return deferreds.push(decryptFile);
              })(allAudioPaths, index);
              console.log(JSON.stringify(deferreds));
              return (_ref = $.when.apply($, deferreds)).done.apply(_ref, audioPaths)(function() {
                console.log(audioPaths);
                console.log(JSON.stringify(audioPaths));
                localAudioPath[index] = 'file:///mnt/sdcard/' + audioPaths;
                console.log(localAudioPath[index]);
                localAudioPaths.push(localAudioPath);
                return _this.layout.model.set('audioUrls', localAudioPaths);
              });
            });
          };
        })(this));
      };

      Controller.prototype.renderElement = function() {
        this._parseInt();
        this.view = this._getAudioView();
        this._getAudioLocalPath();
        return this.layout.elementRegion.show(this.view);
      };

      return Controller;

    })(Element.Controller);
  });
});
