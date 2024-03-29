var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Chapters", function(Chapters, App, Backbone, Marionette, $, _) {
    var API;
    Chapters.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'chapter_id';

      ItemModel.prototype.defaults = {
        name: '',
        slug: '',
        description: '',
        parent: 0,
        term_order: 0
      };

      ItemModel.prototype.name = 'chapter';

      return ItemModel;

    })(Backbone.Model);
    Chapters.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Chapters.ItemModel;

      ItemCollection.prototype.comparator = 'term_order';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-chapters';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    Chapters.SubSectionCollection = (function(superClass) {
      extend(SubSectionCollection, superClass);

      function SubSectionCollection() {
        return SubSectionCollection.__super__.constructor.apply(this, arguments);
      }

      SubSectionCollection.prototype.model = Chapters.ItemModel;

      SubSectionCollection.prototype.comparator = 'term_order';

      SubSectionCollection.prototype.url = function() {
        return AJAXURL + '?action=get-chapter-subsections';
      };

      SubSectionCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return SubSectionCollection;

    })(Backbone.Collection);
    API = {
      getChapters: function(param) {
        var chapterCollection;
        if (param == null) {
          param = {};
        }
        chapterCollection = new Chapters.ItemCollection;
        chapterCollection.fetch({
          reset: true,
          data: param
        });
        return chapterCollection;
      },
      getChapterByID: function(id) {
        var chapter;
        chapter = chapterCollection.get(id);
        if (!chapter) {
          chapter = new Chapters.ItemModel({
            term_id: id
          });
          console.log(chapter);
          chapter.fetch();
        }
        return chapter;
      },
      getSubsectionByChapterID: function(param) {
        var subSectionsCollection;
        if (param == null) {
          param = {};
        }
        subSectionsCollection = new Chapters.SubSectionCollection;
        subSectionsCollection.fetch({
          reset: true,
          data: param
        });
        return subSectionsCollection;
      }
    };
    App.reqres.setHandler("get:chapters", function(opt) {
      return API.getChapters(opt);
    });
    App.reqres.setHandler("get:chapter:by:id", function(id) {
      return API.getChapterByID(id);
    });
    return App.reqres.setHandler("get:subsections:by:chapter:id", function(id) {
      return API.getSubsectionByChapterID(id);
    });
  });
});
