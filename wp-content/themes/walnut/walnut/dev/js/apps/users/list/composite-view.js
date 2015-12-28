var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'apps/users/list/item-view'], function(App) {
  return App.module("UsersApp.List.Views", function(Views) {
    return Views.UsersListView = (function(_super) {
      __extends(UsersListView, _super);

      function UsersListView() {
        return UsersListView.__super__.constructor.apply(this, arguments);
      }

      UsersListView.prototype.template = '<div class="tiles white grid simple animated fadeIn"> <div class="grid-title"> <h3 class="m-t-5 m-b-5">List of  <span class="semi-bold">Parents</span></h3> </div> <div class="grid-body contentSelect" style="overflow: hidden; display: block;"> <div class="row"> <div class="col-lg-12"> <a class="btn btn-small pull-right btn-info" href="#add-parent">Add Parent</a> </div> </div> <div class="row m-t-15"> <div class="col-lg-12"> <table class="tablesorter table table-condensed table-fixed-layout table-bordered" id="users-list"> <thead> <tr> <th>Name</th> <th>Email</th> <th></th> </tr> </thead> <tbody> </tbody> </table> <div id="pager" class="pager"> <i class="cursor fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="cursor fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> </div> </div> </div> </div>';

      UsersListView.prototype.itemView = Views.UsersItemView;

      UsersListView.prototype.itemViewContainer = 'table tbody';

      UsersListView.prototype.itemViewOptions = function() {
        return {
          editedID: Marionette.getOption(this, 'editedID')
        };
      };

      UsersListView.prototype.className = 'row';

      UsersListView.prototype.onShow = function() {
        var pagerOptions;
        this.$el.find("table#users-list").tablesorter();
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("table#users-list").tablesorterPager(pagerOptions);
      };

      return UsersListView;

    })(Marionette.CompositeView);
  });
});
