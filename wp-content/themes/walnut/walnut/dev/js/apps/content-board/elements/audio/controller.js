var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'apps/content-board/element/controller', 'apps/content-board/elements/audio/views'], function(App, Element) {
  return App.module('ContentPreview.ContentBoard.Element.Audio', function(Audio, App, Backbone, Marionette, $, _) {
    return Audio.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this.renderElement = bind(this.renderElement, this);
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
      };

      return Controller;

    })(Element.Controller);
  });
});
