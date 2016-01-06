var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("BreadcrumbApp.Controller", function(Controller, App) {
    var BreadcrumbView;
    Controller.BreadcrumbController = (function(superClass) {
      extend(BreadcrumbController, superClass);

      function BreadcrumbController() {
        this.renderbreadcrumb = bind(this.renderbreadcrumb, this);
        return BreadcrumbController.__super__.constructor.apply(this, arguments);
      }

      BreadcrumbController.prototype.initialize = function() {
        var breadcrumbItems;
        breadcrumbItems = App.request("get:breadcrumb:model");
        this.listenTo(breadcrumbItems, "change:items", this.renderbreadcrumb);
        return this.renderbreadcrumb();
      };

      BreadcrumbController.prototype.renderbreadcrumb = function() {
        var breadcrumbItems, view;
        breadcrumbItems = App.request("get:breadcrumb:model");
        this.view = view = this._getBreadcrumbView(breadcrumbItems);
        return this.show(view);
      };

      BreadcrumbController.prototype._getBreadcrumbView = function(items) {
        console.log('new breadcrumb view');
        return new BreadcrumbView({
          model: items
        });
      };

      return BreadcrumbController;

    })(RegionController);
    BreadcrumbView = (function(superClass) {
      extend(BreadcrumbView, superClass);

      function BreadcrumbView() {
        return BreadcrumbView.__super__.constructor.apply(this, arguments);
      }

      BreadcrumbView.prototype.template = '{{#items}} <li> <a href="{{link}}" class="{{active}}">{{label}}</a> </li> {{/items}}';

      BreadcrumbView.prototype.tagName = 'ul';

      BreadcrumbView.prototype.className = 'breadcrumb';

      BreadcrumbView.prototype.onShow = function() {
        return this.$el.append('<p></p>');
      };

      return BreadcrumbView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:breadcrumbapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.BreadcrumbController(opt);
    });
  });
});
