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
          console.log('Login Response');
          console.log(resp);
          if (resp.error) {
            return _this.onErrorResponse(resp.error);
          } else {
            _this.onDeviceLoginSuccessOperation(resp.login_details.ID, _this.data.txtusername);
            _.createDataTables(_.db);
            _this.saveUpdateUserDetails(server_resp);
            return _this.onSuccessResponse();
          }
        };
      })(this), 'json').fail((function(_this) {
        return function() {
          return _this.onErrorResponse('Could not connect to server');
        };
      })(this));
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      var offlineUser;
      offlineUser = _.getUserDetails(this.data.txtusername);
      return offlineUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            if (user.password === _this.data.txtpassword) {
              _this.onDeviceLoginSuccessOperation(user.user_id, _this.data.txtusername);
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

    AuthenticationController.prototype.onDeviceLoginSuccessOperation = function(id, username) {
      this.setUserModel();
      _.setUserID(id);
      return _.setUserName(username);
    };

    AuthenticationController.prototype.saveUpdateUserDetails = function(resp) {
      var offlineUser;
      offlineUser = _.getUserDetails(this.data.txtusername);
      return offlineUser.done((function(_this) {
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
      })(this), _.transactionErrorhandler, function(tx) {
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
      })(this), _.transactionErrorhandler, function(tx) {
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

    AuthenticationController.prototype.setUserModel = function() {
      var user;
      user = App.request("get:user:model");
      return user.set({
        'ID': '' + _.getUserID()
      });
    };

    return AuthenticationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:auth:controller", function(options) {
    return new AuthenticationController(options);
  });
});
