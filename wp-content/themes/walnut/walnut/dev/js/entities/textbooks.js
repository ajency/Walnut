var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Textbooks", function(Textbooks, App, Backbone, Marionette, $, _) {
    var API;
    Textbooks.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'term_id';

      ItemModel.prototype.defaults = {
        name: '',
        slug: '',
        description: '',
        parent: 0,
        term_order: 0,
        count: 0,
        chapter_count: 0
      };

      ItemModel.prototype.name = 'textbook';

      return ItemModel;

    })(Backbone.Model);
    Textbooks.NameModel = (function(_super) {
      __extends(NameModel, _super);

      function NameModel() {
        return NameModel.__super__.constructor.apply(this, arguments);
      }

      NameModel.prototype.defaults = {
        name: ''
      };

      NameModel.prototype.name = 'textbookName';

      return NameModel;

    })(Backbone.Model);
    Textbooks.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Textbooks.ItemModel;

      ItemCollection.prototype.comparator = 'term_order';

      ItemCollection.prototype.name = 'textbook';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-textbooks';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      ItemCollection.prototype.fetchChaptersOrSections = function(parentID) {
        var chaptersOrSectionsCollection;
        return chaptersOrSectionsCollection = App.request("get:chapters", {
          'parent': parentID
        });
      };

      return ItemCollection;

    })(Backbone.Collection);
    Textbooks.NamesCollection = (function(_super) {
      __extends(NamesCollection, _super);

      function NamesCollection() {
        return NamesCollection.__super__.constructor.apply(this, arguments);
      }

      NamesCollection.prototype.model = Textbooks.NameModel;

      NamesCollection.prototype.comparator = 'term_order';

      NamesCollection.prototype.name = 'textbookName';

      NamesCollection.prototype.url = function() {
        return AJAXURL + '?action=get-textbook-names';
      };

      return NamesCollection;

    })(Backbone.Collection);
    API = {
      getTextbooks: function(param) {
        var textbookCollection;
        if (param == null) {
          param = {};
        }
        textbookCollection = new Textbooks.ItemCollection;
        textbookCollection.fetch({
          reset: true,
          data: param
        });
        return textbookCollection;
      },
      getTextBookByID: function(id) {
        var textbook;
        if (typeof textbookCollection !== "undefined" && textbookCollection !== null) {
          textbook = textbookCollection.get(id);
        }
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          textbook.fetch();
        }
        return textbook;
      },
      getTextBookNameByID: function(id) {
        var textbook, textbookName;
        if (typeof textbookCollection !== "undefined" && textbookCollection !== null) {
          textbook = textbookCollection.get(id);
        }
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          textbook.fetch();
        }
        textbookName = textbook.get('name');
        return textbookName;
      },
      getTextBookNamesByIDs: function(ids) {
        var textbookNamesCollection;
        ids = _.compact(_.flatten(ids));
        textbookNamesCollection = new Textbooks.NamesCollection;
        textbookNamesCollection.fetch({
          reset: true,
          data: {
            term_ids: ids
          }
        });
        return textbookNamesCollection;
      },
      getTextBookByIDFromLocal: function(id) {
        var onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND tt.term_id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var classes, result, row, subjects;
            row = data.rows.item(0);
            classes = subjects = '';
            if (row["class_id"] !== '') {
              classes = unserialize(row["class_id"]);
            }
            if (row["tags"] !== '') {
              subjects = unserialize(row["tags"]);
            }
            result = {
              term_id: row["term_id"],
              name: row["name"],
              slug: row["slug"],
              term_group: row["term_group"],
              term_order: row["term_order"],
              term_taxonomy_id: row["term_taxonomy_id"],
              taxonomy: row["taxonomy"],
              description: row["description"],
              parent: row["parent"],
              count: row["count"],
              classes: classes,
              subjects: subjects
            };
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getTextBookByIDFromLocal transaction completed');
        }).fail(_.failureHandler);
      },
      getTextBookNamesByIDsFromLocal: function(ids) {
        var onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT term_id, name FROM wp_terms WHERE term_id IN (" + ids + ")", [], onSuccess(d), _.deferredErrorHandler(d));
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
                id: r['term_id'],
                name: r['name']
              };
            }
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function() {
          return console.log('getTextBookNamesByIDsFromLocal transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:textbooks", function(opt) {
      return API.getTextbooks(opt);
    });
    App.reqres.setHandler("get:textbook:by:id", function(id) {
      return API.getTextBookByID(id);
    });
    App.reqres.setHandler("get:textbook:name:by:id", function(id) {
      return API.getTextBookNameByID(id);
    });
    App.reqres.setHandler("get:textbook:names:by:ids", function(ids) {
      return API.getTextBookNamesByIDs(ids);
    });
    App.reqres.setHandler("get:textbook:by:id:local", function(id) {
      return API.getTextBookByIDFromLocal(id);
    });
    return App.reqres.setHandler("get:textbookName:by:term_ids:local", function(ids) {
      return API.getTextBookNamesByIDsFromLocal(ids);
    });
  });
});
