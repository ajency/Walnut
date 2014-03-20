var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, AppController) {
  return App.module("Media.Selected", function(Selected, App) {
    var EmptyView, SelectedMedia, SelectedSingle;
    Selected.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opt) {
        var collection, view;
        if (opt == null) {
          opt = {};
        }
        this.region = opt.region, collection = opt.collection;
        view = this._getView(collection);
        return this.show(view);
      };

      Controller.prototype._getView = function(collection) {
        return new SelectedMedia({
          collection: collection
        });
      };

      return Controller;

    })(AppController);
    SelectedSingle = (function(_super) {
      __extends(SelectedSingle, _super);

      function SelectedSingle() {
        return SelectedSingle.__super__.constructor.apply(this, arguments);
      }

      SelectedSingle.prototype.template = '';

      SelectedSingle.prototype.className = 'media';

      SelectedSingle.prototype.tagName = 'img';

      SelectedSingle.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        }
      };

      SelectedSingle.prototype.onRender = function() {
        this.$el.width('50px').height('50px');
        return this.$el.attr('src', this.model.get('sizes').thumbnail.url);
      };

      return SelectedSingle;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.className = 'pick-image';

      EmptyView.prototype.template = '<span class="glyphicon glyphicon-hand-left"></span><h4>Select an Image from the library</h4>';

      return EmptyView;

    })(Marionette.ItemView);
    SelectedMedia = (function(_super) {
      __extends(SelectedMedia, _super);

      function SelectedMedia() {
        return SelectedMedia.__super__.constructor.apply(this, arguments);
      }

      SelectedMedia.prototype.className = 'clearfix';

      SelectedMedia.prototype.template = '<div id="selected-images"></div>';

      SelectedMedia.prototype.itemView = SelectedSingle;

      SelectedMedia.prototype.emptyView = EmptyView;

      SelectedMedia.prototype.itemViewContainer = '#selected-images';

      return SelectedMedia;

    })(Marionette.CompositeView);
    Selected.on('initialize:before', function() {});
    return App.commands.setHandler('start:media:selected:app', (function(_this) {
      return function(options) {
        return new Selected.Controller(options);
      };
    })(this));
  });
});
