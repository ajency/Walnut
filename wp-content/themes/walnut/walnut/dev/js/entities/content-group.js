var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'unserialize'], function(App, Backbone) {
  return App.module("Entities.ContentGroup", function(ContentGroup, App, Backbone, Marionette, $, _) {
    var API, contentGroupCollection;
    ContentGroup.ItemModel = (function(_super) {
      __extends(ItemModel, _super);

      function ItemModel() {
        this.stopModule = __bind(this.stopModule, this);
        this.startModule = __bind(this.startModule, this);
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

      ItemModel.prototype.initialize = function() {
        this.on('start:module', this.startModule, this);
        return this.on('stop:module', this.stopModule, this);
      };

      ItemModel.prototype.startModule = function(model) {
        return this.trigger("training:module:started", model);
      };

      ItemModel.prototype.stopModule = function(model) {
        return this.trigger("training:module:stopped", model);
      };

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
      getContentGroupByIdFromLocal: function(id, division) {
        var getChapterName, getContentPiecesAndDescription, getDateAndStatus, getDuration, getMinsHours, onFailure, onSuccess, runMainQuery;
        getDateAndStatus = function(collection_id, div) {
          var dateAndStatus, failure, runQ, success;
          dateAndStatus = {
            date: '',
            status: ''
          };
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT count(id) AS count, status, date FROM wp_training_logs WHERE collection_id=? AND division_id=? ORDER BY id DESC LIMIT 1", [collection_id, div], success(d), failure(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              if (data.rows.item(0)['count'] !== 0) {
                dateAndStatus.date = data.rows.item(0)['date'];
                dateAndStatus.status = data.rows.item(0)['status'];
              }
              return d.resolve(dateAndStatus);
            };
          };
          failure = function(d) {
            return function(tx, error) {
              return d.reject('Failure: ' + error);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getDateAndStatus transaction completed');
          }).fail(function(err) {
            return console.log('Error: ' + err);
          });
        };
        getContentPiecesAndDescription = function(collection_id) {
          var contentPiecesAndDescription, failure, runQ, success;
          contentPiecesAndDescription = {
            content_pieces: '',
            description: ''
          };
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT * FROM wp_collection_meta WHERE collection_id=?", [collection_id], success(d), failure(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              var i, row;
              i = 0;
              while (i < data.rows.length) {
                row = data.rows.item(i);
                if (row['meta_key'] === 'description') {
                  contentPiecesAndDescription.description = row['meta_value'];
                }
                if (row['meta_key'] === 'content_pieces') {
                  contentPiecesAndDescription.content_pieces = row['meta_value'];
                }
                i++;
              }
              return d.resolve(contentPiecesAndDescription);
            };
          };
          failure = function(d) {
            return function(tx, error) {
              return d.reject('Failure: ' + error);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getContentPiecesAndDescription transaction completed');
          }).fail(function(err) {
            return console.log('Error: ' + err);
          });
        };
        getChapterName = function(term_ids) {
          var failure, runQ, success, temp;
          temp = unserialize(term_ids);
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT name FROM wp_terms WHERE term_id=?", [temp.chapter], success(d), failure(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              var name;
              if (data.rows.length === 0) {
                name = '';
              } else {
                name = data.rows.item(0)['name'];
              }
              return d.resolve(name);
            };
          };
          failure = function(d) {
            return function(tx, error) {
              return d.reject('Failure: ' + error);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getChapterName transaction completed');
          }).fail(function(err) {
            return console.log('Error: ' + err);
          });
        };
        runMainQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              var pattern;
              pattern = '%"' + id + '"%';
              return tx.executeSql("SELECT * FROM wp_content_collection WHERE term_ids LIKE '" + pattern + "'", [], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var i, r, result;
            result = [];
            i = 0;
            while (i < data.rows.length) {
              r = data.rows.item(i);
              (function(r, i, division) {
                var dateAndStatus;
                dateAndStatus = getDateAndStatus(r['id'], division);
                return dateAndStatus.done(function(d) {
                  var date, status;
                  status = d.status;
                  date = d.date;
                  return (function(r, i, date, status) {
                    var contentPiecesAndDescription;
                    contentPiecesAndDescription = getContentPiecesAndDescription(r['id']);
                    return contentPiecesAndDescription.done(function(d) {
                      var content_pieces, description;
                      content_pieces = description = '';
                      if (d.content_pieces !== '') {
                        content_pieces = unserialize(d.content_pieces);
                      }
                      if (d.description !== '') {
                        description = unserialize(d.description);
                      }
                      return (function(r, i, date, status, content_pieces, description) {
                        var chapterName;
                        chapterName = getChapterName(r['term_ids']);
                        return chapterName.done(function(name) {
                          return result[i] = {
                            id: r['id'],
                            name: r['name'],
                            created_on: r['created_on'],
                            created_by: r['created_by'],
                            last_modified_on: r['last_modified_on'],
                            last_modified_by: r['last_modified_by'],
                            published_on: r['published_on'],
                            published_by: r['published_by'],
                            type: r['type'],
                            term_ids: unserialize(r['term_ids']),
                            showChapter: name,
                            duration: getDuration(r['duration']),
                            minshours: getMinsHours(r['duration']),
                            total_minutes: r['duration'],
                            status: status,
                            training_date: date,
                            content_pieces: content_pieces,
                            description: description
                          };
                        });
                      })(r, i, date, status, content_pieces, description);
                    });
                  })(r, i, date, status);
                });
              })(r, i, division);
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
        getDuration = function(duration) {
          if (duration > 60) {
            return duration / 60;
          } else {
            return duration;
          }
        };
        getMinsHours = function(duration) {
          if (duration > 60) {
            return 'hrs';
          } else {
            return 'mins';
          }
        };
        return $.when(runMainQuery()).done(function(data) {
          return console.log('Content-group-by-id transaction completed');
        }).fail(function(err) {
          return console.log('Error: ' + err);
        });
      },
      saveOrUpdateContentGroupLocal: function(division_id, collection_id, teacher_id, training_date, current_status) {
        var d, date, getLastStatus, insertTrainingLogs, lastStatus, updateTrainingLogs;
        getLastStatus = function() {
          var failure, lastStatus, runQ, success;
          lastStatus = {
            id: '',
            status: ''
          };
          runQ = function() {
            return $.Deferred(function(d) {
              return _.db.transaction(function(tx) {
                return tx.executeSql("SELECT id,status FROM wp_training_logs WHERE division_id=? AND collection_id=? ORDER BY id DESC LIMIT 1", [division_id, collection_id], success(d), failure(d));
              });
            });
          };
          success = function(d) {
            return function(tx, data) {
              if (data.rows.length !== 0) {
                lastStatus.id = data.rows.item(0)['id'];
                lastStatus.status = data.rows.item(0)['status'];
              }
              return d.resolve(lastStatus);
            };
          };
          failure = function(d) {
            return function(tx, error) {
              return d.reject('Failure: ' + error);
            };
          };
          return $.when(runQ()).done(function() {
            return console.log('getLastStatus transaction completed');
          }).fail(function(err) {
            return console.log('Error: ' + err);
          });
        };
        insertTrainingLogs = function(date, status) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("INSERT INTO wp_training_logs (division_id, collection_id, teacher_id, date, status) VALUES (?, ?, ?, ?, ?)", [division_id, collection_id, teacher_id, date, status]);
          }, function(tx, err) {
            return console.log('Error: ' + err.message);
          }, function(tx) {
            return console.log('Success: Inserted new record in wp_training_logs');
          });
        };
        updateTrainingLogs = function(id, status) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("UPDATE wp_training_logs SET status=? WHERE id=?", [status, id]);
          }, function(tx, err) {
            return console.log('Error: ' + err.message);
          }, function(tx) {
            return console.log('Success: Updated record in wp_training_logs');
          });
        };
        d = new Date();
        date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        if (current_status === 'completed' || current_status === 'scheduled') {
          if (current_status === 'scheduled') {
            date = training_date;
          }
          return insertTrainingLogs(date, current_status);
        } else {
          lastStatus = getLastStatus();
          return lastStatus.done((function(_this) {
            return function(d) {
              if (d.status !== '') {
                if (d.status === 'started') {
                  insertTrainingLogs(date, 'resumed');
                }
                if (d.status === 'scheduled') {
                  return updateTrainingLogs(d.id, 'started');
                }
              } else {
                return insertTrainingLogs(date, 'started');
              }
            };
          })(this));
        }
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
    App.reqres.setHandler("get:content-group:by:id:local", function(id, division) {
      return API.getContentGroupByIdFromLocal(id, division);
    });
    return App.reqres.setHandler("save:update:content-group:local", function(division_id, collection_id, teacher_id, training_date, status) {
      return API.saveOrUpdateContentGroupLocal(division_id, collection_id, teacher_id, training_date, status);
    });
  });
});
