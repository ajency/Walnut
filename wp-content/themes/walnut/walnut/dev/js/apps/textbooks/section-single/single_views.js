var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/textbooks/section-single/templates/section-full.html', 'text!apps/textbooks/section-single/templates/section-description.html', 'text!apps/textbooks/section-single/templates/sub-list.html'], function(App, sectionSingleTpl, sectionDescriptionTpl, subListTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    Views.SectionDescriptionView = (function(superClass) {
      extend(SectionDescriptionView, superClass);

      function SectionDescriptionView() {
        return SectionDescriptionView.__super__.constructor.apply(this, arguments);
      }

      SectionDescriptionView.prototype.template = sectionDescriptionTpl;

      SectionDescriptionView.prototype.className = '';

      SectionDescriptionView.prototype.onShow = function() {
        console.log('Show Model');
        return console.log(this.model);
      };

      SectionDescriptionView.prototype.options = function() {
        return {
          textbook_id: base_textbook_id,
          base_textbook_name: base_textbook_name,
          base_class: base_classes_applicable,
          base_chapter_name: base_chapter_name,
          base_chapter_id: base_chapter_id
        };
      };

      SectionDescriptionView.prototype.serializeData = function() {
        var data;
        console.log(Marionette.getOption(this, 'base_textbook_name'));
        data = SectionDescriptionView.__super__.serializeData.call(this);
        data.base_textbook_name = Marionette.getOption(this, 'base_textbook_name');
        data.textbook_id = Marionette.getOption(this, 'textbook_id');
        data.base_class = Marionette.getOption(this, 'base_class');
        data.base_chapter_name = Marionette.getOption(this, 'base_chapter_name');
        data.base_chapter_id = Marionette.getOption(this, 'base_chapter_id');
        console.log(data);
        return data;
      };

      return SectionDescriptionView;

    })(Marionette.ItemView);
    return Views.SectionSingleLayout = (function(superClass) {
      extend(SectionSingleLayout, superClass);

      function SectionSingleLayout() {
        return SectionSingleLayout.__super__.constructor.apply(this, arguments);
      }

      SectionSingleLayout.prototype.template = sectionSingleTpl;

      SectionSingleLayout.prototype.className = 'row';

      SectionSingleLayout.prototype.regions = {
        sectionDescriptionRegion: '#textbook-description-region',
        sectionRegion: '#chapters-list-region'
      };

      SectionSingleLayout.prototype.events = function() {
        return {
          'click .add-sub': 'addSub'
        };
      };

      SectionSingleLayout.prototype.addSub = function() {
        console.log(this.collection);
        this.collection.toAddText = 'true';
        return this.trigger('show:add:textbook:popup', this.collection);
      };

      return SectionSingleLayout;

    })(Marionette.Layout);
  });
});
