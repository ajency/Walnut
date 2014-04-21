var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("TeachersDashboardApp.View", function(View, App) {
    var ContentGroupsItemView, ContentGroupsView;
    View.textbookModulesController = (function(_super) {
      __extends(textbookModulesController, _super);

      function textbookModulesController() {
        this._getContentGroupsListingView = __bind(this._getContentGroupsListingView, this);
        return textbookModulesController.__super__.constructor.apply(this, arguments);
      }

      textbookModulesController.prototype.initialize = function(opts) {
        var breadcrumb_items, contentGroupsCollection, textbookID, view;
        textbookID = opts.textbookID;
        contentGroupsCollection = App.request("get:content:groups", {
          'textbook': textbookID
        });
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': '#teachers/dashboard'
            }, {
              'label': 'Take Class',
              'link': 'javascript:;'
            }, {
              'label': 'Textbook',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getContentGroupsListingView(contentGroupsCollection);
        return this.show(view, {
          loading: true
        });
      };

      textbookModulesController.prototype._getContentGroupsListingView = function(collection) {
        return new ContentGroupsView({
          collection: collection
        });
      };

      return textbookModulesController;

    })(RegionController);
    ContentGroupsItemView = (function(_super) {
      __extends(ContentGroupsItemView, _super);

      function ContentGroupsItemView() {
        return ContentGroupsItemView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsItemView.prototype.template = '<td class="v-align-middle"><a href="#"></a>{{name}}</td> <td class="v-align-middle"><span class="muted">{{duration}} {{minshours}}</span></td> <td><span class="muted"> <span class="label label-success">Completed</span></span> <div class="alert alert-success inline pull-right m-b-0 dateInfo"> Taught to classes: <span class="bold">-</span> </div> </td>';

      ContentGroupsItemView.prototype.tagName = 'tr';

      ContentGroupsItemView.prototype.onShow = function() {
        return console.log('test listing view');
      };

      return ContentGroupsItemView;

    })(Marionette.ItemView);
    return ContentGroupsView = (function(_super) {
      __extends(ContentGroupsView, _super);

      function ContentGroupsView() {
        return ContentGroupsView.__super__.constructor.apply(this, arguments);
      }

      ContentGroupsView.prototype.template = '<div class="tiles white grid simple vertical blue"> <div class="grid-title no-border"> <h4 class="">Textbook <span class="semi-bold">Abc</span></h4> <div class="tools"> <a href="javascript:;" class="collapse"></a> </div> </div> <div class="grid-body no-border contentSelect" style="overflow: hidden; display: block;"> <div class="row"> <div class="col-lg-12"> <h4><span class="semi-bold">All</span> Modules</h4> <table class="table table-hover table-condensed table-fixed-layout table-bordered" id="modules"> <thead> <tr> <th style="width:50%">Name</th> <th style="width:10%" >Duration</th> <th style="width:40%">Status</th> </tr> </thead> <tbody> </tbody> </table> </div> </div> </div> </div>';

      ContentGroupsView.prototype.itemView = ContentGroupsItemView;

      ContentGroupsView.prototype.itemViewContainer = 'tbody';

      ContentGroupsView.prototype.className = 'teacher-app moduleList';

      return ContentGroupsView;

    })(Marionette.CompositeView);
  });
});
