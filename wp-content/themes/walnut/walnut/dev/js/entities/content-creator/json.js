var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.BuilderJSON", function(BuilderJSON, App, Backbone, Marionette, $, _) {
    var API, PageJson;
    PageJson = (function(_super) {
      __extends(PageJson, _super);

      function PageJson() {
        return PageJson.__super__.constructor.apply(this, arguments);
      }

      PageJson.prototype.idAttribute = 'page_id';

      PageJson.prototype.name = 'page-json';

      return PageJson;

    })(Backbone.Model);
    API = {
      getPageJSON: function() {
        var json, jsonModel;
        jsonModel = new PageJson;
        json = localStorage.getItem('layout');
        console.log("retrived" + json);
        jsonModel.set(JSON.parse(json));
        console.log(jsonModel);
        return jsonModel;
      }
    };
    return App.reqres.setHandler("get:page:json", function() {
      return API.getPageJSON();
    });
  });
});
