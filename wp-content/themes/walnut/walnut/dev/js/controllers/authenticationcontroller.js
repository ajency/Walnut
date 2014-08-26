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
      var url;
      this.data = {
        data: this.data
      };
      url = AJAXURL + '?action=get-user-app-profile';
      return $.ajax({
        type: 'POST',
        url: url,
        data: this.data,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        beforeSend: function(xhr) {
          if (!_.isNull(_.getCookiesValue())) {
            if (_.getCookiesValue() !== 'null') {
              console.log(_.getCookiesValue());
              return xhr.setRequestHeader('Set-Cookie', _.getCookiesValue());
            }
          }
        },
        success: (function(_this) {
          return function(resp, status, jqXHR) {
            var store_cookies, userRole;
            console.log('Login Response');
            console.log(JSON.stringify(resp));
            if (resp.error) {
              return _this.onErrorResponse(resp.error);
            } else {
              userRole = resp.login_details.roles[0];
              if (userRole === "teacher") {
                return _this.onErrorResponse("Your are not allowed to login");
              } else if (userRole === "student") {
                store_cookies = jqXHR.getResponseHeader('Set-Cookie');
                console.log(store_cookies);
                _.setCookiesValue(store_cookies);
                _.setBlogID(8);
                _.setSyncRequestId(1);
                _this.setUserDetails(resp.login_details.ID, _this.data.data.txtusername);
                _.setUserCapabilities(resp.login_details.allcaps);
                _.setStudentDivision(resp.login_details.data.division);
                _.createDataTables(_.db);
                _this.saveUpdateUserDetails(resp);
                return _this.onSuccessResponse();
              }
            }
          };
        })(this),
        error: (function(_this) {
          return function(jqXHR, err) {
            return _this.onErrorResponse('Could not connect to server');
          };
        })(this)
      });
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      var offlineUser;
      console.log(this.data.data.txtusername);
      offlineUser = _.getUserDetails(this.data.data.txtusername);
      return offlineUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            if (user.password === data.data.txtpassword) {
              _this.setUserDetails(user.user_id, _this.data.data.txtusername);
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
      _.setUserID(id);
      _.setUserName(username);
      return _.setUserModel();
    };

    AuthenticationController.prototype.saveUpdateUserDetails = function(resp) {
      var offlineUser;
      offlineUser = _.getUserDetails(this.data.data.txtusername);
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
          return tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role) VALUES (?, ?, ?, ?)', [resp.ID, _this.data.data.txtusername, data.data.txtpassword, resp.roles[0]]);
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
          return tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", [_this.data.data.txtusername, data.data.txtpassword, resp.ID]);
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

    return AuthenticationController;

  })(Marionette.Controller);
  return App.reqres.setHandler("get:auth:controller", function(options) {
    return new AuthenticationController(options);
  });
});
