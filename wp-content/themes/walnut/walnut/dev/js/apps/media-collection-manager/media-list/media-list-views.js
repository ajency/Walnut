var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module('MediaCollectionManager.MediaList.Views', function(Views) {
    var MediaView, NoMediaView;
    MediaView = (function(_super) {
      __extends(MediaView, _super);

      function MediaView() {
        return MediaView.__super__.constructor.apply(this, arguments);
      }

      MediaView.prototype.tagName = 'div';

      MediaView.prototype.className = 'panel panel-default moveable';

      MediaView.prototype.template = '<div class="panel-heading"> <a class="accordion-toggle"> <div class="aj-imp-image-item row"> <a class="thumbnail col-sm-8"> <div class="imaTitle"><span>{{title_show}}</span></div> </a> <div class="imgactions col-sm-4"> <a class="remove-media" title="Delete Media"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete Image</a> </div> </div> </a> </div>';

      MediaView.prototype.events = {
        'click .remove-media': function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (confirm('Are you sure?')) {
            return this.trigger("remove:media", this.model);
          }
        }
      };

      MediaView.prototype.mixinTemplateHelpers = function(data) {
        data = MediaView.__super__.mixinTemplateHelpers.call(this, data);
        data.title_show = _.prune(data.title, 50);
        return data;
      };

      MediaView.prototype.onRender = function() {
        return this.$el.attr('data-media-id', this.model.get('id'));
      };

      return MediaView;

    })(Marionette.ItemView);
    NoMediaView = (function(_super) {
      __extends(NoMediaView, _super);

      function NoMediaView() {
        return NoMediaView.__super__.constructor.apply(this, arguments);
      }

      NoMediaView.prototype.template = '<div class="alert">No media found. Please add media.</div>';

      return NoMediaView;

    })(Marionette.ItemView);
    return Views.MediaListView = (function(_super) {
      __extends(MediaListView, _super);

      function MediaListView() {
        this.mediaSorted = __bind(this.mediaSorted, this);
        return MediaListView.__super__.constructor.apply(this, arguments);
      }

      MediaListView.prototype.template = '<div class="aj-imp-image-header row"> <div class="col-sm-8"> File Name </div> <div class="col-sm-4"> Actions </div> </div> <div class="panel-group" id="media-accordion"></div>';

      MediaListView.prototype.itemView = MediaView;

      MediaListView.prototype.emptyView = NoMediaView;

      MediaListView.prototype.itemViewContainer = '#media-accordion';

      MediaListView.prototype.onBeforeRender = function() {
        return this.collection.sort();
      };

      MediaListView.prototype.onShow = function() {
        return this.$el.find('#media-accordion').sortable({
          start: function(e, ui) {
            return ui.placeholder.height(ui.item.height());
          },
          update: this.mediaSorted
        });
      };

      MediaListView.prototype.mediaSorted = function(evt, ui) {
        var mediaIds, parsedMediaIds;
        mediaIds = this.$el.find('#media-accordion').sortable('toArray', {
          attribute: 'data-media-id'
        });
        parsedMediaIds = _.map(mediaIds, function(mediaId, index) {
          return parseInt(mediaId);
        });
        return this.trigger("media:order:updated", parsedMediaIds);
      };

      MediaListView.prototype.onClose = function() {
        return this.$el.find('#media-accordion').sortable('destroy');
      };

      return MediaListView;

    })(Marionette.CompositeView);
  });
});
