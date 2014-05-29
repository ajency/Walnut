var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["marionette", "app", "underscore"], function(Marionette, App, _) {
  var AuthenticationController;
  return AuthenticationController = (function(_super) {
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

    AuthenticationController.prototype.onlineWebAuth = function() {
      return $.post(this.url, {
        data: this.data
      }, this.success, 'json');
    };

    AuthenticationController.prototype.isOfflineLoginEnabled = function() {
      if ($('#offline').is(':checked')) {
        return true;
      } else {
        return false;
      }
    };

    AuthenticationController.prototype.onlineDeviceAuth = function() {
      return $.post(AJAXURL + '?action=get-user-app-profile', {
        data: this.data
      }, (function(_this) {
        return function(resp) {
          console.log('RESP');
          console.log(resp);
          if (resp.error) {
            return _this.onErrorResponse(resp.error);
          } else {
            _this.setUserModel();
            _.setUserID(resp.login_details.ID);
            if (_.getBlogID() === null) {
              return _this.initialAppLogin(resp);
            } else {
              return _this.authenticateUserBlogId(resp);
            }
          }
        };
      })(this), 'json');
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      var offlineUser;
      offlineUser = _.getUserDetails(null, this.data.txtusername);
      return offlineUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            if (user.password === _this.data.txtpassword) {
              _this.setUserModel();
              _.setUserID(user.user_id);
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

    AuthenticationController.prototype.initialAppLogin = function(server_resp) {
      var TimeStampValue, resp;
      resp = server_resp.blog_details;
      _.setDwnlduri(server_resp.exported_csv_url);
      TimeStampValue = server_resp.exported_csv_url;
      _.setDwnldTimeStamp(TimeStampValue);
      _.setBlogID(resp.blog_id);
      _.setBlogName(resp.blog_name);
      _.localDatabaseTransaction(_.db);
      _.downloadSchoolLogo(resp.blog_logo);
      this.firstLoginDownload();
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

    AuthenticationController.prototype.firstLoginDownload = function() {};

    AuthenticationController.prototype.saveUpdateUserDetails = function(resp) {
      var offlineUser;
      offlineUser = _.getUserDetails(null, this.data.txtusername);
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

    App.reqres.setHandler("get:auth:controller", function(options) {
      return new AuthenticationController(options);
    });

    return AuthenticationController;

  })(Marionette.Controller);
});
