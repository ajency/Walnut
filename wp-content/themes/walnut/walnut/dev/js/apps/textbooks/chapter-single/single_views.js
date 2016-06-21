var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/chapter-single/templates/chapter-full.html', 'text!apps/textbooks/chapter-single/templates/chapter-description.html', 'text!apps/textbooks/chapter-single/templates/sections-list.html'], function(App, chapterSingleTpl, chapterDescriptionTpl, sectionsListTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    Views.ChapterDescriptionView = (function(superClass) {
      extend(ChapterDescriptionView, superClass);

      function ChapterDescriptionView() {
        return ChapterDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ChapterDescriptionView.prototype.template = chapterDescriptionTpl;

      ChapterDescriptionView.prototype.className = '';

      ChapterDescriptionView.prototype.onShow = function() {
        console.log('Show Model');
        return console.log(this.model);
      };

      return ChapterDescriptionView;

    })(Marionette.ItemView);
    return Views.ChapterSingleLayout = (function(superClass) {
      extend(ChapterSingleLayout, superClass);

      function ChapterSingleLayout() {
        return ChapterSingleLayout.__super__.constructor.apply(this, arguments);
      }

      ChapterSingleLayout.prototype.template = chapterSingleTpl;

      ChapterSingleLayout.prototype.className = 'row';

      ChapterSingleLayout.prototype.regions = {
        chapterDescriptionRegion: '#textbook-description-region',
        chaptersRegion: '#chapters-list-region'
      };

      ChapterSingleLayout.prototype.events = function() {
        return {
          'click .add-section': 'addSection'
        };
      };

      ChapterSingleLayout.prototype.addSection = function() {
        console.log(this.collection);
        this.collection.toAddText = 'true';
        return this.trigger('show:add:textbook:popup', this.collection);
      };

      return ChapterSingleLayout;

    })(Marionette.Layout);
  });
});
