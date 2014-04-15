var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Divisions", function(Divisions, App, Backbone, Marionette, $, _) {
    var API, DivisionCollection, DivisionModel, divisionCollection;
    DivisionModel = (function(_super) {
      __extends(DivisionModel, _super);

      function DivisionModel() {
        return DivisionModel.__super__.constructor.apply(this, arguments);
      }

      DivisionModel.prototype.idAttribute = 'id';

      DivisionModel.prototype.defaults = {
        division: '',
        class_id: ''
      };

      DivisionModel.prototype.name = 'division';

      return DivisionModel;

    })(Backbone.Model);
    DivisionCollection = (function(_super) {
      __extends(DivisionCollection, _super);

      function DivisionCollection() {
        return DivisionCollection.__super__.constructor.apply(this, arguments);
      }

      DivisionCollection.prototype.model = DivisionModel;

      DivisionCollection.prototype.url = function() {
        return AJAXURL + '?action=get-divisions';
      };

      DivisionCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return DivisionCollection;

    })(Backbone.Collection);
    divisionCollection = new DivisionCollection;
    API = {
      getDivisions: function(param) {
        if (param == null) {
          param = {};
        }
        divisionCollection.fetch({
          reset: true,
          data: param
        });
        return divisionCollection;
      }
    };
    return App.reqres.setHandler("get:divisions", function(opt) {
      return API.getDivisions(opt);
    });
  });
});
