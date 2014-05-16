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
      this.platform = _.checkPlatform();
      return this.isOnline = _.isOnline();
    };

    AuthenticationController.prototype.authenticate = function() {
      switch (this.platform) {
        case 'Desktop':
          if (this.isOnline) {
            return this.onlineWebAuth();
          } else {
            return this.onConnectionError();
          }
          break;
        case 'Mobile':
          if (this.isOfflineLoginEnabled()) {
            return this.offlineMobileAuth();
          } else {
            if (this.isOnline) {
              return this.onlineMobileAuth();
            } else {
              return this.onConnectionError();
            }
          }
      }
    };

    AuthenticationController.prototype.onlineWebAuth = function() {
      return $.post(this.url, {
        data: this.data
      }, this.success, 'json');
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

    AuthenticationController.prototype.isOfflineLoginEnabled = function() {
      if ($('#offline').is(':checked')) {
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
          var user;
          if (resp.login_details.error) {
            return _this.onErrorResponse(resp.login_details.error);
          } else {
            user = App.request("get:user:model");
            user.set(resp.login_details);
            if (_.getBlogID() === null) {
              return _this.initialAppLogin(resp);
            } else {
              return _this.authenticateUserBlogId(resp);
            }
          }
        };
      })(this), 'json');
    };

    AuthenticationController.prototype.offlineMobileAuth = function() {
      var user;
      user = this.isExistingUser(this.data.txtusername);
      return user.done((function(_this) {
        return function(d) {
          if (d.exists === true) {
            if (d.password === _this.data.txtpassword) {
              user = App.request("get:user:model");
              user.set({
                'ID': d.user_id
              });
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
      var resp;
      resp = server_resp.blog_details;
      _.setBlogID(resp.blog_id);
      _.setBlogName(resp.blog_name);
      _.downloadSchoolLogo("http://aditya.synapsedu.info/wp-content/uploads/sites/3/2014/05/images.jpg");
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
      var user;
      user = this.isExistingUser(this.data.txtusername);
      return user.done((function(_this) {
        return function(d) {
          if (d.exists === true) {
            return _this.updateExistingUser(resp);
          } else {
            return _this.inputNewUser(resp);
          }
        };
      })(this));
    };

    AuthenticationController.prototype.isExistingUser = function(username) {
      var data, onSuccess, runQuery;
      data = {
        user_id: '',
        exists: false,
        password: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM USERS", [], onSuccess(d), _.deferredErrorHandler(d));
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
              data.user_id = r['user_id'];
            }
            i++;
          }
          return d.resolve(data);
        };
      };
      return $.when(runQuery()).done(function(data) {
        return console.log('isExistingUser transaction completed');
      }).fail(_.failureHandler);
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

    App.reqres.setHandler("get:auth:controller", function(options) {
      return new AuthenticationController(options);
    });

    return AuthenticationController;

  })(Marionette.Controller);
});
