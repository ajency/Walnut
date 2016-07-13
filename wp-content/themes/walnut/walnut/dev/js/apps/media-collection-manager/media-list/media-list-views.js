var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app'], function(App) {
  return App.module('MediaCollectionManager.MediaList.Views', function(Views) {
    var MediaView, NoMediaView;
    MediaView = (function(superClass) {
      extend(MediaView, superClass);

      function MediaView() {
        return MediaView.__super__.constructor.apply(this, arguments);
      }

      MediaView.prototype.tagName = 'div';

      MediaView.prototype.className = 'panel panel-default moveable';

      MediaView.prototype.template = '<div class="accordion-toggle"> <div class="aj-imp-image-item row"> <div class="col-sm-8"> <div class="thumbnail m-b-5"> <div class="imaTitle"><span>{{title_show}}</span></div> </div> </div> <div class="col-sm-4"> <div class="imgactions"> <a class="remove-media text-error" title="Delete Media"><span class="glyphicon glyphicon-trash"></span>&nbsp;Delete {{mediaType}}</a> </div> </div> </div> </div>';

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
        data.mediaType = Marionette.getOption(this, 'mediaType');
        return data;
      };

      MediaView.prototype.onRender = function() {
        return this.$el.attr('data-media-id', this.model.get('id'));
      };

      return MediaView;

    })(Marionette.ItemView);
    NoMediaView = (function(superClass) {
      extend(NoMediaView, superClass);

      function NoMediaView() {
        return NoMediaView.__super__.constructor.apply(this, arguments);
      }

      NoMediaView.prototype.template = '<div class="alert">No {{mediaType}} found. Please add {{mediaType}}.</div>';

      NoMediaView.prototype.mixinTemplateHelpers = function(data) {
        data = NoMediaView.__super__.mixinTemplateHelpers.call(this, data);
        data.mediaType = Marionette.getOption(this, 'mediaType');
        return data;
      };

      return NoMediaView;

    })(Marionette.ItemView);
    return Views.MediaListView = (function(superClass) {
      extend(MediaListView, superClass);

      function MediaListView() {
        this.mediaSorted = bind(this.mediaSorted, this);
        return MediaListView.__super__.constructor.apply(this, arguments);
      }

      MediaListView.prototype.template = '<div class="aj-imp-image-header m-b-10 row"> <div class="col-sm-8"> File Name </div> <div class="col-sm-4"> Actions </div> </div> <div class="panel-group" id="media-accordion"></div>';

      MediaListView.prototype.itemView = MediaView;

      MediaListView.prototype.emptyView = NoMediaView;

      MediaListView.prototype.itemViewOptions = function() {
        return {
          mediaType: Marionette.getOption(this, 'mediaType')
        };
      };

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
