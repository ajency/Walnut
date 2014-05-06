var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Users", function(Users, App, Backbone, Marionette, $, _) {
    var API, UserCollection, user;
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
    API = {
      getUsers: function(params) {
        var userCollection;
        if (params == null) {
          params = {};
        }
        userCollection = new UserCollection;
        userCollection.fetch({
          data: params
        });
        return userCollection;
      },
      getUsersFromLocal: function(division) {
        var onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_users u INNER JOIN wp_usermeta um ON u.ID=um.user_id AND um.meta_key='student_division' AND um.meta_value=?", [division], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, result, row;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              row = data.rows.item(i);
              result[i] = {
                ID: row['ID'],
                display_name: row['display_name'],
                user_email: row['user_email'],
                profile_pic: ''
              };
              i++;
            }
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getUsersFromLocal transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:user:model", function() {
      return user;
    });
    App.reqres.setHandler("get:user:collection", function(opts) {
      return API.getUsers(opts);
    });
    return App.reqres.setHandler("get:user:local:by:division", function(division) {
      return API.getUsersFromLocal(division);
    });
  });
});
