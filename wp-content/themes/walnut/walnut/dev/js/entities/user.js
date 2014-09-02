var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Users", function(Users, App, Backbone, Marionette, $, _) {
    var API, OfflineUserCollection, UserCollection, loggedInUser;
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

      UserModel.prototype.current_user_can = function(capability) {
        var all_capabilites;
        all_capabilites = this.get('allcaps');
        if (all_capabilites[capability]) {
          return true;
        } else {
          return false;
        }
      };

      return UserModel;

    })(Backbone.Model);
    loggedInUser = new Users.UserModel;
    if (typeof USER !== "undefined" && USER !== null) {
      loggedInUser.set(USER);
    }
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
    OfflineUserCollection = (function(_super) {
      __extends(OfflineUserCollection, _super);

      function OfflineUserCollection() {
        return OfflineUserCollection.__super__.constructor.apply(this, arguments);
      }

      OfflineUserCollection.prototype.model = Users.UserModel;

      OfflineUserCollection.prototype.name = 'offlineUsers';

      return OfflineUserCollection;

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
      getUserData: function(key) {
        var data;
        data = loggedInUser.get('data');
        console.log(data[key]);
        return data[key];
      },
      getDummyStudents: function() {
        var students, userCollection;
        userCollection = new UserCollection;
        students = [
          {
            ID: 2343424,
            display_name: 'Dummy Student 1',
            user_email: 'dummystudent1@mailinator.com'
          }, {
            ID: 2343434,
            display_name: 'Dummy Student 2',
            user_email: 'dummystudent2@mailinator.com'
          }, {
            ID: 23434234,
            display_name: 'Dummy Student 3',
            user_email: 'dummystudent3@mailinator.com'
          }, {
            ID: 2343423432,
            display_name: 'Dummy Student 4',
            user_email: 'dummystudent4@mailinator.com'
          }, {
            ID: 2343432342,
            display_name: 'Dummy Student 5',
            user_email: 'dummystudent5@mailinator.com'
          }
        ];
        userCollection.set(students);
        return userCollection;
      },
      getOfflineUsers: function() {
        var offlineUsers;
        offlineUsers = new OfflineUserCollection;
        offlineUsers.fetch();
        return offlineUsers;
      }
    };
    App.reqres.setHandler("get:user:model", function() {
      return loggedInUser;
    });
    App.reqres.setHandler("get:loggedin:user:id", function() {
      return loggedInUser.get('ID');
    });
    App.reqres.setHandler("get:user:collection", function(opts) {
      return API.getUsers(opts);
    });
    App.reqres.setHandler("get:user:data", function(key) {
      return API.getUserData(key);
    });
    App.reqres.setHandler("get:dummy:students", function() {
      return API.getDummyStudents();
    });
    return App.reqres.setHandler("get:offline:user:collection", function() {
      return API.getOfflineUsers();
    });
  });
});
