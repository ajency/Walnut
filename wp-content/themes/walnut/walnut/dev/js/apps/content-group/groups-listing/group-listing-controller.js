var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController, contentGroupTpl) {
  return App.module("ContentGroupApp.ListingView", function(ListingView, App) {
    var ContentGroupsListingView;
    ListingView.GroupController = (function(_super) {
      __extends(GroupController, _super);

      function GroupController() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      GroupController.prototype.initialize = function() {
        var breadcrumb_items, view;
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
        this.view = view = this._getContentGroupsListingView();
        return this.show(view, {
          loading: true
        });
      };

      GroupController.prototype._getContentGroupsListingView = function() {
        return new ContentGroupsListingView;
      };

      return GroupController;

    })(RegionController);
    return ContentGroupsListingView = (function(_super) {
      __extends(ContentGroupsListingView, _super);

      function ContentGroupsListingView() {
        return ContentGroupsListingView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsListingView.prototype.template = '<div class="grid-title no-border"> <div class="row"> <div class="col-lg-12"> <h4><span class="semi-bold">All</span> Groups</h4> <table class="table table-hover table-condensed table-fixed-layout table-bordered" id="dataContentTable"> <thead> <td>Test</td> </thead> <tbody> </tbody> </table> </div> </div> </div>';

      ContentGroupsListingView.prototype.className = 'tiles white grid simple vertical green';

      ContentGroupsListingView.prototype.onShow = function() {
        return console.log('test listing view');
      };

      return ContentGroupsListingView;

    })(Marionette.ItemView);
  });
});
