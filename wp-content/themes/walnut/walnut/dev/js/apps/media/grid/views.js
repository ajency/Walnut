var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
        data.imagePreview = this.imagePreview = false;
        data.videoPreview = this.videoPreview = false;
        if (data.type === 'image') {
          if (data.sizes && data.sizes.thumbnail && data.sizes.thumbnail.url) {
            data.imagePreview = this.imagePreview = true;
          }
        }
        if (data.type === 'video') {
          data.videoPreview = this.videoPreview = true;
          data.title_excerpt = _.prune(data.title, 15);
        }
        console.log(data);
        return data;
      };

      MediaView.prototype._whenImageClicked = function(e) {
        var media;
        console.log('clicked');
        console.log(e.target);
        media = $(e.target).hasClass('single-img') ? $(e.target) : $(e.target).closest('.single-img');
        this.trigger("media:element:selected");
        return console.log('media selected ' + media);
      };

      return MediaView;

    })(Marionette.ItemView);
    return Views.GridView = (function(_super) {
      __extends(GridView, _super);

      function GridView() {
        return GridView.__super__.constructor.apply(this, arguments);
      }

      GridView.prototype.template = '<div class="row b-b b-grey m-b-10"> <div class="btn-group"> <a id="list" class="btn btn-default btn-sm btn-small"> <span class="glyphicon glyphicon-th-list"></span> List </a> <a id="grid" class="btn btn-default btn-sm btn-small"> <span class="glyphicon glyphicon-th"></span> Grid </a> </div> <div class="input-with-icon right pull-right mediaSearch m-b-10"> <i class="fa fa-search"></i> <input type="text" class="form-control" placeholder="Search"> </div> </div> <div class="clearfix"></div> <div class="row"> <div id="selectable-images"></div> </div>';

      GridView.prototype.itemView = MediaView;

      GridView.prototype.itemViewContainer = '#selectable-images';

      GridView.prototype.onCollectionRendered = function() {
        if (this.multiSelect) {
          return this.$el.find('#selectable-images').bind("mousedown", function(e) {
            return e.metaKey = true;
          }).selectable();
        } else {
          return this.$el.find('#selectable-images').selectable();
        }
      };

      GridView.prototype.onShow = function() {
        this.$el.find('a#list.btn').on('click', _.bind(this._changeChildClass, this, 'List'));
        this.$el.find('a#grid.btn').on('click', _.bind(this._changeChildClass, this, 'Grid'));
        return this.on('after:item:added', (function(_this) {
          return function(imageView) {
            if (_this.$el.find('.single-img:first').hasClass('col-sm-2')) {
              _this._changeChildClass('Grid');
            } else if (_this.$el.find('.single-img:first').hasClass('listView')) {
              _this._changeChildClass('List');
            }
            _this.$el.closest('.tab-content').siblings('.nav-tabs').find('.all-media-tab').find('a').trigger('click');
            imageView.$el.find('img').trigger('click');
            return _this.$el.find('#selectable-images').selectSelectableElements(imageView.$el);
          };
        })(this));
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

      return GridView;

    })(Marionette.CompositeView);
  });
});
