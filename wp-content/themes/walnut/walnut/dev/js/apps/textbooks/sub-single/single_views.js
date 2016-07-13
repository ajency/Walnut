var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/sub-single/templates/sub-full.html', 'text!apps/textbooks/sub-single/templates/sub-description.html', 'text!apps/textbooks/sub-single/templates/list.html'], function(App, subSingleTpl, subDescriptionTpl, subsubListTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    Views.SubDescriptionView = (function(superClass) {
      extend(SubDescriptionView, superClass);

      function SubDescriptionView() {
        return SubDescriptionView.__super__.constructor.apply(this, arguments);
      }

      SubDescriptionView.prototype.template = subDescriptionTpl;

      SubDescriptionView.prototype.className = '';

      SubDescriptionView.prototype.onShow = function() {
        console.log('Show Model');
        return console.log(this.model);
      };

      return SubDescriptionView;

    })(Marionette.ItemView);
    return Views.SubSingleLayout = (function(superClass) {
      extend(SubSingleLayout, superClass);

      function SubSingleLayout() {
        return SubSingleLayout.__super__.constructor.apply(this, arguments);
      }

      SubSingleLayout.prototype.template = subSingleTpl;

      SubSingleLayout.prototype.className = 'row';

      SubSingleLayout.prototype.regions = {
        subDescriptionRegion: '#textbook-description-region',
        subRegion: '#chapters-list-region'
      };

      return SubSingleLayout;

    })(Marionette.Layout);
  });
});
