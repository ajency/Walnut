var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/media-collection-manager/media-list/media-list-controller'], function(App, RegionController) {
  return App.module('MediaCollectionManager', function(MediaCollectionManager, App) {
    var OuterLayout;
    MediaCollectionManager.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        if (options == null) {
          options = {};
        }
        this.mediaType = options.mediaType, this.mediaCollection = options.mediaCollection;
        this.layout = this._getLayout();
        this.listenTo(this.layout, "show:add:new:media", (function(_this) {
          return function() {
            App.execute("show:media:manager:app", {
              region: _this.layout.addMediaRegion,
              mediaType: _this.mediaType
            });
            _this.listenTo(App.vent, "media:manager:choosed:media", function(media) {
              _this.mediaCollection.add(media);
              _this.stopListening(App.vent, "media:manager:choosed:media");
              _this.layout.addMediaRegion.close();
              return _this.layout.triggerMethod("show:add:media");
            });
            return _this.listenTo(App.vent, "stop:listening:to:media:manager", function() {
              return _this.stopListening(App.vent, "media:manager:choosed:media");
            });
          };
        })(this));
        this.listenTo(this.layout.mediaListRegion, "show:order:updated:msg", function() {
          this.layout.triggerMethod("show:order:updated:msg");
          return Marionette.triggerMethod.call(this.mediaCollection, 'order:updated');
        });
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            return App.execute('show:media:list', {
              region: _this.layout.mediaListRegion,
              mediaCollection: _this.mediaCollection
            });
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getLayout = function() {
        return new OuterLayout;
      };

      return Controller;

    })(RegionController);
    OuterLayout = (function(_super) {
      __extends(OuterLayout, _super);

      function OuterLayout() {
        return OuterLayout.__super__.constructor.apply(this, arguments);
      }

      OuterLayout.prototype.template = '<div class="row"> <div class="col-sm-7"> <div id="media-list-region"></div> </div> <div class="col-sm-5"> <div id="slides-info"> Click the button to select images to add to your slider. You can change the order of the images by dragging them up or down in the list to the left. </div> <div class="aj-imp-block-button add-new-media"> <button class="btn btn-default btn-hg"><span class="bicon icon-uniF10C"></span>&nbsp;&nbsp;Add Media</button> </div> </div> </div> <div id="add-media-region"></div>';

      OuterLayout.prototype.regions = {
        mediaListRegion: '#media-list-region',
        addMediaRegion: '#add-media-region'
      };

      OuterLayout.prototype.events = {
        'click .add-new-media': function() {
          this.$el.find('.add-new-media').hide();
          return this.trigger("show:add:new:media");
        }
      };

      OuterLayout.prototype.dialogOptions = {
        modal_title: 'Media Collection Manager',
        modal_size: 'wide-modal'
      };

      OuterLayout.prototype.onShowAddMedia = function() {
        return this.$el.find('.add-new-media').show();
      };

      OuterLayout.prototype.onShowOrderUpdatedMsg = function() {
        this.$el.find('.alert').remove();
        return this.$el.prepend("<div class=\"alert alert-success\">Updated successfully</div>");
      };

      return OuterLayout;

    })(Marionette.Layout);
    return App.commands.setHandler('show:media:collection:manager', function(options) {
      return new MediaCollectionManager.Controller(options);
    });
  });
});
