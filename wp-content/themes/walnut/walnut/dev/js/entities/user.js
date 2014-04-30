var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Users", function(Users, App, Backbone, Marionette, $, _) {
    var API, UserCollection, user, userCollection;
    Users.UserModel = (function(_super) {
      __extends(UserModel, _super);

      function UserModel() {
        return UserModel.__super__.constructor.apply(this, arguments);
      }

      UserModel.prototype.name = 'user';

      UserModel.prototype.defaults = function() {
        return {
          display_name: '',
          user_email: '',
          role: [],
          profile_pic: ''
        };
      };

      return UserModel;

    })(Backbone.Model);
    user = new Users.UserModel;
    UserCollection = (function(_super) {
      __extends(UserCollection, _super);

      function UserCollection() {
        return UserCollection.__super__.constructor.apply(this, arguments);
      }

      UserCollection.prototype.model = Users.UserModel;

      UserCollection.prototype.name = 'user';

      UserCollection.prototype.url = function() {
        return AJAXURL + '?action=get-users';
      };

      return UserCollection;

    })(Backbone.Collection);
    userCollection = new UserCollection;
    API = {
      getUsers: function(params) {
        if (params == null) {
          params = {};
        }
        userCollection.fetch({
          data: params
        });
        return userCollection;
      }
    };
    App.reqres.setHandler("get:user:model", function() {
      return user;
    });
    return App.reqres.setHandler("get:user:collection", function(opts) {
      return API.getUsers(opts);
    });
  });
});
