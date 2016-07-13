var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/users/edit/templates/add-user.html'], function(App, addUserTpl) {
  return App.module("UsersApp.Edit.Views", function(Views) {
    return Views.EditUser = (function(superClass) {
      extend(EditUser, superClass);

      function EditUser() {
        this.errorFn = bind(this.errorFn, this);
        this.successFn = bind(this.successFn, this);
        return EditUser.__super__.constructor.apply(this, arguments);
      }

      EditUser.prototype.className = 'grid simple vertical green animated fadeIn';

      EditUser.prototype.template = addUserTpl;

      EditUser.prototype.events = function() {
        return {
          'click #save-user': 'save_user'
        };
      };

      EditUser.prototype.onShow = function() {
        return Backbone.Syphon.deserialize(this, this.model.toJSON());
      };

      EditUser.prototype.save_user = function(e) {
        var data;
        this.$el.find('#saved-success').html('').removeClass('alert alert-danger');
        e.preventDefault();
        if (this.$el.find('form').valid()) {
          this.$el.find('#save-user i').addClass('fa-spin fa-spinner');
          data = Backbone.Syphon.serialize(this);
          data.user_role = 'parent';
          return this.model.save(data, {
            wait: true,
            success: this.successFn,
            error: this.errorFn
          });
        }
      };

      EditUser.prototype.successFn = function(model, resp) {
        this.$el.find('#save-user i').removeClass('fa-spin fa-spinner');
        if (resp.code === 'OK') {
          return App.navigate("#/parents/edited/" + this.model.id);
        } else {
          return this.$el.find('#saved-success').addClass('alert alert-danger').html(resp.message);
        }
      };

      EditUser.prototype.errorFn = function(resp) {
        return this.$el.find('#save-user i').removeClass('fa-spin fa-spinner');
      };

      return EditUser;

    })(Marionette.ItemView);
  });
});
