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
                _this.setUserDetails(resp.login_details.ID, _this.data.data.txtusername, resp.blog_details.blog_id);
                _.setUserCapabilities(resp.login_details.allcaps);
                _.setStudentDivision(resp.login_details.data.division);
                _.createDataTables(_.db);
                _this.saveUpdateUserDetails(resp, jqXHR);
                return _this.onSuccessResponse();
              }
            }
          };
        })(this),
        error: (function(_this) {
          return function(jqXHR, err) {
            console.log(jqXHR);
            console.log(err);
            return _this.onErrorResponse('Could not connect to server');
          };
        })(this)
      });
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      var offlineUser;
      console.log("offline");
      console.log(this.data.txtusername);
      offlineUser = _.getUserDetails(this.data.txtusername);
      return offlineUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            console.log(_this.data.txtpassword);
            if (user.password === _this.data.txtpassword) {
              _this.setUserDetails(user.user_id, _this.data.txtusername, user.blog_id);
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

    AuthenticationController.prototype.setUserDetails = function(id, username, blog_id) {
      _.setUserID(id);
      _.setUserName(username);
      _.setBlogID(blog_id);
      return _.setUserModel();
    };

    AuthenticationController.prototype.saveUpdateUserDetails = function(resp, jqXHR) {
      var offlineUser;
      console.log("save");
      offlineUser = _.getUserDetails(this.data.data.txtusername);
      return offlineUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            return _this.updateExistingUser(resp, jqXHR);
          } else {
            return _this.inputNewUser(resp, jqXHR);
          }
        };
      })(this));
    };

    AuthenticationController.prototype.inputNewUser = function(response, jqXHR) {
      var cookie, resp;
      resp = response.login_details;
      cookie = jqXHR.getResponseHeader('Set-Cookie');
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql('INSERT INTO USERS (user_id, username, password, user_role, session_id, blog_id) VALUES (?, ?, ?, ?, ?, ?)', [resp.ID, _this.data.data.txtusername, _this.data.data.txtpassword, resp.roles[0], cookie, response.blog_details.blog_id]);
        };
      })(this), _.transactionErrorhandler, function(tx) {
        return console.log('SUCCESS: Inserted new user');
      });
    };

    AuthenticationController.prototype.updateExistingUser = function(response, jqXHR) {
      var resp;
      resp = response.login_details;
      console.log(resp);
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE USERS SET username=?, password=? where user_id=?", [_this.data.data.txtusername, _this.data.data.txtpassword, resp.ID, response.blog_details.blog_id]);
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
