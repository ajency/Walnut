var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/audio/views'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Audio', function(Audio, App, Backbone, Marionette, $, _) {
    return Audio.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Audio',
          audio_id: 0,
          height: 0,
          width: 0,
          audioUrl: ''
        });
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

      Controller.prototype.renderElement = function() {
        var audioModel, view;
        this.removeSpinner();
        view = this.view = this._getAudioView();
        this.layout.elementRegion.show(view);
        audioModel = App.request("get:media:by:id", this.layout.model.get('audio_id'));
        return App.execute("when:fetched", audioModel, (function(_this) {
          return function() {
            view = _this.view = _this._getAudioView(audioModel);
            _this.listenTo(view, "show:media:manager", function() {
              App.execute("show:media:manager:app", {
                region: App.dialogRegion,
                mediaType: 'audio'
              });
              _this.listenTo(App.vent, "media:manager:choosed:media", function(media) {
                _this.layout.model.set({
                  'audio_id': media.get('id'),
                  'audioUrl': media.get('url')
                });
                _this.layout.model.save();
                _this.layout.elementRegion.show(_this.view);
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
              return _this.listenTo(App.vent, "stop:listening:to:media:manager", function() {
                return _this.stopListening(App.vent, "media:manager:choosed:media");
              });
            });
            return _this.layout.elementRegion.show(_this.view);
          };
        })(this));
      };

      return Controller;

    })(Element.Controller);
  });
});
