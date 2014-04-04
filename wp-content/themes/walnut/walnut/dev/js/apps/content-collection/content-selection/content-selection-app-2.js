var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.Controller", function(Controller, App) {
    var dataContentTableView;
    Controller.ContentSelectionController = (function(_super) {
      __extends(ContentSelectionController, _super);

      function ContentSelectionController() {
        return ContentSelectionController.__super__.constructor.apply(this, arguments);
      }

      ContentSelectionController.prototype.initialize = function() {
        var questionsCollection, tableConfig, view;
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
        this.view = view = this._getContentSelectionView(questionsCollection, tableConfig);
        return this.show(view, {
          loading: true
        });
      };

      ContentSelectionController.prototype._getContentSelectionView = function(collection, tableConfig) {
        return new dataContentTableView({
          collection: collection,
          tableConfig: tableConfig
        });
      };

      return ContentSelectionController;

    })(RegionController);
    dataContentTableView = (function(_super) {
      __extends(dataContentTableView, _super);

      function dataContentTableView() {
        this.onShow = __bind(this.onShow, this);
        return dataContentTableView.__super__.constructor.apply(this, arguments);
      }

      dataContentTableView.prototype.template = contentSelectionTpl;

      dataContentTableView.prototype.className = 'tiles white grid simple vertical green';

      dataContentTableView.prototype.events = {
        'change #check_all_div': 'check_all'
      };

      dataContentTableView.prototype.initialize = function(opts) {
        return this.tableData = opts.tableConfig;
      };

      dataContentTableView.prototype.serializeData = function() {
        var data;
        data = dataContentTableView.__super__.serializeData.call(this);
        data.tableData = this.tableData;
        return data;
      };

      dataContentTableView.prototype.onShow = function() {
        var pagerOptions;
        _.each(this.collection.models, (function(_this) {
          return function(item, index) {
            var row;
            row = '<tr>';
            if (_this.tableData.selectbox) {
              row += '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="' + item.get(_this.tableData.id_attribute) + '" id="checkbox' + index + '"> <label for="checkbox' + index + '"></label> </div> </td>';
            }
            _.each(_this.tableData.data, function(el, ind) {
              return row += '<td> ' + item.get(el.value) + ' </td>';
            });
            row += '</tr>';
            return _this.$el.find('#dataContentTable tbody').append(row);
          };
        })(this));
        $('#dataContentTable').tablesorter();
        if (this.tableData.pagination) {
          this.$el.find('.pager').show();
          pagerOptions = {
            container: $(".pager"),
            output: '{startRow} to {endRow} of {totalRows}'
          };
          return $('#dataContentTable').tablesorterPager(pagerOptions);
        }
      };

      dataContentTableView.prototype.check_all = function() {
        if (this.$el.find('#check_all').is(':checked')) {
          console.log('checked');
          return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          console.log('not checked');
          return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
        }
      };

      return dataContentTableView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:content:selectionapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ContentSelectionController(opt);
    });
  });
});
