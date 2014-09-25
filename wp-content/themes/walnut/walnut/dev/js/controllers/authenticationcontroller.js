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
      this.data = {
        data: this.data
      };
      return $.ajax({
        type: 'POST',
        url: AJAXURL + '?action=get-user-app-profile',
        data: this.data,
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: (function(_this) {
          return function(resp, status, xhr) {
            if (resp.error) {
              return _this.onErrorResponse(resp.error);
            } else {
              return _.each(resp.login_details.roles, function(userRole) {
                var cookie, userDetails;
                if (userRole === "teacher") {
                  return _this.onErrorResponse("Your are not allowed to login");
                } else if (userRole === "student") {
                  cookie = xhr.getResponseHeader('Set-Cookie');
                  _.setUserID(resp.login_details.ID);
                  _this.setUserModelForOnlineLogin(resp);
                  userDetails = {
                    resp: resp,
                    cookie: cookie,
                    userRole: userRole
                  };
                  _this.saveUpdateUserDetails(userDetails);
                  return _this.onSuccessResponse();
                }
              });
            }
          };
        })(this),
        error: (function(_this) {
          return function(err) {
            return _this.onErrorResponse('Could not connect to server');
          };
        })(this)
      });
    };

    AuthenticationController.prototype.setUserModelForOnlineLogin = function(resp) {
      var blog, data, login, user;
      blog = resp.blog_details;
      _.setTblPrefix(blog.blog_id);
      login = resp.login_details;
      user = App.request("get:user:model");
      data = {
        'ID': resp.ID,
        'division': login.data.division,
        'display_name': login.data.username,
        'user_email': login.data.user_email
      };
      user.set({
        'data': data
      });
      return _.createDataTables(_.db);
    };

    AuthenticationController.prototype.saveUpdateUserDetails = function(userDetails) {
      var existingUser;
      existingUser = this.isExistingUser(this.data.data.txtusername);
      return existingUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            return _this.updateExistingUser(userDetails);
          } else {
            return _this.inputNewUser(userDetails);
          }
        };
      })(this));
    };

    AuthenticationController.prototype.inputNewUser = function(userDetails) {
      var blog, cookie, login, userRole;
      login = userDetails.resp.login_details;
      blog = userDetails.resp.blog_details;
      cookie = userDetails.cookie;
      userRole = userDetails.userRole;
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("INSERT INTO USERS (user_id, username, display_name, password , user_capabilities, user_role, cookie, blog_id, user_email, division) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [login.ID, _this.data.data.txtusername, login.data.display_name, _this.data.data.txtpassword, JSON.stringify(login.allcaps), userRole, cookie, blog.blog_id, login.data.user_email, login.data.division]);
        };
      })(this), _.transactionErrorhandler, function(tx) {
        return console.log('SUCCESS: Inserted new user');
      });
    };

    AuthenticationController.prototype.updateExistingUser = function(userDetails) {
      var blog, cookie, login, userRole;
      login = userDetails.resp.login_details;
      blog = userDetails.resp.blog_details;
      cookie = userDetails.cookie;
      userRole = userDetails.userRole;
      return _.db.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE USERS SET username=?, display_name=?, password=? , user_capabilities=?, user_role=?, cookie=?, blog_id=?, user_email=? , division=? WHERE user_id=?", [_this.data.data.txtusername, login.data.display_name, _this.data.data.txtpassword, JSON.stringify(login.allcaps), userRole, cookie, blog.blog_id, login.data.user_email, login.data.division, login.ID]);
        };
      })(this), _.transactionErrorhandler, function(tx) {
        return console.log('SUCCESS: Updated user details');
      });
    };

    AuthenticationController.prototype.offlineDeviceAuth = function() {
      var existingUser;
      existingUser = this.isExistingUser(this.data.txtusername);
      return existingUser.done((function(_this) {
        return function(user) {
          if (user.exists) {
            if (user.password === _this.data.txtpassword) {
              _.setUserID(user.userID);
              _this.setUserModelForOfflineLogin();
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

    AuthenticationController.prototype.setUserModelForOfflineLogin = function() {
      var userDetails;
      userDetails = _.getUserDetails(_.getUserID());
      return userDetails.done((function(_this) {
        return function(userDetails) {
          var data, user;
          _.setTblPrefix(userDetails.blog_id);
          user = App.request("get:user:model");
          data = {
            'ID': userDetails.user_id,
            'division': userDetails.division,
            'display_name': userDetails.username,
            'user_email': userDetails.user_email
          };
          user.set({
            'data': data
          });
          App.vent.trigger("show:dashboard");
          return App.loginRegion.close();
        };
      })(this));
    };

    AuthenticationController.prototype.isExistingUser = function(userName) {
      var onSuccess, runQuery, user;
      user = {
        exists: false,
        userID: '',
        password: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT user_id, password FROM USERS WHERE username=?", [userName], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var row;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            user = {
              exists: true,
              userID: row['user_id'],
              password: row['password']
            };
          }
          return d.resolve(user);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('isExistingUser transaction completed');
      }).fail(_.failureHandler);
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
