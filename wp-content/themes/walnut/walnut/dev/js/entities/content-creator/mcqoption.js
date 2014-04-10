var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.McqOption", function(McqOption, App, Backbone, Marionette, _, $) {
    var API;
    McqOption.McqModel = (function(_super) {
      __extends(McqModel, _super);

      function McqModel() {
        return McqModel.__super__.constructor.apply(this, arguments);
      }

      McqModel.prototype.defaults = function() {
        return {
          marks: 0,
          text: ''
        };
      };

      return McqModel;

    })(Backbone.Model);
    McqOption.McqCollection = (function(_super) {
      __extends(McqCollection, _super);

      function McqCollection() {
        return McqCollection.__super__.constructor.apply(this, arguments);
      }

      McqCollection.prototype.model = McqOption.McqModel;

      return McqCollection;

    })(Backbone.Collection);
    API = {
      createMcqOption: function(data) {
        var mcqOption;
        mcqOption = new McqOption.McqModel;
        mcqOption.set(data);
        return mcqOption;
      },
      createMcqOptionCollection: function(data) {
        var mcqCollection;
        if (data == null) {
          data = {};
        }
        mcqCollection = new McqOption.McqCollection;
        mcqCollection.set(data);
        return mcqCollection;
      }
    };
    App.reqres.setHandler("create:new:mcq:option", function(data) {
      return API.createMcqOption(data);
    });
    return App.reqres.setHandler("create:new:mcq:option:collection", function(data) {
      return API.createMcqOptionCollection(data);
    });
  });
});
