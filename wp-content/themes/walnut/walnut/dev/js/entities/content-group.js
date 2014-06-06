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
        total_minutes: 0,
        duration: 0,
        minshrs: 'mins',
        term_ids: [],
        content_pieces: [],
        training_date: ''
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
        if (contentGroupCollection != null) {
          contentGroup = contentGroupCollection.get(id);
        }
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
      newContentGroup: function() {
        var contentGroup;
        return contentGroup = new ContentGroup.ItemModel;
      },
      scheduleContentGroup: function(data) {
        var questionResponseModel;
        questionResponseModel = App.request("save:question:response");
        questionResponseModel.set(data);
        return questionResponseModel.save();
      },
      getContentGroupByIdFromLocal: function(id, division) {
        var onSuccess, runQuery;
        runQuery = function() {
          var pattern;
          pattern = '%"' + id + '"%';
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "'", [], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, result, row, _fn, _i, _ref;
            result = [];
            _fn = function(row, i, division) {
              var contentPiecesAndDescription;
              contentPiecesAndDescription = _.getContentPiecesAndDescription(row['id']);
              return contentPiecesAndDescription.done(function(d) {
                var content_pieces, description;
                content_pieces = description = '';
                if (d.content_pieces !== '') {
                  content_pieces = unserialize(d.content_pieces);
                }
                if (d.description !== '') {
                  description = unserialize(d.description);
                }
                return (function(row, i, content_pieces, description) {
                  var dateAndStatus;
                  dateAndStatus = _.getDateAndStatus(row['id'], division, content_pieces);
                  return dateAndStatus.done(function(d) {
                    var date, status;
                    status = d.status;
                    date = d.start_date;
                    return result[i] = {
                      id: row['id'],
                      name: row['name'],
                      created_on: row['created_on'],
                      created_by: row['created_by'],
                      last_modified_on: row['last_modified_on'],
                      last_modified_by: row['last_modified_by'],
                      published_on: row['published_on'],
                      published_by: row['published_by'],
                      type: row['type'],
                      term_ids: unserialize(row['term_ids']),
                      duration: _.getDuration(row['duration']),
                      minshours: _.getMinsHours(row['duration']),
                      total_minutes: row['duration'],
                      status: status,
                      training_date: date,
                      content_pieces: content_pieces,
                      description: description
                    };
                  });
                })(row, i, content_pieces, description);
              });
            };
            for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
              row = data.rows.item(i);
              _fn(row, i, division);
            }
            return d.resolve(result);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('Content-group-by-id transaction completed');
        }).fail(_.failureHandler);
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
    App.reqres.setHandler("new:content:group", function() {
      return API.newContentGroup();
    });
    App.reqres.setHandler("schedule:content:group", function(data) {
      return API.scheduleContentGroup(data);
    });
    return App.reqres.setHandler("get:content-group:by:id:local", function(id, division) {
      return API.getContentGroupByIdFromLocal(id, division);
    });
  });
});
