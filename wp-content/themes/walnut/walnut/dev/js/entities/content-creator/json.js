var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.BuilderJSON", function(BuilderJSON, App, Backbone, Marionette, $, _) {
    var API, PageJson;
    PageJson = (function(superClass) {
      extend(PageJson, superClass);

      function PageJson() {
        return PageJson.__super__.constructor.apply(this, arguments);
      }

      PageJson.prototype.idAttribute = 'ID';

      PageJson.prototype.defaults = {
        'post_status': 'pending'
      };

      PageJson.prototype.name = 'content-piece';

      PageJson.prototype.layout = '';

      return PageJson;

    })(Backbone.Model);
    API = {
      getPageJSON: function(id) {
        var jsonModel;
        if (id == null) {
          id = '';
        }
        if (!id) {
          jsonModel = new PageJson;
        } else {
          jsonModel = new PageJson({
            ID: parseInt(id)
          });
          jsonModel.fetch();
        }
        return jsonModel;
      }
    };
    return App.reqres.setHandler("get:page:json", function(id) {
      return API.getPageJSON(id);
    });
  });
});
