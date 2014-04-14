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
      getTextbooksFromLocal: function() {
        var onFailure, onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_terms t, wp_term_taxonomy tt left outer join wp_textbook_relationships wtr on t.term_id=wtr.textbook_id  WHERE t.term_id=tt.term_id and tt.taxonomy='textbook' and tt.parent=0", [], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, result, row;
            console.log('onSuccess!');
            result = [];
            i = 0;
            while (i < data.rows.length) {
              row = data.rows.item(i);
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
                classes: unserialize(row["class_id"]),
                subjects: unserialize(row["tags"])
              };
              i++;
            }
            return d.resolve(result);
          };
        };
        onFailure = function(d) {
          return function(tx, error) {
            return d.reject('OnFailure!: ' + error);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('Database transaction completed');
        }).fail(function(err) {
          return console.log('Error: ' + err);
        });
      }
    };
    App.reqres.setHandler("get:textbooks", function(opt) {
      return API.getTextbooks(opt);
    });
    App.reqres.setHandler("get:textbook:by:id", function(id) {
      return API.getTextBookByID(id);
    });
    return App.reqres.setHandler("get:textbookslocal", function() {
      return API.getTextbooksFromLocal();
    });
  });
});
