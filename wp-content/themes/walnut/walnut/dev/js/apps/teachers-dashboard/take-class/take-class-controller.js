var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/take-class/templates/class-description.html', 'apps/teachers-dashboard/take-class/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ClassDescriptionView, TextbookListLayout;
    View.TakeClassController = (function(_super) {
      __extends(TakeClassController, _super);

      function TakeClassController() {
        this._showTextbooksListView = __bind(this._showTextbooksListView, this);
        return TakeClassController.__super__.constructor.apply(this, arguments);
      }

      TakeClassController.prototype.initialize = function(opts) {
        var breadcrumb_items, classID, layout;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': 'Take Class',
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        classID = opts.classID;
        this.division = opts.division;
        this.divisionModel = App.request("get:division:by:id", this.division);
        this.textbooks = App.request("get:textbooks", {
          class_id: classID
        });
        this.layout = layout = this._getTrainingModuleLayout();
        this.show(layout, {
          loading: true,
          entities: [this.textbooks, this.divisionModel]
        });
        return this.listenTo(layout, "show", this._showTextbooksListView);
      };

      TakeClassController.prototype._showTextbooksListView = function() {
        return App.execute("when:fetched", [this.textbooks, this.divisionModel], (function(_this) {
          return function() {
            var classDescriptionView, textbookListView;
            console.log(_this.divisionModel);
            textbookListView = new View.TakeClass.TextbooksListView({
              collection: _this.textbooks
            });
            classDescriptionView = new ClassDescriptionView({
              model: _this.divisionModel,
              templateHelpers: {
                showSubjectsList: function() {
                  var subjectsList;
                  subjectsList = _.uniq(_.compact(_.flatten(_this.textbooks.pluck('subjects'))));
                  return subjectsList;
                }
              }
            });
            _this.layout.textbooksListRegion.show(textbookListView);
            return _this.layout.classDetailsRegion.show(classDescriptionView);
          };
        })(this));
      };

      TakeClassController.prototype._getTrainingModuleLayout = function() {
        return new TextbookListLayout;
      };

      return TakeClassController;

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
