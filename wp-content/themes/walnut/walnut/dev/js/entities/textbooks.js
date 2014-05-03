var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'unserialize'], function(App, Backbone) {
  return App.module("Entities.Textbooks", function(Textbooks, App, Backbone, Marionette, $, _) {
    var API, textbookCollection;
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
    Textbooks.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Textbooks.ItemModel;

      ItemCollection.prototype.name = 'textbooks';

      ItemCollection.prototype.comparator = 'term_order';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-textbooks';
      };

      ItemCollection.prototype.parse = function(resp) {
        this.total = resp.count;
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    textbookCollection = new Textbooks.ItemCollection;
    API = {
      getTextbooks: function(param) {
        if (param == null) {
          param = {};
        }
        textbookCollection.fetch({
          reset: true,
          data: param
        });
        return textbookCollection;
      },
      getTextBookByID: function(id) {
        var textbook;
        textbook = textbookCollection.get(id);
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          console.log(textbook);
          textbook.fetch();
        }
        return textbook;
      },
      getTextBookNameByID: function(id) {
        var textbook, textbookName;
        textbook = textbookCollection.get(id);
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          textbook.fetch();
        }
        textbookName = textbook.get('name');
        return textbookName;
      },
      getTextbooksFromLocal: function() {
        var onFailure, onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0", [], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var classes, i, result, row, subjects;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              row = data.rows.item(i);
              classes = subjects = '';
              if (row["class_id"] !== '') {
                classes = unserialize(row["class_id"]);
              }
              if (row["tags"] !== '') {
                subjects = unserialize(row["tags"]);
              }
              result[i] = {
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
              i++;
            }
            return d.resolve(result);
          };
        };
        onFailure = function(d) {
          return function(tx, error) {
            return d.reject(error);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getAllTextbooks transaction completed');
        }).fail(function(error) {
          return console.log('ERROR: ' + error.message);
        });
      },
      getTextbooksByIDFromLocal: function(class_id) {
        var deferredErrorHandler, failureHandler, getTextBookIds, onSuccess, runMainQuery;
        getTextBookIds = function() {
          var runQ, success;
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE meta_key='textbooks' AND user_id='1'", [], success(d), deferredErrorHandler(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              var ids;
              ids = unserialize(data.rows.item(0)['meta_value']);
              return d.resolve(ids);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getTextBookIds transaction completed');
          }).fail(failureHandler);
        };
        runMainQuery = function() {
          var ids, textbookIds;
          ids = '';
          textbookIds = getTextBookIds();
          textbookIds.done((function(_this) {
            return function(d) {
              return ids = d;
            };
          })(this));
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              var pattern;
              pattern = '%"' + class_id + '"%';
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt LEFT OUTER JOIN wp_textbook_relationships wtr ON t.term_id=wtr.textbook_id WHERE t.term_id=tt.term_id AND tt.taxonomy='textbook' AND tt.parent=0 AND wtr.class_id LIKE '" + pattern + "' AND wtr.textbook_id IN (" + ids + ")", [], onSuccess(d), deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, p, result, row;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              row = data.rows.item(i);
              p = '%"' + row['textbook_id'] + '"%';
              (function(tx, row, p, i) {
                return tx.executeSql("SELECT count(id) AS count FROM wp_content_collection WHERE term_ids LIKE '" + p + "'", [], function(tx, d) {
                  var classes, subjects;
                  classes = subjects = '';
                  if (row["class_id"] !== '') {
                    classes = unserialize(row["class_id"]);
                  }
                  if (row["tags"] !== '') {
                    subjects = unserialize(row["tags"]);
                  }
                  return result[i] = {
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
                    subjects: subjects,
                    modules_count: d.rows.item(0)['count']
                  };
                }, function(tx, error) {
                  return console.log('ERROR: ' + error.message);
                });
              })(tx, row, p, i);
              i++;
            }
            return d.resolve(result);
          };
        };
        deferredErrorHandler = function(d) {
          return function(tx, error) {
            return d.reject(error);
          };
        };
        failureHandler = function(error) {
          return console.log('ERROR: ' + error.message);
        };
        return $.when(runMainQuery()).done(function(data) {
          return console.log('getTextbooksByID transaction completed');
        }).fail(failureHandler);
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
    App.reqres.setHandler("get:textbooks:local", function() {
      return API.getTextbooksFromLocal();
    });
    return App.reqres.setHandler("get:textbooks:by:id:local", function(class_id) {
      return API.getTextbooksByIDFromLocal(class_id);
    });
  });
});
