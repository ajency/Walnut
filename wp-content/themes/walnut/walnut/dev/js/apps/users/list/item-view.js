var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module("UsersApp.List.Views", function(Views) {
    return Views.UsersItemView = (function(superClass) {
      extend(UsersItemView, superClass);

      function UsersItemView() {
        return UsersItemView.__super__.constructor.apply(this, arguments);
      }

      UsersItemView.prototype.tagName = 'tr';

      UsersItemView.prototype.className = 'gradeX odd';

      UsersItemView.prototype.template = ' <td>{{display_name}}</td> <td>{{user_email}}</td> <td><a href="#edit-parent/{{ID}}">Edit</a></td>';

      UsersItemView.prototype.mixinTemplateHelpers = function(data) {
        var roles;
        roles = _.flatten(data.role);
        data.user_role = _.str.titleize(_.str.humanize(_.first(roles)));
        return data;
      };

      UsersItemView.prototype.onShow = function() {
        var editedID;
        editedID = Marionette.getOption(this, 'editedID');
        if (this.model.id === parseInt(editedID)) {
          return this.$el.addClass('alert-success');
        }
      };

      return UsersItemView;

    })(Marionette.ItemView);
  });
});
