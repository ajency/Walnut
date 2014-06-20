var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/media/grid/templates/media.html'], function(App, mediaTpl, layoutTpl) {
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
        if (data.type === 'image') {
          if (data.sizes && data.sizes.thumbnail && data.sizes.thumbnail.url) {
            data.imagePreview = true;
          }
        }
        if (data.type === 'video') {
          data.videoPreview = true;
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
        this.searchMedia = __bind(this.searchMedia, this);
        return GridView.__super__.constructor.apply(this, arguments);
      }

      GridView.prototype.template = '<div class="row b-b b-grey m-b-10"> <div class="btn-group"> <a id="list" class="btn btn-default btn-sm btn-small"> <span class="glyphicon glyphicon-th-list"></span> List </a> <a id="grid" class="btn btn-default btn-sm btn-small"> <span class="glyphicon glyphicon-th"></span> Grid </a> </div> <div class="input-with-icon right pull-right mediaSearch m-b-10"> <i class="fa fa-search"></i> <input type="text" class="form-control" placeholder="Search"> </div> </div> <div class="clearfix"></div> <div class="row"> <div id="placeholder-video-txt" class="text-center m-t-40 m-b-40"><h4 class="semi-bold muted"> Looking for a video? Use the Search box above</h4><h1 class="semi-bold muted"><span class="fa fa-search"></span></h1></div> <div id="selectable-images"></div> </div>';

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

      GridView.prototype.onShow = function() {
        console.log(this.collection);
        if ((this.collection.length > 0) || Marionette.getOption(this, 'mediaType') !== 'video') {
          this.$el.find("#placeholder-video-txt").hide();
        }
        if (Marionette.getOption(this, 'mediaType') === 'video') {
          this.$el.find('#list, #grid').hide();
          this._changeChildClass('List');
        }
        return this.listenTo(this, 'after:item:added', (function(_this) {
          return function(imageView) {
            if (_this.$el.find('.single-img:first').hasClass('col-sm-2')) {
              _this._changeChildClass('Grid');
            } else if (_this.$el.find('.single-img:first').hasClass('listView')) {
              _this._changeChildClass('List');
            }
            _this.$el.closest('.tab-content').siblings('.nav-tabs').find('.all-media-tab').find('a').trigger('click');
            return imageView.$el.find('img').trigger('click');
          };
        })(this));
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
        console.log(e.which);
        p = e.which;
        if (p === 13) {
          searchStr = _.trim($(e.target).val());
          if (searchStr) {
            return this.trigger("search:media", searchStr);
          }
        }
      };

      return GridView;

    })(Marionette.CompositeView);
  });
});
