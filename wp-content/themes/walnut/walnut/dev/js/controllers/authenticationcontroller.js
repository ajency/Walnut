var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore"], function(Marionette, App, _) {
  var AuthenticationController;
  AuthenticationController = (function(_super) {
    __extends(AuthenticationController, _super);

    function AuthenticationController() {
      return AuthenticationController.__super__.constructor.apply(this, arguments);
    }

    AuthenticationController.prototype.initialize = function(options) {
      this.url = options.url, this.data = options.data, this.success = options.success;
      this.platform = _.platform();
      return this.isOnline = _.isOnline();
    };

    AuthenticationController.prototype.authenticate = function() {
      switch (this.platform) {
        case 'BROWSER':
          return this.browserLogin();
        case 'DEVICE':
          return this.deviceLogin();
      }
    };

    AuthenticationController.prototype.browserLogin = function() {
      if (this.isOnline) {
        return this.onlineWebAuth();
      } else {
        return this.onConnectionError();
      }
    };

    AuthenticationController.prototype.onlineWebAuth = function() {
      return $.post(this.url, {
        data: this.data
      }, this.success, 'json');
    };

    AuthenticationController.prototype.deviceLogin = function() {
      if (this.isOfflineLoginEnabled()) {
        return this.offlineDeviceAuth();
      } else {
        if (this.isOnline) {
          return this.onlineDeviceAuth();
        } else {
          return this.onConnectionError();
        }
      }
    };

    AuthenticationController.prototype.isOfflineLoginEnabled = function() {
      if ($('#onOffSwitch').is(':checked')) {
        return false;
      } else {
        return true;
      }
    };

    AuthenticationController.prototype.onlineDeviceAuth = function() {
      return $.post(AJAXURL + '?action=get-user-app-profile', {
        data: this.data
      }, (function(_this) {
        return function(resp) {
          if (resp.error) {
            return _this.onErrorResponse(resp.error);
          } else {
            return _this.onlineDeviceAuthSuccess(resp);
          }
        };
      })(this), 'json').fail((function(_this) {
        return function() {
          return _this.onErrorResponse('Could not connect to server');
        };
      })(this));
    };

    AuthenticationController.prototype.onlineDeviceAuthSuccess = function(resp) {
      var user_role;
      user_role = resp.blog_details.blog_roles[0];
      if (user_role === 'teacher') {
        this.setUserDetails(resp.login_details.ID, this.data.txtusername);
        if (_.isNull(_.getBlogID())) {
          return this.initialAppLogin(resp);
        } else {
          return this.authenticateUserBlogId(resp);
        }
      } else if (user_role === 'student') {
        return this.onErrorResponse('Sorry this is not a valid teacher login. If you are a student please download Student training app from Google Playstore.');
      }
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      return _.getUserDetails(this.data.txtusername).done((function(_this) {
        return function(user) {
          if (user.exists) {
            if (user.password === _this.data.txtpassword) {
              _this.setUserDetails(user.user_id, _this.data.txtusername);
              return _this.onSuccessResponse();
            } else {
              return _this.onErrorResponse('Invalid Password');
            }
          } else {
            return _this.onErrorResponse('No such user has previously logged in');
          }
        };
      })(this));
    };

    AuthenticationController.prototype.setUserDetails = function(id, username) {
      var userModel;
      _.setUserID(id);
      _.setUserName(username);
      userModel = App.request("get:user:model");
      return userModel.set({
        'ID': '' + _.getUserID()
      });
    };

    AuthenticationController.prototype.initialAppLogin = function(server_resp) {
      var resp;
      resp = server_resp.blog_details;
      _.setBlogID(resp.blog_id);
      _.setBlogName(resp.blog_name);
      _.createDataTables(_.db);
      _.downloadSchoolLogo(resp.blog_logo);
      this.saveUpdateUserDetails(server_resp);
      return this.onSuccessResponse();
    };

    AuthenticationController.prototype.authenticateUserBlogId = function(server_resp) {
      var resp;
      resp = server_resp.blog_details;
      if (resp.blog_id !== _.getBlogID()) {
        return this.onErrorResponse('The app is configured for school ' + _.getBlogName());
      } else {
        this.saveUpdateUserDetails(server_resp);
        return this.onSuccessResponse();
      }
    };

    AuthenticationController.prototype.saveUpdateUserDetails = function(resp) {
      return _.getUserDetails(this.data.txtusername).done((function(_this) {
        return function(user) {
          if (user.exists) {
            return _this.updateExistingUser(resp);
          } else {
            return _this.inputNewUser(resp);
          }
        };
      })(this));
    };

    AuthenticationController.prototype.inputNewUser = function(response) {
      var resp;
      resp = response.login_details;
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES (?, ?, ?, ?)', [resp.ID, _this.data.txtusername, _this.data.txtpassword, resp.roles[0]]);
        };
      })(this), _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: Inserted new user');
      });
    };

    AuthenticationController.prototype.updateExistingUser = function(response) {
      var resp;
      resp = response.login_details;
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", [_this.data.txtusername, _this.data.txtpassword, resp.ID]);
        };
      })(this), _.transactionErrorHandler, function(tx) {
        return console.log('SUCCESS: Updated user details');
      });
    };

    AuthenticationController.prototype.onConnectionError = function() {
      var response;
      response = {
        error: 'Connection could not be established. Please try again.'
      };
      return this.success(response);
    };

    AuthenticationController.prototype.onSuccessResponse = function() {
      var response;
      response = {
        success: true
      };
      return this.success(response);
    };

    AuthenticationController.prototype.onErrorResponse = function(msg) {
      var response;
      response = {
        error: '' + msg
      };
      return this.success(response);
    };

    return AuthenticationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:auth:controller", function(options) {
    return new AuthenticationController(options);
  });
});
