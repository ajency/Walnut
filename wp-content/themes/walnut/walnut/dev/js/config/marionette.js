define(['marionette', 'mustache'], function(Marionette, Mustache) {
  _.extend(Marionette.Application.prototype, {
    navigate: function(route, options) {
      if (options == null) {
        options = {};
      }
      return Backbone.history.navigate(route, options);
    },
    getCurrentRoute: function() {
      var frag;
      frag = Backbone.history.fragment;
      if (_.isEmpty(frag)) {
        return null;
      } else {
        return frag;
      }
    },
    startHistory: function() {
      var AppHandlers, AppHistory, History;
      AppHandlers = Backbone.history.handlers;
      History = Backbone.History.extend({
        loadUrl: function() {
          var match;
          match = Backbone.History.prototype.loadUrl.apply(this, arguments);
          if (!match) {
            this.loadUrl('route-not-found');
          }
          return match;
        }
      });
      AppHistory = new History;
      AppHistory.handlers = AppHandlers;
      return AppHistory.start();
    },
    register: function(instance, id) {
      if (this._registry == null) {
        this._registry = {};
      }
      return this._registry[id] = instance;
    },
    unregister: function(instance, id) {
      return delete this._registry[id];
    },
    resetRegistry: function() {
      var controller, key, msg, oldCount, _ref;
      oldCount = this.getRegistrySize();
      _ref = this._registry;
      for (key in _ref) {
        controller = _ref[key];
        controller.region.close();
      }
      msg = "There were " + oldCount + " controllers in the registry, there are now " + (this.getRegistrySize());
      if (this.getRegistrySize() > 0) {
        return console.warn(msg, this._registry);
      } else {
        return console.log(msg);
      }
    },
    getRegistrySize: function() {
      return _.size(this._registry);
    },
    registerElement: function(instance, id) {
      if (this._elementRegistry == null) {
        this._elementRegistry = {};
      }
      return this._elementRegistry[id] = instance;
    },
    unregisterElement: function(instance, id) {
      return delete this._elementRegistry[id];
    },
    resetElementRegistry: function() {
      var controller, key, msg, oldCount, _ref;
      oldCount = this.getElementRegistrySize();
      _ref = this._elementRegistry;
      for (key in _ref) {
        controller = _ref[key];
        controller.layout.close();
      }
      msg = "There were " + oldCount + " controllers in the registry, there are now " + (this.getElementRegistrySize());
      if (this.getElementRegistrySize() > 0) {
        return console.warn(msg, this._elementRegistry);
      } else {
        return console.log(msg);
      }
    },
    getElementRegistrySize: function() {
      return _.size(this._elementRegistry);
    },
    createEventObject: function() {
      return {
        vent: new Backbone.Wreqr.EventAggregator(),
        command: new Backbone.Wreqr.Commands(),
        reqres: new Backbone.Wreqr.RequestResponse()
      };
    }
  });
  _.extend(Marionette.Region.prototype, {
    hide: function() {
      return this.$el.hide();
    },
    unhide: function() {
      return this.$el.show();
    }
  });
  Marionette.Renderer.render = function(template, data) {
    if (!template) {
      template = '';
    }
    if (typeof template === "function") {
      template = template();
    }
    return Mustache.to_html(template, data);
  };
  return Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
    var err, msg, template;
    template = templateId;
    if (!template || template.length === 0) {
      msg = "Could not find template: '" + templateId + "'";
      err = new Error(msg);
      err.name = "NoTemplateError";
      throw err;
    }
    return template;
  };
});
