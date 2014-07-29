var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/audio/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Audio', function(Audio, App, Backbone, Marionette, $, _) {
    return Audio.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        this._getAudioLocalPath = __bind(this._getAudioLocalPath, this);
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
        var runFunc;
        runFunc = (function(_this) {
          return function() {
            return $.Deferred(function(d) {
              var audioPath, audioPaths, audiosWebDirectory, decryptFile, deferreds, localAudioPath, localAudioPaths;
              localAudioPath = new Array();
              audioPath = new Array();
              localAudioPaths = [];
              decryptFile = [];
              deferreds = [];
              audioPaths = [];
              audiosWebDirectory = _.createAudiosWebDirectory();
              return audiosWebDirectory.done(function() {
                var allAudioUrls;
                allAudioUrls = _this.layout.model.get('audioUrls');
                _.each(allAudioUrls, function(allAudioPaths, index) {
                  var audiosWebUrl, decryptedAudioPath, encryptedAudioPath, url;
                  url = allAudioPaths.replace("media-web/", "");
                  audiosWebUrl = url.substr(url.indexOf("uploads/"));
                  audioPaths = audiosWebUrl.replace("audio-web", "audios");
                  encryptedAudioPath = "SynapseAssets/SynapseMedia/" + audioPaths;
                  decryptedAudioPath = "SynapseAssets/SynapseMedia/" + audiosWebUrl;
                  decryptFile = _.decryptVideoFile_N(encryptedAudioPath, decryptedAudioPath);
                  return deferreds.push(decryptFile);
                });
                return $.when.apply($, deferreds).done(function() {
                  var audioPaths;
                  audioPaths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                  _.each(audioPaths, function(localAudioPath, index) {
                    return (function(localAudioPath, index) {
                      audioPath = 'file:///storage/emulated/0/' + localAudioPath;
                      return localAudioPaths.push(audioPath);
                    })(localAudioPath, index);
                  });
                  return d.resolve(_this.layout.model.set('audioUrls', localAudioPaths));
                });
              });
            });
          };
        })(this);
        return $.when(runFunc()).done((function(_this) {
          return function() {
            return _this.layout.elementRegion.show(_this.view);
          };
        })(this)).fail(_.failureHandler);
      };

      Controller.prototype.renderElement = function() {
        this._parseInt();
        this.view = this._getAudioView();
        if (_.platform() === 'DEVICE') {
          return this._getAudioLocalPath();
        }
      };

      return Controller;

    })(Element.Controller);
  });
});
