var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'components/data-content-table/content-table-view', 'text!apps/content-collection/content-selection/templates/content-selection.html'], function(App, RegionController, contentDataView, contentSelectionTpl) {});

App.module("ContentSelectionApp.Controller", function(Controller, App) {
  var ContentSelectionLayout;
  Controller.ContentSelectionController = (function(_super) {
    __extends(ContentSelectionController, _super);

    function ContentSelectionController() {
      this._getContentSelectionLayout = __bind(this._getContentSelectionLayout, this);
      return ContentSelectionController.__super__.constructor.apply(this, arguments);
    }

    ContentSelectionController.prototype.initialize = function() {
      var layout, questionsCollection, tableConfig, view;
      questionsCollection = new Backbone.Collection([
        {
          'id': '1',
          'title': 'test1',
          'creator': 'Bob',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '2',
          'title': 'Question Test',
          'creator': 'John',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '3',
          'title': 'test34',
          'creator': 'Bob',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '4',
          'title': 'Trial 4324',
          'creator': 'Jane',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '5',
          'title': 'Test Stuff',
          'creator': 'Bob',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '6',
          'title': 'New Trials',
          'creator': 'Bessie',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '7',
          'title': 'Blast',
          'creator': 'Shawn',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }, {
          'id': '8',
          'title': 'Do test',
          'creator': 'Mike',
          'published_by': 'Admin',
          'created_on': '4/10/2013',
          'last_modified': '2/02/2014'
        }
      ]);
      tableConfig = {
        'data': [
          {
            'label': 'Question',
            'value': 'title'
          }, {
            'label': 'Creator',
            'value': 'creator'
          }, {
            'label': 'Last Modified',
            'value': 'last_modified'
          }
        ],
        'id_attribute': 'id',
        'selectbox': true,
        'pagination': true
      };
      this.layout = layout = this._getContentSelectionLayout();
      this.listenTo(layout, 'show', this.showLeftRightViews);
      this.view = view = this._getContentDataView(questionsCollection, tableConfig);
      return this.show(view, {
        loading: true
      });
    };

    ContentSelectionController.prototype._getContentDataView = function(collection, tableConfig) {
      return new dataContentTableView({
        collection: collection,
        tableConfig: tableConfig
      });
    };

    ContentSelectionController.prototype._getContentSelectionLayout = function() {
      return new ContentSelectionLayout;
    };

    return ContentSelectionController;

  })(RegionController);
  ContentSelectionLayout = (function(_super) {
    __extends(ContentSelectionLayout, _super);

    function ContentSelectionLayout() {
      return ContentSelectionLayout.__super__.constructor.apply(this, arguments);
    }

    ContentSelectionLayout.prototype.template = contentSelectionTpl;

    ContentSelectionLayout.prototype.className = 'tiles white grid simple vertical green';

    ContentSelectionLayout.prototype.regions = {
      contentTableRegion: 'content-data-table-region'
    };

    return ContentSelectionLayout;

  })(Marionette.Layout);
  return App.commands.setHandler("show:content:selectionapp", function(opt) {
    if (opt == null) {
      opt = {};
    }
    return new Controller.ContentSelectionController(opt);
  });
});
