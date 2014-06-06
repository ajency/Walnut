var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

define(["marionette", "app"], function(Marionette, App) {
  var AppController;
  return AppController = (function(_super) {
    __extends(AppController, _super);

    function AppController(options) {
      if (options == null) {
        options = {};
      }
      this._instance_id = _.uniqueId("elementcontroller");
      App.commands.execute("register:instance", this, this._instance_id);
      AppController.__super__.constructor.call(this, options);
    }

    AppController.prototype.close = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      delete this.layout;
      delete this.options;
      App.commands.execute("unregister:instance", this, this._instance_id);
      return AppController.__super__.close.call(this, args);
    };

    AppController.prototype.add = function(layout, section) {
      var type;
      this.listenTo(layout, 'close', this.close);
      type = layout.model.get("element");
      if (section.find("li[data-element='" + type + "']").length === 1) {
        section.find("li[data-element='" + type + "']").replaceWith(layout.$el);
      } else {
        section.append(layout.$el);
      }
      section.removeClass('empty-column');
      layout.render();
      layout.triggerMethod('show');
      if (layout.model.get('element') === 'Row') {
        this.layout.addHiddenFields();
      }
      if (!layout.model.isNew() || layout.model.get('element') === 'Row') {
        layout.triggerMethod("before:render:element");
        return this.renderElement();
      }
    };

    return AppController;

  })(Marionette.Controller);
});
