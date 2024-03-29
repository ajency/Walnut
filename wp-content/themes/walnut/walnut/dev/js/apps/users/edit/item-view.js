var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("UsersApp.List.Views", function(Views) {
    return Views.UsersItemView = (function(_super) {
      __extends(UsersItemView, _super);

      function UsersItemView() {
        return UsersItemView.__super__.constructor.apply(this, arguments);
      }

      UsersItemView.prototype.tagName = 'tr';

      UsersItemView.prototype.className = 'gradeX odd';

      UsersItemView.prototype.template = ' <td>{{display_name}}</td> <td>{{user_role}}</td> <td>{{user_email}}</td>';

      UsersItemView.prototype.mixinTemplateHelpers = function(data) {
        data.user_role = _.str.titleize(_.str.humanize(data.role[0]));
        return data;
      };

      return UsersItemView;

    })(Marionette.ItemView);
  });
});
