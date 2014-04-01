var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Textbooks", function(Textbooks, App, Backbone, Marionette, $, _) {
    var API, db, textbookCollection;
    db = Backbone.db;
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
        console.log(param);
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
        var data;
        console.log('Database');
        var fetchData = db.transaction(function(tx){
			 			
						},
						function(tx,err){
							console.log("Error processing SQL: "+err);
						},
						function(tx){
							
						}
					);
        return data = [
          {
            "term_id": 32,
            "name": "Art",
            "slug": "art",
            "term_group": "0",
            "term_order": "0",
            "term_taxonomy_id": "32",
            "taxonomy": "textbook",
            "description": "",
            "parent": "0",
            "count": "0",
            "cover_pic": "",
            "author": "",
            "classes": null,
            "subjects": null,
            "chapter_count": 0
          }, {
            "term_id": 33,
            "name": "English",
            "slug": "english",
            "term_group": "0",
            "term_order": "0",
            "term_taxonomy_id": "32",
            "taxonomy": "textbook",
            "description": "",
            "parent": "0",
            "count": "0",
            "cover_pic": "",
            "author": "",
            "classes": null,
            "subjects": null,
            "chapter_count": 0
          }
        ];
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
