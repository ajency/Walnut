var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Breadcrumb", function(Breadcrumb, App, Backbone, Marionette, $, _) {
    var API;
    Breadcrumb.BreadcrumbModel = (function(_super) {
      __extends(BreadcrumbModel, _super);

      function BreadcrumbModel() {
        return BreadcrumbModel.__super__.constructor.apply(this, arguments);
      }

      BreadcrumbModel.prototype.name = 'breadcrumb';

      BreadcrumbModel.prototype.defaults = function() {
        return {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Creator',
              'link': 'javascript://'
            }, {
              'label': 'Textbooks',
              'link': 'javascript://',
              'active': 'active'
            }
          ]
        };
      };

      return BreadcrumbModel;

    })(Backbone.Model);
    window.breadcrumb = new Breadcrumb.BreadcrumbModel;
    API = {
      updateBreadcrumbModel: function(data) {
        breadcrumb.set(data);
        return App.execute("show:breadcrumbapp", {
          region: App.breadcrumbRegion
        });
      }
    };
    App.reqres.setHandler("get:breadcrumb:model", function() {
      return breadcrumb;
    });
    return App.commands.setHandler("update:breadcrumb:model", function(data) {
      return API.updateBreadcrumbModel(data);
    });
  });
});
