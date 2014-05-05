var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/take-class/templates/class-description.html', 'apps/teachers-dashboard/take-class/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ClassDescriptionView, TextbookListLayout, divisionModel, textbooks;
    divisionModel = null;
    textbooks = null;
    View.TakeClassController = (function(_super) {
      __extends(TakeClassController, _super);

      function TakeClassController() {
        return TakeClassController.__super__.constructor.apply(this, arguments);
      }

      TakeClassController.prototype.initialize = function(opts) {
        var breadcrumb_items, breadcrumb_label, layout;
        console.log(opts);
        this.classID = opts.classID, this.division = opts.division, this.mode = opts.mode;
        breadcrumb_label = 'Start Training';
        if (this.mode === 'take-class') {
          divisionModel = App.request("get:division:by:id", this.division);
          breadcrumb_label = 'Take Class';
        } else {
          divisionModel = '';
        }
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': breadcrumb_label,
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        textbooks = App.request("get:textbooks", {
          class_id: this.classID
        });
        this.layout = layout = this._getTrainingModuleLayout();
        this.show(layout, {
          loading: true,
          entities: [textbooks, divisionModel]
        });
        return this.listenTo(layout, "show", this._showTextbooksListView);
      };

      TakeClassController.prototype._showTextbooksListView = function() {
        return App.execute("when:fetched", textbooks, (function(_this) {
          return function() {
            var classDescriptionView, textbookListView;
            textbookListView = new View.TakeClass.TextbooksListView({
              collection: textbooks
            });
            classDescriptionView = new ClassDescriptionView({
              templateHelpers: {
                showSubjectsList: function() {
                  var subjectsList;
                  subjectsList = _.uniq(_.compact(_.flatten(textbooks.pluck('subjects'))));
                  return subjectsList;
                },
                showClassLabel: function() {
                  if (_this.mode === 'training') {
                    return CLASS_LABEL[_this.classID];
                  } else {
                    return divisionModel.get('division');
                  }
                },
                showNoOfStudents: function() {
                  if (_this.mode === 'training') {
                    return 'N/A';
                  } else {
                    return divisionModel.get('students_count');
                  }
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

      ClassDescriptionView.prototype.onShow = function() {
        return console.log('on show');
      };

      return ClassDescriptionView;

    })(Marionette.ItemView);
  });
});
