var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'unserialize'], function(App, Backbone) {
  return App.module("Entities.ContentGroup", function(ContentGroup, App, Backbone, Marionette, $, _) {
    var API, contentGroupCollection;
    ContentGroup.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'id';

      ItemModel.prototype.defaults = {
        name: '',
        description: [],
        created_on: '',
        created_by: '',
        last_modified_on: '',
        last_modified_by: '',
        published_on: '',
        published_by: '',
        status: '',
        type: '',
        term_ids: [],
        content_pieces: []
      };

      ItemModel.prototype.name = 'content-group';

      return ItemModel;

    })(Backbone.Model);
    ContentGroup.ItemCollection = (function(_super) {
      __extends(ItemCollection, _super);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = ContentGroup.ItemModel;

      ItemCollection.prototype.name = 'content-group';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-content-groups';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    contentGroupCollection = new ContentGroup.ItemCollection;
    API = {
      getContentGroups: function(param) {
        if (param == null) {
          param = {};
        }
        contentGroupCollection.fetch({
          reset: true,
          data: param
        });
        return contentGroupCollection;
      },
      getContentGroupByID: function(id) {
        var contentGroup;
        contentGroup = contentGroupCollection.get(id);
        if (!contentGroup) {
          contentGroup = new ContentGroup.ItemModel({
            'id': id
          });
          contentGroup.fetch();
        }
        return contentGroup;
      },
      saveContentGroupDetails: function(data) {
        var contentGroupItem;
        contentGroupItem = new ContentGroup.ItemModel(data);
        return contentGroupItem;
      },
      getContentGroupFromLocal: function() {
        var onFailure, onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql('SELECT wcc.id as id, wcc.name as name, wcc.created_on as created_on, wcc.created_by as created_by, wcc.last_modified_on as last_modified_on, wcc.last_modified_by as last_modified_by, wcc.published_on as published_on, wcc.published_by as published_by, wcc.status as status, wcc.type as type, wcc.term_ids as term_ids, wcm.meta_value as description, wcm2.meta_value as content_pieces FROM wp_content_collection wcc INNER JOIN wp_collection_meta wcm ON (wcc.id=wcm.collection_id AND wcm.meta_key=?) INNER JOIN wp_collection_meta wcm2 ON (wcc.id=wcm2.collection_id AND wcm2.meta_key=?) WHERE wcc.id=?', ['description', 'content_pieces', 10], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var content_pieces, description, i, r, result, term_ids;
            console.log('Content group success');
            result = [];
            i = 0;
            while (i < data.rows.length) {
              r = data.rows.item(i);
              term_ids = content_pieces = description = '';
              if (r['term_ids'] !== '') {
                term_ids = unserialize(r['term_ids']);
              }
              if (r['content_pieces'] !== '') {
                content_pieces = unserialize(r['content_pieces']);
              }
              if (r['description'] !== '') {
                description = unserialize(r['description']);
              }
              result = {
                code: 'OK',
                data: {
                  id: r['id'],
                  name: r['name'],
                  created_on: r['created_on'],
                  created_by: r['created_by'],
                  last_modified_on: r['last_modified_on'],
                  last_modified_by: r['last_modified_by'],
                  published_on: r['published_on'],
                  published_by: r['published_by'],
                  status: r['status'],
                  type: r['type'],
                  term_ids: term_ids,
                  content_pieces: content_pieces,
                  description: description
                }
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
          return console.log('Content-group transaction completed');
        }).fail(function(err) {
          return console.log('Error: ' + err);
        });
      }
    };
    App.reqres.setHandler("get:content:groups", function(opt) {
      return API.getContentGroups(opt);
    });
    App.reqres.setHandler("get:content:group:by:id", function(id) {
      return API.getContentGroupByID(id);
    });
    App.reqres.setHandler("save:content:group:details", function(data) {
      return API.saveContentGroupDetails(data);
    });
    return App.reqres.setHandler("get:content-group:local", function() {
      return API.getContentGroupFromLocal();
    });
  });
});
