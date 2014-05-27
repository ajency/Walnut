var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-creator/content-builder/element/controller', 'apps/content-creator/content-builder/elements/video/views'], function(App, Element) {
  return App.module('ContentCreator.ContentBuilder.Element.Video', function(Video, App, Backbone, Marionette, $, _) {
    return Video.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this.renderElement = __bind(this.renderElement, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        _.defaults(options.modelData, {
          element: 'Video',
          video_id: 0,
          height: 0,
          width: 0,
          videoUrl: 'http://video-js.zencoder.com/oceans-clip.mp4'
        });
        return Controller.__super__.initialize.call(this, options);
      };

      Controller.prototype.bindEvents = function() {
        return Controller.__super__.bindEvents.call(this);
      };

      Controller.prototype._getVideoView = function(imageModel) {
        return new Video.Views.VideoView({
          model: this.layout.model
        });
      };

      Controller.prototype.renderElement = function() {
        var view;
        this.removeSpinner();
        view = this._getVideoView();
        App.commands.setHandler("video:moved", function() {
          return view.triggerMethod("video:moved");
        });
        return this.layout.elementRegion.show(view);
      };

      return Controller;

    })(Element.Controller);
  });
});
