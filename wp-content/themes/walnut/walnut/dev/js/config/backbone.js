define(["backbone"], function(Backbone) {
  var _sync;
  Backbone.local = function(options, name) {
    var jsonData;
    jsonData = App.request("get:" + name + ":collection");
    return jsonData;
  };
  _.extend(Backbone.Collection.prototype, {
    sync: function(method, collection, options) {
      var collection_name, opts;
      collection_name = collection.name;
      console.log('Collection name: ' + collection_name);
      opts = options.data;
      if (collection_name === 'textbook') {
        _.cordovaTextbookCollection(opts.class_id, opts.division).done(function(textbooks) {
          console.log('cordovaTextbookCollection done');
          return collection.set(textbooks);
        });
      }
      if (collection_name === 'chapter') {
        _.getChaptersByParentId(opts.parent).done(function(chapters) {
          console.log('getChaptersByParentId done');
          return collection.set(chapters);
        });
      }
      if (collection_name === 'division') {
        _.cordovaDivisionCollection().done(function(divisions) {
          console.log('cordovaDivisionCollection done');
          return collection.set(divisions);
        });
      }
      if (collection_name === 'content-group') {
        _.cordovaContentGroupCollection(opts.textbook, opts.division).done(function(contentGroups) {
          console.log('cordovaContentGroupCollection done');
          return collection.set(contentGroups.reverse());
        });
      }
      if (collection_name === 'content-piece') {
        _.cordovaContentPieceCollection(opts.ids).done(function(contentPieces) {
          console.log('cordovaContentPieceCollection done');
          return collection.set(contentPieces);
        });
      }
      if (collection_name === 'user') {
        _.getStudentsByDivision(opts.division).done(function(students) {
          console.log('getStudentsByDivision done');
          return collection.set(students);
        });
      }
      if (collection_name === 'question-response') {
        _.cordovaQuestionResponseCollection(opts.collection_id, opts.division).done(function(questionResponse) {
          console.log('cordovaQuestionResponseCollection done');
          return collection.set(questionResponse);
        });
      }
      if (collection_name === 'textbookName') {
        _.getTextBookNamesByTermIDs(opts.term_ids).done(function(textbookNames) {
          console.log('getTextBookNamesByTermIDs done');
          return collection.set(textbookNames);
        });
      }
      if (collection_name === 'offlineUsers') {
        _.getNamesOfAllOfflineUsers().done(function(users) {
          console.log('getNamesOfAllOfflineUsers done');
          return collection.set(users);
        });
      }
      if (collection_name === 'media') {
        this.p = _.getListOfMediaByID(opts.ids);
        this.p.done(function(mediaList) {
          console.log('getListOfMediaByID done');
          return collection.set(mediaList);
        });
      }
      return true;
    }
  });
  _.extend(Backbone.Model.prototype, {
    sync: function(method, model, options) {
      var allData, idAttr, modelname, onlyChanged, params, xhr, _action, _ref, _ref1;
      if (!this.name) {
        throw new Error("'name' property not set for the model");
      }
      params = {
        type: "POST",
        dataType: "json",
        data: {}
      };
      params.url = AJAXURL;
      _action = "" + method + "-" + this.name;
      params.data['action'] = _action;
      switch (method) {
        case 'read':
          params.type = 'GET';
          idAttr = model['idAttribute'];
          params.data[idAttr] = model.get(idAttr);
          break;
        case 'create':
          params.data = _.defaults(model.toJSON(), params.data);
          break;
        case 'update':
          onlyChanged = (_ref = options.onlyChanged) != null ? _ref : false;
          if (onlyChanged) {
            if (model.hasChanged()) {
              params.data.changes = {};
              _.each(model.changed, function(property, index) {
                return params.data.changes[property] = this.get(property);
              }, this);
            }
          } else {
            params.data = _.defaults(model.toJSON(), params.data);
          }
          break;
        case 'delete':
          allData = (_ref1 = options.allData) != null ? _ref1 : true;
          if (allData) {
            params.data = _.defaults(model.toJSON(), params.data);
          } else {
            idAttr = model['idAttribute'];
            params.data[idAttr] = model.get(idAttr);
          }
      }
      if (_.platform() === 'BROWSER') {
        xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      } else {
        modelname = model.name;
        console.log('Model name: ' + modelname);
        if (modelname === 'division') {
          xhr = _.fetchSingleDivision(model.get('id')).done(function(division) {
            console.log('fetchSingleDivision done');
            return model.set(division);
          });
        }
        if (modelname === 'textbook') {
          xhr = _.getTextBookByTextbookId(model.get('term_id')).done(function(textbook) {
            console.log('getTextBookByTextbookId done');
            return model.set(textbook);
          });
        }
        if (modelname === 'content-group') {
          xhr = _.getContentGroupById(model.get('id')).done(function(contentGroup) {
            console.log('getContentGroupById done');
            return model.set(contentGroup);
          });
        }
        if (modelname === 'question-response') {
          _.saveUpdateQuestionResponse(model);
        }
        if (modelname === 'media') {
          xhr = _.getMediaById(model.get('id')).done(function(media) {
            console.log('getMediaById done');
            return model.set(media);
          });
        }
      }
      model.trigger("request", model, xhr, options);
      if (method === 'read' || method === 'create') {
        model._fetch = xhr;
      }
      return xhr;
    },
    parse: function(resp) {
      if (resp.code === 'OK') {
        return resp.data;
      }
      return resp;
    }
  });
  _.extend(Backbone.Collection.prototype, {
    parse: function(resp) {
      if (resp.code === 'OK') {
        return resp.data;
      }
      return resp;
    }
  });
  _sync = Backbone.sync;
  return Backbone.sync = function(method, entity, options) {
    var sync;
    if (options == null) {
      options = {};
    }
    sync = _sync(method, entity, options);
    if (!entity._fetch && method === "read" || !entity._fetch && method === "create") {
      entity._fetch = sync;
    }
    return sync;
  };
});
