var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/start-training/templates/class-description.html', 'apps/teachers-dashboard/start-training/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ClassDescriptionView, TextbookListLayout;
    View.StartTrainingController = (function(_super) {
      __extends(StartTrainingController, _super);

      function StartTrainingController() {
        this._showTextbooksListView = __bind(this._showTextbooksListView, this);
        return StartTrainingController.__super__.constructor.apply(this, arguments);
      }

      StartTrainingController.prototype.initialize = function(opts) {
        var breadcrumb_items, layout;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': 'Start Training',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.classID = opts.classID;
        this.division = opts.division;
        this.textbooks = App.request("get:textbooks", {
          class_id: this.classID
        });
        this.layout = layout = this._getTrainingModuleLayout();
        this.show(layout, {
          loading: true,
          entities: [this.textbooks]
        });
        return this.listenTo(layout, "show", this._showTextbooksListView);
      };

      StartTrainingController.prototype._showTextbooksListView = function() {
        return App.execute("when:fetched", this.textbooks, (function(_this) {
          return function() {
            var classDescriptionView, textbookListView;
            textbookListView = new View.List.TextbooksListView({
              collection: _this.textbooks
            });
            classDescriptionView = new ClassDescriptionView({
              templateHelpers: {
                showSubjectsList: function() {
                  var subjectsList;
                  subjectsList = _.uniq(_.compact(_.flatten(_this.textbooks.pluck('subjects'))));
                  return subjectsList;
                },
                showClassID: function() {
                  return CLASS_LABEL[_this.classID];
                }
              }
            });
            _this.layout.textbooksListRegion.show(textbookListView);
            return _this.layout.classDetailsRegion.show(classDescriptionView);
          };
        })(this));
      };

      StartTrainingController.prototype._getTrainingModuleLayout = function() {
        return new TextbookListLayout;
      };

      return StartTrainingController;

    })(RegionController);
    TextbookListLayout = (function(_super) {
      __extends(TextbookListLayout, _super);

      function TextbookListLayout() {
        return TextbookListLayout.__super__.constructor.apply(this, arguments);
      }

      TextbookListLayout.prototype.template = '<div id="class-details-region"></div> <div id="textbooks-list-region"></div>';

      TextbookListLayout.prototype.regions = {
        classDetailsRegion: '#class-details-region',
        textbooksListRegion: '#textbooks-list-region'
      };

      return TextbookListLayout;

    })(Marionette.Layout);
    return ClassDescriptionView = (function(_super) {
      __extends(ClassDescriptionView, _super);

      function ClassDescriptionView() {
        return ClassDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ClassDescriptionView.prototype.template = classDescriptionTpl;

      return ClassDescriptionView;

    })(Marionette.ItemView);
  });
});
