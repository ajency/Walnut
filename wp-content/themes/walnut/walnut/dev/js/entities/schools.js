var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  App.module("Entities.Schools", function(Schools, App, Backbone, Marionette, $, _) {
    var API, school, schoolCollection;
    Schools.SchoolModel = (function(_super) {
      __extends(SchoolModel, _super);

      function SchoolModel() {
        return SchoolModel.__super__.constructor.apply(this, arguments);
      }

      SchoolModel.prototype.name = 'schools';

      SchoolModel.prototype.defaults = function() {
        return {
          school_name: '',
          school_logo: ''
        };
      };

      return SchoolModel;

    })(Backbone.Model);
    school = new Schools.SchoolModel;
    Schools.SchoolCollection = (function(_super) {
      __extends(SchoolCollection, _super);

      function SchoolCollection() {
        return SchoolCollection.__super__.constructor.apply(this, arguments);
      }

      SchoolCollection.prototype.model = Schools.SchoolModel;

      SchoolCollection.prototype.comparator = 'id';

      SchoolCollection.prototype.url = function() {
        return AJAXURL + '?action=get-schools';
      };

      return SchoolCollection;

    })(Backbone.Collection);
    schoolCollection = new Schools.SchoolCollection;
    API = {
      getSchools: function(param) {
        if (param == null) {
          param = {};
        }
        schoolCollection.fetch({
          reset: true,
          data: param
        });
        return schoolCollection;
      },
      getCurrentSchool: function() {
        school = new Schools.SchoolModel;
        school.fetch();
        return school;
      }
    };
    App.reqres.setHandler("get:all:schools", function() {
      return API.getSchools();
    });
    App.reqres.setHandler("get:current:school", function() {
      return API.getCurrentSchool();
    });
    return App.reqres.setHandler("get:school:logo", function() {
      return API.getCurrentSchool();
    });
  });
  return App.Entities.Schools;
});
