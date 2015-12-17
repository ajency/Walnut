var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'backbone'], function(App, Backbone) {
  return App.module("Entities.Option", function(Option, App, Backbone, Marionette, $, _) {
    var API;
    Option.OptionModel = (function(superClass) {
      extend(OptionModel, superClass);

      function OptionModel() {
        return OptionModel.__super__.constructor.apply(this, arguments);
      }

      OptionModel.prototype.idAttribute = 'optionNo';

      OptionModel.prototype.defaults = function() {
        return {
          marks: 0,
          text: ''
        };
      };

      OptionModel.prototype.name = 'option-model';

      return OptionModel;

    })(Backbone.Model);
    Option.OptionCollection = (function(superClass) {
      extend(OptionCollection, superClass);

      function OptionCollection() {
        return OptionCollection.__super__.constructor.apply(this, arguments);
      }

      OptionCollection.prototype.model = Option.OptionModel;

      return OptionCollection;

    })(Backbone.Collection);
    API = {
      createOption: function(data) {
        var option;
        option = new Option.OptionModel;
        option.set(data);
        return option;
      },
      createOptionCollection: function(data) {
        var optionCollection;
        if (data == null) {
          data = {};
        }
        optionCollection = new Option.OptionCollection;
        optionCollection.set(data);
        return optionCollection;
      }
    };
    App.reqres.setHandler("create:new:option", function(data) {
      return API.createOption(data);
    });
    return App.reqres.setHandler("create:new:option:collection", function(data) {
      return API.createOptionCollection(data);
    });
  });
});
