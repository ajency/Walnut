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
    return App.reqres.setHandler("get:textbook:names:by:ids", function(ids) {
      return API.getTextBookNamesByIDs(ids);
    });
  });
});
