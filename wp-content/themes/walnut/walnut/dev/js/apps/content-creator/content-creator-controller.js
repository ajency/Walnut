var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/element-box/elementboxapp', 'apps/content-creator/content-builder/app', 'apps/content-creator/property-dock/controller', 'apps/content-creator/options-bar/options-bar-app', 'apps/content-creator/content-pieces-listing/app', 'apps/content-creator/grading-parameter/grading-parameter-controller'], function(App, RegionController) {
  return App.module("ContentCreator.Controller", function(Controller, App) {
    var CannotEditView, ContentCreatorLayout;
    Controller.ContentCreatorController = (function(superClass) {
      extend(ContentCreatorController, superClass);

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
            if (!_this.contentPieceModel.isNew()) {
              App.execute("show:content:creator:pieces:listing", {
                region: _this.layout.contentPiecesListRegion,
                contentPieceModel: _this.contentPieceModel
              });
            }
            return _this._showViews();
          };
        })(this));
        this.listenTo(this.layout.optionsBarRegion, 'show:grading:parameter', this._showGradingParameter);
        this.listenTo(this.layout.optionsBarRegion, 'close:grading:parameter', this._closeGradingParameter);
        this.listenTo(this.layout.contentPiecesListRegion, 'change:content:piece', (function(_this) {
          return function(nextID) {
            return _this.layout.optionsBarRegion.trigger("change:content:piece", nextID);
          };
        })(this));
        return App.execute("when:fetched", this.contentPieceModel, (function(_this) {
          return function() {
            var present_in, view;
            present_in = _this.contentPieceModel.get('present_in_modules');
            if (!_.isEmpty(present_in)) {
              view = new CannotEditView({
                model: _this.contentPieceModel
              });
              return _this.show(view);
            } else {
              return _this.show(_this.layout, {
                loading: true
              });
            }
          };
        })(this));
      };

      ContentCreatorController.prototype._getContentCreatorLayout = function() {
        return new ContentCreatorLayout({
          model: this.contentPieceModel
        });
      };

      ContentCreatorController.prototype._showGradingParameter = function() {
        $(this.layout.contentBuilderRegion.el).find('#myCanvas').hide();
        return App.execute('show:grading:parameter:view', {
          region: this.layout.gradingParameterRegion,
          contentPieceModel: this.contentPieceModel
        });
      };

      ContentCreatorController.prototype._closeGradingParameter = function() {
        $(this.layout.contentBuilderRegion.el).find('#myCanvas').show();
        return this.layout.gradingParameterRegion.reset();
      };

      ContentCreatorController.prototype._showViews = function() {
        App.execute("show:options:bar", {
          region: this.layout.optionsBarRegion,
          contentType: this.contentType,
          contentPieceModel: this.contentPieceModel
        });
        App.execute("show:element:box", {
          region: this.layout.elementBoxRegion,
          contentType: this.contentPieceModel.get('content_type'),
          eventObj: this.eventObj
        });
        App.execute("show:content:builder", {
          region: this.layout.contentBuilderRegion,
          contentPieceModel: this.contentPieceModel,
          eventObj: this.eventObj
        });
        App.execute("show:property:dock", {
          region: this.layout.PropertyRegion,
          contentPieceModel: this.contentPieceModel
        });
        if ((this.contentPieceModel.get('question_type') != null) && this.contentPieceModel.get('question_type') === 'multiple_eval') {
          return this._showGradingParameter();
        }
      };

      return ContentCreatorController;

    })(RegionController);
    ContentCreatorLayout = (function(superClass) {
      extend(ContentCreatorLayout, superClass);

      function ContentCreatorLayout() {
        return ContentCreatorLayout.__super__.constructor.apply(this, arguments);
      }

      ContentCreatorLayout.prototype.className = 'content-creator-layout';

      ContentCreatorLayout.prototype.template = '<div id="content-pieces-list-region"></div> <div id="options-bar-region"></div> <input type="hidden" name = "cp_not_saved" value= false data-description="content piece modified but not saved" /> <div class="page-title"> <h3>Add <span class="semi-bold">Question</span></h3> </div> <div class="creator"> <div class="tiles" id="toolbox"></div> <div class="" id="content-builder"></div> <div id="grading-parameter"></div> <div id="property-dock"></div> </div>';

      ContentCreatorLayout.prototype.regions = {
        elementBoxRegion: '#toolbox',
        contentBuilderRegion: '#content-builder',
        PropertyRegion: '#property-dock',
        optionsBarRegion: '#options-bar-region',
        gradingParameterRegion: '#grading-parameter',
        contentPiecesListRegion: '#content-pieces-list-region'
      };

      return ContentCreatorLayout;

    })(Marionette.Layout);
    return CannotEditView = (function(superClass) {
      extend(CannotEditView, superClass);

      function CannotEditView() {
        return CannotEditView.__super__.constructor.apply(this, arguments);
      }

      CannotEditView.prototype.template = '<div class="tiles white grid simple vertical green animated slideInRight"> <div class="grid-title no-border"> Cannot Edit This Content Piece </div> <div style="overflow: hidden; display: block;" class="grid-body no-border"> <div class="row "> <div class="col-md-8"> <h4>This content piece cannot be edited as it is used in the following modules:</h4> <ul class="list-group"> {{#moduleItems}} <li class="list-group-item"><a href="{{url}}">{{name}}</a></li> {{/moduleItems}} </ul> <h4>You can clone it to create another content piece.</h4> <a class="btn btn-info" href="{{urlBase}}/{{ID}}">View Content Piece</a> <a class="btn btn-info clone_item">Clone Content Piece</a> </div> </div> </div> </div>';

      CannotEditView.prototype.mixinTemplateHelpers = function(data) {
        data.moduleItems = _.map(data.present_in_modules, function(module) {
          var m, moduleBaseurl;
          moduleBaseurl = (function() {
            switch (module.type) {
              case 'quiz':
                return 'view-quiz';
              case 'teaching-module':
                return 'view-group';
              case 'student-training':
                return 'view-student-training-module';
            }
          })();
          m = module;
          m.url = SITEURL + "/#" + moduleBaseurl + "/" + module.id;
          return m;
        });
        data.urlBase = SITEURL + '/#dummy-';
        data.urlBase += data.content_type === 'student_question' ? 'quiz' : 'module';
        console.log(data);
        return data;
      };

      CannotEditView.prototype.events = function() {
        return {
          'click .clone_item': 'cloneItem'
        };
      };

      CannotEditView.prototype.cloneItem = function() {
        var contentPieceData;
        this.cloneModel = App.request("new:content:piece");
        contentPieceData = this.model.toJSON();
        this.clonedData = _.omit(contentPieceData, ['ID', 'guid', 'last_modified_by', 'post_author', 'post_author_name', 'post_date', 'post_date_gmt', 'published_by']);
        this.clonedData.post_status = "pending";
        this.clonedData.clone_id = this.model.id;
        return App.execute("when:fetched", this.cloneModel, (function(_this) {
          return function() {
            return _this.cloneModel.save(_this.clonedData, {
              wait: true,
              success: function(model) {
                return App.navigate("edit-content/" + model.id, true);
              },
              error: function(resp) {
                return console.log(resp);
              }
            });
          };
        })(this));
      };

      return CannotEditView;

    })(Marionette.ItemView);
  });
});
