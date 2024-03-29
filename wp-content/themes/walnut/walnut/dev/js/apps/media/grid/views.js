var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/media/grid/templates/media.html', 'text!apps/media/grid/templates/layout-tpl.html'], function(App, mediaTpl, layoutTpl) {
  return App.module('Media.Grid.Views', function(Views, App) {
    var MediaView;
    MediaView = (function(superClass) {
      extend(MediaView, superClass);

      function MediaView() {
        return MediaView.__super__.constructor.apply(this, arguments);
      }

      MediaView.prototype.template = mediaTpl;

      MediaView.prototype.className = 'col-sm-2 single-img';

      MediaView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'click': '_whenImageClicked',
        'click .edit-image': function() {
          return this.trigger('show:image:editor', this.model);
        }
      };

      MediaView.prototype.modelEvents = {
        'change': 'render'
      };

      MediaView.prototype.mixinTemplateHelpers = function(data) {
        data = MediaView.__super__.mixinTemplateHelpers.call(this, data);
        data.imagePreview = false;
        data.videoPreview = false;
        data.audioPreview = false;
        if (data.type === 'image' && data.sizes) {
          if (data.sizes.thumbnail && data.sizes.thumbnail.url) {
            data.imageUrl = data.sizes.thumbnail.url;
          } else if (data.sizes.full && data.sizes.full.url) {
            data.imageUrl = data.sizes.full.url;
          }
        }
        if (data.imageUrl) {
          data.imagePreview = true;
        }
        if (data.type === 'video') {
          data.videoPreview = true;
          data.title_show = _.prune(data.title, 50);
        }
        if (data.type === 'audio') {
          data.audioPreview = true;
          data.title_show = _.prune(data.title, 50);
        }
        if (data.type === 'image') {
          data.title_show = _.prune(data.title, 22);
        }
        return data;
      };

      MediaView.prototype._whenImageClicked = function(e) {
        var media;
        media = $(e.target).hasClass('single-img') ? $(e.target) : $(e.target).closest('.single-img');
        return this.trigger("media:element:selected");
      };

      return MediaView;

    })(Marionette.ItemView);
    return Views.GridView = (function(superClass) {
      extend(GridView, superClass);

      function GridView() {
        this.onMediaCollectionFetched = bind(this.onMediaCollectionFetched, this);
        this.searchMedia = bind(this.searchMedia, this);
        return GridView.__super__.constructor.apply(this, arguments);
      }

      GridView.prototype.template = layoutTpl;

      GridView.prototype.itemView = MediaView;

      GridView.prototype.itemViewContainer = '#selectable-images';

      GridView.prototype.events = {
        'keypress .mediaSearch': 'searchMedia',
        'click a#list.btn': function() {
          return this._changeChildClass('List');
        },
        'click a#grid.btn': function() {
          return this._changeChildClass('Grid');
        }
      };

      GridView.prototype.mixinTemplateHelpers = function(data) {
        data = GridView.__super__.mixinTemplateHelpers.call(this, data);
        data.audio = data.video = false;
        if (Marionette.getOption(this, 'mediaType') === 'video') {
          data.video = true;
        }
        if (Marionette.getOption(this, 'mediaType') === 'audio') {
          data.audio = true;
        }
        return data;
      };

      GridView.prototype.onRender = function() {
        var mediaType;
        this.$el.find('#no-results-div').hide();
        mediaType = Marionette.getOption(this, 'mediaType');
        this.listenTo(this, 'after:item:added', (function(_this) {
          return function(imageView) {
            if (_this.$el.find('.single-img:first').hasClass('col-sm-2')) {
              _this._changeChildClass('Grid');
            } else if (_this.$el.find('.single-img:first').hasClass('listView')) {
              _this._changeChildClass('List');
            }
            return _this.$el.closest('.tab-content').siblings('.nav-tabs').find('.all-media-tab').find('a').trigger('click');
          };
        })(this));
        this.listenTo(this.collection, 'media:uploaded', function(imageModel) {
          var imageView;
          imageView = this.children.findByModel(imageModel);
          imageView.$el.find('img').trigger('click');
          return this.$el.find('#selectable-images').selectSelectableElements(imageView.$el);
        });
        if (!this.collection.isEmpty() || mediaType === 'image') {
          this.$el.find("#placeholder-video-txt").hide();
        }
        if (mediaType === 'video' || mediaType === 'audio') {
          this.$el.find('#list, #grid').hide();
          this._changeChildClass('List');
        }
        if (this.collection.isEmpty() && _.trim(this.collection.filters.searchStr) !== '') {
          this.$el.find("#placeholder-video-txt").hide();
          this.$el.find('#no-results-div').show().html('No media files were found for your search: ' + this.collection.filters.searchStr + '<br>Add a part of the media title in search.');
          return this.collection.filters.searchStr = '';
        }
      };

      GridView.prototype.onCollectionRendered = function() {
        if (this.multiSelect) {
          return this.$el.find('#selectable-images').bind("mousedown", function(e) {
            return e.metaKey = true;
          }).selectable({
            cancel: '.delete-media-img'
          });
        } else {
          return this.$el.find('#selectable-images').selectable({
            cancel: '.delete-media-img'
          });
        }
      };

      GridView.prototype._changeChildClass = function(toType, evt) {
        return this.children.each(_.bind(this._changeClassOfEachChild, this, toType));
      };

      GridView.prototype._changeClassOfEachChild = function(type, child) {
        if (type === 'List') {
          return child.$el.removeClass('col-sm-2').addClass('listView');
        } else if (type === 'Grid') {
          return child.$el.removeClass('listView').addClass('col-sm-2');
        }
      };

      GridView.prototype.searchMedia = function(e) {
        var p, searchStr;
        p = e.which;
        if (p === 13) {
          searchStr = _.trim($(e.target).val());
          if (searchStr) {
            return this.trigger("search:media", searchStr);
          }
        }
      };

      GridView.prototype.onMediaCollectionFetched = function(coll) {
        this.collection = coll;
        return this.render();
      };

      GridView.prototype.onShowEditImage = function(editView) {
        this.$el.find('#show-image').hide();
        this.$el.find('#edit-image-view').html(editView.render().$el).show();
        return editView.triggerMethod('show');
      };

      GridView.prototype.onImageEditingCancelled = function() {
        var self;
        self = this;
        return this.$el.find('#edit-image-view').fadeOut('fast', function() {
          $(this).empty();
          return self.$el.find('#show-image').show();
        });
      };

      return GridView;

    })(Marionette.CompositeView);
  });
});
