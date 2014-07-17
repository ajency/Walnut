define(["backbone"], function(Backbone) {
  var _sync;
  Backbone.local = function(options, name) {
    var jsonData;
    jsonData = App.request("get:" + name + ":collection");
    return jsonData;
  };
  _.extend(Backbone.Collection.prototype, {
    sync: function(method, collection, options) {
      var collection_name, data, opts;
      collection_name = collection.name;
      console.log('Collection name: ' + collection_name);
      opts = options.data;
      if (collection_name === 'textbook') {
        if (typeof opts.class_id !== 'undefined') {
          data = _.getTextbooksByClassIdAndDivision(opts.class_id, opts.division);
          data.done(function(d) {
            console.log('textbook by class id and division data');
            console.log(d);
            return collection.set(d);
          });
        }
      }
      if (collection_name === 'menu-item') {
        data = _.getAppMenuItems();
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'chapter') {
        data = _.getChaptersByParentId(opts.parent);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'division') {
        data = _.getAllDivisions();
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'content-group') {
        data = _.getContentGroupByTextbookIdAndDivision(opts.textbook, opts.division);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'content-piece') {
        data = _.getContentPiecesByIDs(opts.ids);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'user') {
        data = _.getStudentsByDivision(opts.division);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'question-response') {
        data = _.getQuestionResponseByCollectionIdAndDivision(opts.collection_id, opts.division);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'textbookName') {
        data = _.getTextBookNamesByTermIDs(opts.term_ids);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'offlineUsers') {
        data = _.getNamesOfAllOfflineUsers();
        data.done(function(d) {
          return collection.set(d);
        });
      }
      return true;
    }
  });
  _.extend(Backbone.Model.prototype, {
    sync: function(method, model, options) {
      var allData, data, idAttr, modelname, onlyChanged, params, xhr, _action, _ref, _ref1;
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
          data = _.fetchSingleDivision(model.get('id'));
          data.done(function(d) {
            return model.set(d);
          });
        }
        if (modelname === 'textbook') {
          data = _.getTextBookByTextbookId(model.get('term_id'));
          data.done(function(d) {
            return model.set(d);
          });
        }
        if (modelname === 'content-group') {
          data = _.getContentGroupById(model.get('id'));
          data.done(function(d) {
            return model.set(d);
          });
        }
        if (modelname === 'question-response') {
          data = _.saveUpdateQuestionResponse(model);
        }
        if (modelname === 'media') {
          data = _.getMediaById(model.get('id'));
          data.done(function(d) {
            return model.set(d);
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
