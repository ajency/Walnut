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

      ItemCollection.prototype.name = 'chapter';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-chapters';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    Chapters.SubSectionCollection = (function(_super) {
      __extends(SubSectionCollection, _super);

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
      },
      getChaptersFromLocal: function(parent) {
        var onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=?", [parent], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, r, result, _i, _ref;
            result = [];
            for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
              r = data.rows.item(i);
              result[i] = {
                term_id: r['term_id'],
                name: r['name'],
                slug: r['slug'],
                term_group: r['term_group'],
                term_order: r['term_order'],
                term_taxonomy_id: r['term_taxonomy_id'],
                taxonomy: r['taxonomy'],
                description: r['description'],
                parent: r['parent'],
                count: r['count'],
                thumbnail: '',
                cover_pic: '',
                author: '',
                classes: null,
                subjects: null,
                modules_count: '',
                chapter_count: ''
              };
            }
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function(d) {
          return console.log('getChaptersFromLocal transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:chapters", function(opt) {
      return API.getChapters(opt);
    });
    App.reqres.setHandler("get:chapter:by:id", function(id) {
      return API.getChapterByID(id);
    });
    App.reqres.setHandler("get:subsections:by:chapter:id", function(id) {
      return API.getSubsectionByChapterID(id);
    });
    return App.reqres.setHandler("get:chapter:local", function(parent) {
      return API.getChaptersFromLocal(parent);
    });
  });
});
