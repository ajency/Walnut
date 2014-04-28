define(["backbone"], function(Backbone) {
  var _sync;
  Backbone.local = function(options, name) {
    var jsonData;
    jsonData = App.request("get:" + name + ":collection");
    return jsonData;
  };
  _.extend(Backbone.Collection.prototype, {
    sync: function(method, collection, options) {
      var collection_name, data;
      collection_name = collection.name;
      console.log('Collection name: ' + collection_name);
      if (collection_name === 'textbooks') {
        if (typeof options.data.class_id === 'undefined') {
          data = App.reqres.request("get:" + collection_name + ":local");
          data.done(function(d) {
            return collection.set(d);
          });
        } else {
          data = App.reqres.request("get:" + collection_name + ":by:id:local", options.data.class_id);
          data.done(function(d) {
            return collection.set(d);
          });
        }
      }
      if (collection_name === 'menu-item') {
        console.log('Menu items local');
      }
      if (collection_name === 'chapter') {
        data = App.reqres.request("get:" + collection_name + ":local", options.data.parent);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'division') {
        data = App.reqres.request("get:" + collection_name + ":local");
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'content-group') {
        data = App.reqres.request("get:" + collection_name + ":by:id:local", options.data.textbook, options.data.division);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      if (collection_name === 'content-piece') {
        data = App.reqres.request("get:" + collection_name + ":local", options.data.ids);
        data.done(function(d) {
          return collection.set(d);
        });
      }
      return true;
    }
  });
  _.extend(Backbone.Model.prototype, {
    sync: function(method, model, options) {
      var allData, attr, data, idAttr, modelname, onlyChanged, params, xhr, _action, _ref, _ref1;
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
      if (_.checkPlatform() === 'Desktop') {
        xhr = options.xhr = Backbone.ajax(_.extend(params, options));
      } else {
        modelname = model.name;
        console.log('Model name: ' + modelname);
        console.log('Model');
        console.log(model);
        if (modelname === 'content-group') {
          attr = model.attributes;
          data = App.reqres.request("save:update:" + modelname + ":local", attr.division, attr.id, 1, attr.training_date, attr.status);
        }
        if (modelname === 'schools') {
          console.log('Schools local');
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
