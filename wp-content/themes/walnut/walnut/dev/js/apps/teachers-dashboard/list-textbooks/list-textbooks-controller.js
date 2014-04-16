var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/teachers-dashboard/list-textbooks/views'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ClassDescriptionView, TextbookListLayout;
    View.TextbooksListController = (function(_super) {
      __extends(TextbooksListController, _super);

      function TextbooksListController() {
        this._showTextbooksListView = __bind(this._showTextbooksListView, this);
        return TextbooksListController.__super__.constructor.apply(this, arguments);
      }

      TextbooksListController.prototype.initialize = function(opts) {
        var breadcrumb_items, classID, label, layout, sectionType;
        sectionType = opts.sectionType;
        if (sectionType === 'start-training') {
          label = 'Start Training';
        } else if (sectionType === 'take-class') {
          label = 'Take a Class';
        }
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': label,
              'link': 'javascript://'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        classID = opts.classID;
        this.division = opts.division;
        this.textbooks = App.request("get:textbooks", {
          class_id: classID
        });
        this.layout = layout = this._getTrainingModuleLayout();
        this.show(layout, {
          loading: true,
          entities: [this.textbooks]
        });
        return this.listenTo(layout, "show", this._showTextbooksListView);
      };

      TextbooksListController.prototype._showTextbooksListView = function() {
        return App.execute("when:fetched", this.textbooks, (function(_this) {
          return function() {
            var classDescriptionView, textbookListView;
            textbookListView = new View.List.TextbooksListView({
              collection: _this.textbooks
            });
            classDescriptionView = new ClassDescriptionView;
            _this.layout.textbooksListRegion.show(textbookListView);
            if (_this.division) {
              return _this.layout.classDetailsRegion.show(classDescriptionView);
            }
          };
        })(this));
      };

      TextbooksListController.prototype._getTrainingModuleLayout = function() {
        return new TextbookListLayout;
      };

      return TextbooksListController;

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

      ClassDescriptionView.prototype.template = '<div class="tiles white grid simple vertical green"> <div class="grid-title no-border"> <h4 class="">5 <span class="semi-bold">A</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border" style="overflow: hidden; display: block;"> <div class="row "> <div class="col-md-4"> <div class="margin-bottom-20 "> <label class="form-label">Number of Students</label> 18 </div> </div> <div class="col-md-4"> <div class="margin-bottom-20 "> <label class="form-label">Subjects</label> Chemistry, Biology </div> </div> <div class="col-md-4"> <div class="margin-bottom-20 "> <!-- <label class="form-label">Physical Requirements</label> Lorem Ipsum is simply dummy text of the printing and typesetting industry. --> </div> </div> </div> </div> </div>';

      return ClassDescriptionView;

    })(Marionette.ItemView);
  });
});
