var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/media-collection-manager/media-list/media-list-controller'], function(App, RegionController) {
  return App.module('MediaCollectionManager', function(MediaCollectionManager, App) {
    var OuterLayout;
    MediaCollectionManager.Controller = (function(superClass) {
      extend(Controller, superClass);

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
              mediaCollection: _this.mediaCollection,
              mediaType: _this.mediaType
            });
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getLayout = function() {
        return new OuterLayout({
          mediaType: this.mediaType
        });
      };

      return Controller;

    })(RegionController);
    OuterLayout = (function(superClass) {
      extend(OuterLayout, superClass);

      function OuterLayout() {
        return OuterLayout.__super__.constructor.apply(this, arguments);
      }

      OuterLayout.prototype.template = '<div class="row"> <div class="col-sm-7 b-r b-grey"> <div id="media-list-region"></div> </div> <div class="col-sm-5"> <div id="slides-info"> Click the button to select {{mediaType}}s to add to your playlist. You can change the order of the {{mediaType}}s by dragging them up or down in the list to the left. </div> </div> </div> <div class="aj-imp-block-button add-new-media pull-right"> <button class="btn btn-default btn-hg"><span class="bicon icon-uniF10C"></span>&nbsp;&nbsp;Add {{mediaType}}</button> </div> <div class="clearfix"></div> <div id="add-media-region"></div>';

      OuterLayout.prototype.mixinTemplateHelpers = function(data) {
        data = OuterLayout.__super__.mixinTemplateHelpers.call(this, data);
        data.mediaType = Marionette.getOption(this, 'mediaType');
        return data;
      };

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
        modal_title: 'Playlist Manager',
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
