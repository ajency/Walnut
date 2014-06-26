var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/admin-content-modules/views'], function(App, RegionController, classDescriptionTpl) {
  return App.module("AdminContentModulesApp.View", function(View, App) {
    return View.AdminModulesController = (function(_super) {
      __extends(AdminModulesController, _super);

      function AdminModulesController() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return AdminModulesController.__super__.constructor.apply(this, arguments);
      }

      AdminModulesController.prototype.initialize = function() {
        this.contentGroupsCollection = null;
        this.fullCollection = null;
        this.allChaptersCollection = null;
        this.textbooksCollection = App.request("get:textbooks");
        this.divisionsCollection = App.request("get:divisions");
        return App.execute("when:fetched", this.divisionsCollection, (function(_this) {
          return function() {
            var division;
            division = _this.divisionsCollection.first().get('id');
            _this.contentGroupsCollection = App.request("get:content:groups", {
              'division': division
            });
            return App.execute("when:fetched", _this.contentGroupsCollection, function() {
              var chapter_ids;
              chapter_ids = _.chain(_this.contentGroupsCollection.pluck('term_ids')).pluck('chapter').unique().compact().value();
              _this.allChaptersCollection = App.request("get:textbook:names:by:ids", chapter_ids);
              return App.execute("when:fetched", [_this.allChaptersCollection, _this.textbooksCollection], function() {
                var view;
                _this.fullCollection = _this.contentGroupsCollection.clone();
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
                return _this.listenTo(_this.view, "division:changed", function(division) {
                  var newModulesCollection;
                  newModulesCollection = App.request("get:content:groups", {
                    'division': division
                  });
                  return App.execute("when:fetched", newModulesCollection, function() {
                    var fullCollection;
                    fullCollection = newModulesCollection.clone();
                    return _this.view.triggerMethod("new:collection:fetched", newModulesCollection, fullCollection);
                  });
                });
              });
            });
          };
        })(this));
      };

      AdminModulesController.prototype._getContentGroupsListingView = function(collection) {
        return new View.AdminModulesView.ModulesView({
          collection: collection,
          fullCollection: this.fullCollection,
          textbooksCollection: this.textbooksCollection,
          chaptersCollection: this.allChaptersCollection,
          divisionsCollection: this.divisionsCollection
        });
      };

      return AdminModulesController;

    })(RegionController);
  });
});
