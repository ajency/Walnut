var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/take-class/templates/class-description.html', 'apps/teachers-dashboard/take-class/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ClassDescriptionView, TextbookListLayout, divisionModel, textbooks;
    divisionModel = null;
    textbooks = null;
    View.TakeClassController = (function(superClass) {
      extend(TakeClassController, superClass);

      function TakeClassController() {
        this._showTextbooksListView = bind(this._showTextbooksListView, this);
        return TakeClassController.__super__.constructor.apply(this, arguments);
      }

      TakeClassController.prototype.initialize = function(opts) {
        var breadcrumb_items, breadcrumb_label, layout, ref;
        this.classID = opts.classID, this.division = opts.division, this.mode = opts.mode;
        breadcrumb_label = 'Start Training';
        console.log(this.mode);
        if ((ref = this.mode) === 'take-class' || ref === 'take-quiz') {
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
        if (this.mode === 'take-quiz') {
          textbooks = App.request("get:textbooks", {
            user_id: App.request("get:user:data", "ID")
          });
        } else {
          textbooks = App.request("get:textbooks", {
            class_id: this.classID,
            division: this.division
          });
        }
        this.layout = layout = this._getTrainingModuleLayout();
        App.execute("when:fetched", [divisionModel, textbooks], (function(_this) {
          return function() {
            return _this.show(layout, {
              loading: true
            });
          };
        })(this));
        return this.listenTo(layout, "show", this._showTextbooksListView);
      };

      TakeClassController.prototype._showTextbooksListView = function() {
        return App.execute("when:fetched", textbooks, (function(_this) {
          return function() {
            var classDescriptionView, textbookListView;
            textbookListView = new View.TakeClass.TextbooksListView({
              collection: textbooks,
              mode: _this.mode
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
                },
                trainingMode: function() {
                  if (_this.mode === 'training') {
                    return true;
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
    TextbookListLayout = (function(superClass) {
      extend(TextbookListLayout, superClass);

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
    ClassDescriptionView = (function(superClass) {
      extend(ClassDescriptionView, superClass);

      function ClassDescriptionView() {
        return ClassDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ClassDescriptionView.prototype.template = classDescriptionTpl;

      return ClassDescriptionView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:take:class:textbooks:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.TakeClassController(opt);
    });
  });
});
