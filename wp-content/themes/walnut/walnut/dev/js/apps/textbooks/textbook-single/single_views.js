var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/textbook-single/templates/textbook-full.html', 'text!apps/textbooks/textbook-single/templates/textbook-description.html', 'text!apps/textbooks/textbook-single/templates/chapters-list.html'], function(App, textbookSingleTpl, textbookDescriptionTpl, chapterListTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    Views.TextbookDescriptionView = (function(superClass) {
      extend(TextbookDescriptionView, superClass);

      function TextbookDescriptionView() {
        return TextbookDescriptionView.__super__.constructor.apply(this, arguments);
      }

      TextbookDescriptionView.prototype.template = textbookDescriptionTpl;

      TextbookDescriptionView.prototype.className = '';

      TextbookDescriptionView.prototype.onShow = function() {
        console.log('Show Model');
        return console.log(this.model);
      };

      return TextbookDescriptionView;

    })(Marionette.ItemView);
    return Views.TextbookSingleLayout = (function(superClass) {
      extend(TextbookSingleLayout, superClass);

      function TextbookSingleLayout() {
        return TextbookSingleLayout.__super__.constructor.apply(this, arguments);
      }

      TextbookSingleLayout.prototype.template = textbookSingleTpl;

      TextbookSingleLayout.prototype.className = 'row';

      TextbookSingleLayout.prototype.regions = {
        textbookDescriptionRegion: '#textbook-description-region',
        chaptersRegion: '#chapters-list-region'
      };

      TextbookSingleLayout.prototype.events = function() {
        return {
          'click .add-chapter': 'addChapter'
        };
      };

      TextbookSingleLayout.prototype.addChapter = function() {
        console.log(this.collection);
        this.collection.toAddText = 'true';
        return this.trigger('show:add:textbook:popup', this.collection);
      };

      return TextbookSingleLayout;

    })(Marionette.Layout);
  });
});
