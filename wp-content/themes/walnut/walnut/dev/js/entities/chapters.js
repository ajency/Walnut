var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Chapters", function(Chapters, App, Backbone, Marionette, $, _) {
    var API;
    Chapters.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

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
    Chapters.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

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
      }
    };
    App.reqres.setHandler("get:chapters", function(opt) {
      return API.getChapters(opt);
    });
    return App.reqres.setHandler("get:chapter:by:id", function(id) {
      return API.getChapterByID(id);
    });
  });
});
