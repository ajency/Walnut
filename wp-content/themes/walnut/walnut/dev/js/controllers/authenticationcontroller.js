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
      this.data = options.data, this.success = options.success;
      this.platform = _.checkPlatform();
      return this.isOnline = _.isOnline();
    };

    AuthenticationController.prototype.authenticate = function() {
      var response;
      switch (this.platform) {
        case 'Desktop':
          if (this.isOnline) {
            return this.onlineAuth();
          } else {
            response = {
              error: 'Connection could not be established. Please try again.'
            };
            return this.success(response);
          }
          break;
        case 'Mobile':
          if (this.isOfflineLoginEnabled()) {
            return this.offlineMobileAuth();
          } else {
            if (this.isOnline) {
              return this.onlineMobileAuth();
            } else {
              response = {
                error: 'Connection could not be established. Please try again.'
              };
              return this.success(response);
            }
          }
      }
    };

    AuthenticationController.prototype.onlineAuth = function() {
      return $.post(AJAXURL + '?action=get-user-profile', {
        data: this.data
      }, this.success, 'json');
    };

    AuthenticationController.prototype.isOfflineLoginEnabled = function() {
      if ($('#checkbox2').is(':checked')) {
        return true;
      } else {
        return false;
      }
    };

    AuthenticationController.prototype.onlineMobileAuth = function() {
      return $.post(AJAXURL + '?action=get-user-app-profile', {
        data: this.data
      }, (function(_this) {
        return function(resp) {
          var response, user;
          if (resp.error) {
            response = {
              error: resp.error
            };
            return _this.success(response);
          } else {
            response = {
              success: true
            };
            user = _this.isExistingUser(_this.data.txtusername);
            return user.done(function(d) {
              if (d.exists === true) {
                _this.updateExistingUserPassword();
              } else {
                _this.inputNewUser();
              }
              return _this.success(response);
            });
          }
        };
      })(this), 'json');
    };

    AuthenticationController.prototype.offlineMobileAuth = function() {
      var user;
      user = this.isExistingUser(this.data.txtusername);
      return user.done((function(_this) {
        return function(d) {
          var response;
          if (d.exists === true) {
            if (d.password === _this.data.txtpassword) {
              response = {
                success: true
              };
              return _this.success(response);
            } else {
              response = {
                error: 'Invalid Password'
              };
              return _this.success(response);
            }
          } else {
            response = {
              error: 'No such user has previously logged in'
            };
            return _this.success(response);
          }
        };
      })(this));
    };

    AuthenticationController.prototype.isExistingUser = function(username) {
      var data, onFailure, onSuccess, runQuery;
      data = {
        exists: false,
        password: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.userDb.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), onFailure(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, r;
          i = 0;
          while (i < data.rows.length) {
            r = data.rows.item(i);
            if (r['username'] === username) {
              data.exists = true;
              data.password = r['password'];
            }
            i++;
          }
          return d.resolve(data);
        };
      };
      onFailure = function(d) {
        return function(tx, error) {
          return d.reject('ERROR: ' + error);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('isExistingUser transaction completed');
      }).fail(function(error) {
        return console.log('ERROR: ' + error);
      });
    };

    AuthenticationController.prototype.inputNewUser = function() {
      return _.userDb.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql('INSERT INTO USERS (username, password, user_role) VALUES (?, ?, "")', [_this.data.txtusername, _this.data.txtpassword]);
        };
      })(this), function(tx, error) {
        return console.log('ERROR: ' + error);
      }, function(tx) {
        return console.log('Success: Inserted new user');
      });
    };

    AuthenticationController.prototype.updateExistingUserPassword = function() {
      return _.userDb.transaction((function(_this) {
        return function(tx) {
          return tx.executeSql("UPDATE USERS SET password=? where username=?", [_this.data.txtpassword, _this.data.txtusername]);
        };
      })(this), function(tx, error) {
        return console.log('ERROR: ' + error);
      }, function(tx) {
        return console.log('Success: Updated user password');
      });
    };

    App.reqres.setHandler("get:auth:controller", function(options) {
      return new AuthenticationController(options);
    });

    return AuthenticationController;

  })(Marionette.Controller);
});
