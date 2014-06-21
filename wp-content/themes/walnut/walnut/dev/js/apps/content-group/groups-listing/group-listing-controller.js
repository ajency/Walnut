var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'apps/content-group/groups-listing/group-listing-views'], function(App, RegionController) {
  return App.module("ContentGroupApp.GroupListing", function(GroupListing, App, Backbone, Marionette, $, _) {
    return GroupListing.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {
        var breadcrumb_items;
        this.contentGroupCollection = App.request("get:content:groups");
        this.textbooksCollection = App.request("get:textbooks");
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'View All Content Groups',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        return App.execute("when:fetched", [this.contentGroupCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var view;
            _this.fullCollection = _this.contentGroupCollection.clone();
            _this.view = view = _this._getContentGroupsListingView();
            _this.show(view, {
              loading: true,
              entities: [_this.contentGroupCollection, _this.textbooksCollection, _this.fullCollection]
            });
            return _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
              var chaptersOrSections;
              chaptersOrSections = App.request("get:chapters", {
                'parent': parentID
              });
              return App.execute("when:fetched", chaptersOrSections, function() {
                return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
              });
            });
          };
        })(this));
      };

      Controller.prototype._getContentGroupsListingView = function() {
        return new GroupListing.Views.GroupsListingView({
          collection: this.contentGroupCollection,
          fullCollection: this.fullCollection,
          textbooksCollection: this.textbooksCollection
        });
      };

      return Controller;

    })(RegionController);
  });
});
