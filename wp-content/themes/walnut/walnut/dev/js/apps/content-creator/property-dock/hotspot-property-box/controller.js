var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/hotspot-property-box/view'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.HotspotPropertyBox", function(HotspotPropertyBox, App, Backbone, Marionette, $, _) {
    HotspotPropertyBox.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model;
        this.layout = this._getView(this.model);
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new HotspotPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        var collection_types, correctAns, imageCollection, imageModels, optionCollection, optionModels, optsColl, textCollection, textModels;
        App.execute("save:hotspot:content");
        console.log(this.model);
        collection_types = ['option', 'image', 'text'];
        optionCollection = this.model.get('optionCollection').models;
        optionModels = _.map(optionCollection, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'optionCollection': optionModels
        });
        imageCollection = this.model.get('imageCollection').models;
        imageModels = _.map(imageCollection, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'imageCollection': imageModels
        });
        textCollection = this.model.get('textCollection').models;
        textModels = _.map(textCollection, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'textCollection': textModels
        });
        optsColl = this.model.get('optionCollection');
        if (this.model.get('marks') > 0 && !_.every(optsColl, function(option) {
          return !option.correct;
        })) {
          this.model.set('complete', true);
        } else {
          this.model.set('complete', false);
        }
        if (this.model.get('enableIndividualMarks')) {
          correctAns = _.where(optsColl, {
            'correct': true
          });
          if (!_.every(correctAns, function(option) {
            if (option.marks > 0) {
              return true;
            }
          })) {
            this.model.set('complete', false);
          }
        }
        this.model.save();
        optionCollection = App.request("create:new:hotspot:element:collection", optionCollection);
        imageCollection = App.request("create:new:hotspot:element:collection", imageCollection);
        textCollection = App.request("create:new:hotspot:element:collection", textCollection);
        return this.model.set({
          'optionCollection': optionCollection,
          'imageCollection': imageCollection,
          'textCollection': textCollection
        });
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:hotspot:properties", function(options) {
      return new HotspotPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
