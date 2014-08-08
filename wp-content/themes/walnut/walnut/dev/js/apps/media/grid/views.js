var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/media/grid/templates/media.html', 'text!apps/media/grid/templates/layout-tpl.html'], function(App, mediaTpl, layoutTpl) {
  return App.module('Media.Grid.Views', function(Views, App) {
    var MediaView;
    MediaView = (function(_super) {
      __extends(MediaView, _super);

      function MediaView() {
        return MediaView.__super__.constructor.apply(this, arguments);
      }

      MediaView.prototype.template = mediaTpl;

      MediaView.prototype.className = 'col-sm-2 single-img';

      MediaView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'click': '_whenImageClicked'
      };

      MediaView.prototype.mixinTemplateHelpers = function(data) {
        data = MediaView.__super__.mixinTemplateHelpers.call(this, data);
        data.imagePreview = false;
        data.videoPreview = false;
        data.audioPreview = false;
        if (data.type === 'image') {
          if (data.sizes && data.sizes.thumbnail && data.sizes.thumbnail.url) {
            data.imagePreview = true;
          }
        }
        if (data.type === 'video') {
          data.videoPreview = true;
          data.title_show = _.prune(data.title, 50);
        }
        if (data.type === 'audio') {
          data.audioPreview = true;
          data.title_show = _.prune(data.title, 50);
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
    return Views.GridView = (function(_super) {
      __extends(GridView, _super);

      function GridView() {
        this.onMediaCollectionFetched = __bind(this.onMediaCollectionFetched, this);
        this.searchMedia = __bind(this.searchMedia, this);
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
            _this.$el.closest('.tab-content').siblings('.nav-tabs').find('.all-media-tab').find('a').trigger('click');
            console.log(imageView);
            imageView.$el.find('img').trigger('click');
            return _this.$el.find('#selectable-images').selectSelectableElements(imageView.$el);
          };
        })(this));
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
          }).selectable();
        } else {
          return this.$el.find('#selectable-images').selectable();
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

      return GridView;

    })(Marionette.CompositeView);
  });
});
