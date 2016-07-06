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
        return console.log('Show Model');
      };

      ChapterDescriptionView.prototype.options = function() {
        return {
          textbook_id: base_textbook_id,
          base_textbook_name: base_textbook_name,
          base_class: base_classes_applicable
        };
      };

      ChapterDescriptionView.prototype.serializeData = function() {
        var data;
        console.log(Marionette.getOption(this, 'base_textbook_name'));
        data = ChapterDescriptionView.__super__.serializeData.call(this);
        data.base_textbook_name = Marionette.getOption(this, 'base_textbook_name');
        data.textbook_id = Marionette.getOption(this, 'textbook_id');
        data.base_class = Marionette.getOption(this, 'base_class');
        return data;
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
        this.collection.toAddText = 'true';
        return this.trigger('show:add:textbook:popup', this.collection);
      };

      return ChapterSingleLayout;

    })(Marionette.Layout);
  });
});
