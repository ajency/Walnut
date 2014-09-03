var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(['app', 'apps/content-preview/content-board/element/controller', 'apps/content-preview/content-board/elements/audio/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Audio', function(Audio, App, Backbone, Marionette, $, _) {
    return Audio.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getLocalAudioCollection = __bind(this._getLocalAudioCollection, this);
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

      Controller.prototype._getAudioCollection = function() {
        if (!this.audioCollection) {
          if (this.layout.model.get('audio_ids').length) {
            this.audioCollection = App.request("get:media:collection:by:ids", this.layout.model.get('audio_ids'));
          } else {
            this.audioCollection = App.request("get:empty:media:collection");
          }
        }
        this.audioCollection.comparator = 'order';
        return this.audioCollection;
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

      Controller.prototype.renderElement = function() {
        var audioCollection;
        this._parseInt();
        if (_.platform() === 'BROWSER') {
          audioCollection = this._getAudioCollection();
          return App.execute("when:fetched", audioCollection, (function(_this) {
            return function() {
              _this.layout.model.set({
                'audioUrls': _.first(audioCollection.pluck('url'))
              });
              _this.layout.model.set({
                'audioUrls': audioCollection.pluck('url')
              });
              _this.view = _this._getAudioView();
              return _this.layout.elementRegion.show(_this.view);
            };
          })(this));
        } else {
          return this._getLocalAudioCollection();
        }
      };

      Controller.prototype._getLocalAudioCollection = function() {
        var runFunc;
        runFunc = (function(_this) {
          return function() {
            return $.Deferred(function(d) {
              var audiosWebDirectory, deferreds, localAudioPaths;
              localAudioPaths = [];
              deferreds = [];
              audiosWebDirectory = _.createAudiosWebDirectory();
              return audiosWebDirectory.done(function() {
                var allAudioUrls;
                allAudioUrls = _this.layout.model.get('audioUrls');
                _.each(allAudioUrls, function(audioUrl, index) {
                  return (function(audioUrl) {
                    var audioWebPath, audiosPath, decryptFile, decryptedAudioPath, encryptedAudioPath, url;
                    url = audioUrl.replace("media-web/", "");
                    audioWebPath = url.substr(url.indexOf("uploads/"));
                    audiosPath = audioWebPath.replace("audio-web", "audios");
                    encryptedAudioPath = "SynapseAssets/SynapseMedia/" + audiosPath;
                    decryptedAudioPath = "SynapseAssets/SynapseMedia/" + audioWebPath;
                    decryptFile = _.decryptLocalFile(encryptedAudioPath, decryptedAudioPath);
                    return deferreds.push(decryptFile);
                  })(audioUrl);
                });
                return $.when.apply($, deferreds).done(function() {
                  var audioPaths;
                  audioPaths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
                  _.each(audioPaths, function(localAudioPath, index) {
                    return (function(localAudioPath) {
                      var localPath;
                      localPath = 'file:///mnt/sdcard/' + localAudioPath;
                      return localAudioPaths.push(localPath);
                    })(localAudioPath);
                  });
                  return d.resolve(_this.layout.model.set('audioUrls', localAudioPaths));
                });
              });
            });
          };
        })(this);
        return $.when(runFunc()).done((function(_this) {
          return function() {
            console.log('_getLocalAudioCollection done');
            _this.view = _this._getAudioView();
            return _this.layout.elementRegion.show(_this.view);
          };
        })(this)).fail(_.failureHandler);
      };

      return Controller;

    })(Element.Controller);
  });
});
