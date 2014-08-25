var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/content-modules/edit-module/module-edit-controller', 'apps/content-modules/view-single-module/single-module-controller', 'apps/content-modules/modules-listing/app'], function(App) {
  return App.module("ContentModulesApp", function(ContentModulesApp, App) {
    var ContentModulesRouter, Controller;
    ContentModulesRouter = (function(_super) {
      __extends(ContentModulesRouter, _super);

      function ContentModulesRouter() {
        return ContentModulesRouter.__super__.constructor.apply(this, arguments);
      }

      ContentModulesRouter.prototype.appRoutes = {
        'add-module': 'addModule',
        'view-group/:id': 'viewModule',
        'edit-module/:id': 'editModule',
        'module-list': 'modulesListing',
        'teachers/take-class/:classID/:div/textbook/:tID/module/:mID': 'takeClassSingleModule',
        'teachers/start-training/:classID/textbook/:tID/module/:mID': 'startTrainingSingleModule',
        'dummy-module/:content_piece_id': 'showDummyModule'
      };

      return ContentModulesRouter;

    })(Marionette.AppRouter);
    Controller = {
      addModule: function() {
        return new ContentModulesApp.Edit.GroupController({
          region: App.mainContentRegion,
          groupType: 'teaching-module'
        });
      },
      editModule: function(id) {
        return new ContentModulesApp.Edit.GroupController({
          region: App.mainContentRegion,
          group_id: id,
          groupType: 'teaching-module'
        });
      },
      viewModule: function(id) {
        var breadcrumb_items;
        this.contentGroupModel = App.request("get:content:group:by:id", id);
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'View Content Group',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return new ContentModulesApp.View.GroupController({
          region: App.mainContentRegion,
          model: this.contentGroupModel
        });
      },
      modulesListing: function() {
        return new ContentModulesApp.ModulesListing.ListController({
          region: App.mainContentRegion,
          groupType: 'teaching-module'
        });
      },
      takeClassSingleModule: function(classID, div, tID, mID) {
        var opts;
        opts = {
          classID: classID,
          div: div,
          tID: tID,
          mID: mID,
          mode: 'take-class'
        };
        return this.gotoTakeSingleQuestionModule(opts);
      },
      startTrainingSingleModule: function(classID, tID, mID) {
        var opts;
        opts = {
          classID: classID,
          tID: tID,
          mID: mID,
          mode: 'training'
        };
        return this.gotoTakeSingleQuestionModule(opts);
      },
      gotoTakeSingleQuestionModule: function(opts) {
        var classID, div, mID, mode, tID;
        classID = opts.classID, div = opts.div, tID = opts.tID, mID = opts.mID, mode = opts.mode;
        this.textbook = App.request("get:textbook:by:id", tID);
        this.contentGroupModel = App.request("get:content:group:by:id", mID);
        App.execute("when:fetched", this.textbook, (function(_this) {
          return function() {
            return App.execute("when:fetched", _this.contentGroupModel, function() {
              var breadcrumb_items, moduleName, textbookName;
              textbookName = _this.textbook.get('name');
              moduleName = _this.contentGroupModel.get('name');
              breadcrumb_items = {
                'items': [
                  {
                    'label': 'Dashboard',
                    'link': '#teachers/dashboard'
                  }, {
                    'label': 'Take Class',
                    'link': '#teachers/take-class/' + classID + '/' + div
                  }, {
                    'label': textbookName,
                    'link': '#teachers/take-class/' + classID + '/' + div + '/textbook/' + tID
                  }, {
                    'label': moduleName,
                    'link': 'javascript:;',
                    'active': 'active'
                  }
                ]
              };
              return App.execute("update:breadcrumb:model", breadcrumb_items);
            });
          };
        })(this));
        return new ContentModulesApp.View.GroupController({
          region: App.mainContentRegion,
          model: this.contentGroupModel,
          mode: mode,
          division: div,
          classID: classID
        });
      },
      showDummyModule: function(content_piece_id) {
        this.contentPiece = App.request("get:content:piece:by:id", content_piece_id);
        return App.execute("when:fetched", this.contentPiece, (function(_this) {
          return function() {
            var dummyGroupModel, questionsCollection;
            questionsCollection = App.request("empty:content:pieces:collection");
            questionsCollection.add(_this.contentPiece);
            if (_this.contentPiece.get('content_type') !== 'student_question') {
              dummyGroupModel = App.request("create:dummy:content:module", content_piece_id);
              return App.execute("start:teacher:teaching:app", {
                region: App.mainContentRegion,
                division: 3,
                contentPiece: _this.contentPiece,
                questionResponseCollection: App.request("get:empty:question:response:collection"),
                contentGroupModel: dummyGroupModel,
                questionsCollection: questionsCollection,
                classID: 2,
                studentCollection: App.request("get:dummy:students"),
                display_mode: 'class_mode'
              });
            }
          };
        })(this));
      }
    };
    return ContentModulesApp.on("start", function() {
      return new ContentModulesRouter({
        controller: Controller
      });
    });
  });
});
