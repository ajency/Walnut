var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/admin-content-modules/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("AdminContentModulesApp.View", function(View, App) {
    View.AdminModulesController = (function(_super) {
      __extends(AdminModulesController, _super);

      function AdminModulesController() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return AdminModulesController.__super__.constructor.apply(this, arguments);
      }

      AdminModulesController.prototype.initialize = function() {
        this.contentGroupsCollection = null;
        this.allChaptersCollection = null;
        this.textbooksCollection = null;
        this.divisionsCollection = App.request("get:divisions");
        return App.execute("when:fetched", this.divisionsCollection, (function(_this) {
          return function() {
            var class_id, division;
            division = _this.divisionsCollection.first().get('id');
            class_id = _this.divisionsCollection.first().get('class_id');
            _this.contentGroupsCollection = App.request("get:content:groups", {
              division: division,
              class_id: class_id,
              post_status: 'publish'
            });
            _this.textbooksCollection = App.request("get:textbooks", {
              'class_id': class_id
            });
            return App.execute("when:fetched", [_this.contentGroupsCollection, _this.textbooksCollection], function() {
              var chapter_ids;
              chapter_ids = _.chain(_this.contentGroupsCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
              _this.allChaptersCollection = App.request("get:textbook:names:by:ids", chapter_ids);
              return App.execute("when:fetched", [_this.allChaptersCollection, _this.textbooksCollection], function() {
                var view;
                _this.view = view = _this._getContentGroupsListingView(_this.contentGroupsCollection);
                _this.show(_this.view, {
                  loading: true
                });
                _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
                  var chaptersOrSections;
                  chaptersOrSections = App.request("get:chapters", {
                    'parent': parentID
                  });
                  return App.execute("when:fetched", chaptersOrSections, function() {
                    return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
                  });
                });
                _this.listenTo(_this.view, "division:changed", function(division) {
                  var newModulesCollection;
                  class_id = _this.divisionsCollection.findWhere({
                    'id': division
                  }).get('class_id');
                  newModulesCollection = App.request("get:content:groups", {
                    division: division,
                    class_id: class_id,
                    post_status: 'publish'
                  });
                  _this.textbooksCollection = App.request("get:textbooks", {
                    'class_id': class_id
                  });
                  return App.execute("when:fetched", [newModulesCollection, _this.textbooksCollection], function() {
                    return _this.view.triggerMethod("new:collection:fetched", newModulesCollection, _this.textbooksCollection);
                  });
                });
                return _this.listenTo(_this.view, "save:communications", function(data) {
                  data = {
                    component: 'teaching_modules',
                    communication_type: 'taught_in_class_parent_mail',
                    communication_mode: data.communication_mode,
                    additional_data: {
                      module_ids: data.moduleIDs,
                      division: data.division
                    }
                  };
                  App.request("save:communications", data);
                  data.communication_type = 'taught_in_class_student_mail';
                  return App.request("save:communications", data);
                });
              });
            });
          };
        })(this));
      };

      AdminModulesController.prototype._getContentGroupsListingView = function(collection) {
        return new View.AdminModulesView.ModulesView({
          collection: collection,
          textbooksCollection: this.textbooksCollection,
          chaptersCollection: this.allChaptersCollection,
          divisionsCollection: this.divisionsCollection
        });
      };

      return AdminModulesController;

    })(RegionController);
    return App.commands.setHandler("show:all:content:modules:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.AdminModulesController(opt);
    });
  });
});
