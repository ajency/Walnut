var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/textbooks/templates/textbooks.html'], function(App, textbooksTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    return Views.TextbookListLayout = (function(_super) {
      __extends(TextbookListLayout, _super);

      function TextbookListLayout() {
        return TextbookListLayout.__super__.constructor.apply(this, arguments);
      }

      TextbookListLayout.prototype.template = textbooksTpl;

      TextbookListLayout.prototype.className = 'page-content';

      TextbookListLayout.prototype.regions = {
        breadcrumbRegion: '#breadcrumb-region',
        textbooksListRegion: '#textbooks-list-region'
      };

      return TextbookListLayout;

    })(Marionette.Layout);
  });
});
