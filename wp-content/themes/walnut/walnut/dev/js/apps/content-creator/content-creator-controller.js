var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/elementboxapp', 'apps/content-creator/content-builder/app', 'apps/content-creator/property-dock/controller', 'apps/content-creator/options-bar/options-bar-app', 'apps/content-creator/grading-parameter/grading-parameter-controller'], function(App, RegionController) {
  return App.module("ContentCreator.Controller", function(Controller, App) {
    var ContentCreatorLayout;
    Controller.ContentCreatorController = (function(_super) {
      __extends(ContentCreatorController, _super);

      function ContentCreatorController() {
        return ContentCreatorController.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorController.prototype.initialize = function(options) {
        var breadcrumb_items, contentID;
        this.contentType = options.contentType, contentID = options.contentID;
        if (contentID) {
          this.contentPieceModel = App.request("get:page:json", contentID);
        } else {
          this.contentPieceModel = App.request("get:page:json");
        }
        App.execute("when:fetched", this.contentPieceModel, (function(_this) {
          return function() {
            if (!_this.contentPieceModel.get('ID')) {
              return _this.contentPieceModel.set({
                'content_type': _this.contentType
              });
            }
          };
        })(this));
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Content Creator',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.layout = this._getContentCreatorLayout();
        this.eventObj = App.createEventObject();
        this.listenTo(this.layout, 'show', (function(_this) {
          return function() {
            App.execute("show:options:bar", {
              region: _this.layout.optionsBarRegion,
              contentType: _this.contentType,
              contentPieceModel: _this.contentPieceModel
            });
            App.execute("show:element:box", {
              region: _this.layout.elementBoxRegion,
              contentType: _this.contentPieceModel.get('content_type'),
              eventObj: _this.eventObj
            });
            App.execute("show:content:builder", {
              region: _this.layout.contentBuilderRegion,
              contentPieceModel: _this.contentPieceModel,
              eventObj: _this.eventObj
            });
            App.execute("show:property:dock", {
              region: _this.layout.PropertyRegion,
              contentPieceModel: _this.contentPieceModel
            });
            if ((_this.contentPieceModel.get('question_type') != null) && _this.contentPieceModel.get('question_type') === 'multiple_eval') {
              return _this._showGradingParameter();
            }
          };
        })(this));
        this.listenTo(this.layout.optionsBarRegion, 'show:grading:parameter', this._showGradingParameter);
        this.listenTo(this.layout.optionsBarRegion, 'close:grading:parameter', this._closeGradingParameter);
        return App.execute("when:fetched", this.contentPieceModel, (function(_this) {
          return function() {
            return _this.show(_this.layout, {
              loading: true
            });
          };
        })(this));
      };

      ContentCreatorController.prototype._getContentCreatorLayout = function() {
        return new ContentCreatorLayout;
      };

      ContentCreatorController.prototype._showGradingParameter = function() {
        this.layout.contentBuilderRegion.reset();
        return App.execute('show:grading:parameter:view', {
          region: this.layout.gradingParameterRegion,
          contentPieceModel: this.contentPieceModel
        });
      };

      ContentCreatorController.prototype._closeGradingParameter = function() {
        this.layout.gradingParameterRegion.reset();
        return App.execute("show:content:builder", {
          region: this.layout.contentBuilderRegion,
          contentPieceModel: this.contentPieceModel,
          eventObj: this.eventObj
        });
      };

      return ContentCreatorController;

    })(RegionController);
    return ContentCreatorLayout = (function(_super) {
      __extends(ContentCreatorLayout, _super);

      function ContentCreatorLayout() {
        return ContentCreatorLayout.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorLayout.prototype.className = 'content-creator-layout';

      ContentCreatorLayout.prototype.template = '<div id="options-bar-region"></div> <div class="creator"> <div class="tiles" id="toolbox"></div> <div class="" id="content-builder"></div> <div id="grading-parameter"></div> <div class="dock tiles" id="property-dock"></div> </div>';

      ContentCreatorLayout.prototype.regions = {
        elementBoxRegion: '#toolbox',
        contentBuilderRegion: '#content-builder',
        PropertyRegion: '#property-dock',
        optionsBarRegion: '#options-bar-region',
        gradingParameterRegion: '#grading-parameter'
      };

      return ContentCreatorLayout;

    })(Marionette.Layout);
  });
});
