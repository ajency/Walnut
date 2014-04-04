var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-collection/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.Controller", function(Controller, App) {
    var dataContentTableView;
    Controller.ContentSelectionController = (function(_super) {
      __extends(ContentSelectionController, _super);

      function ContentSelectionController() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        return ContentSelectionController.__super__.constructor.apply(this, arguments);
      }

      ContentSelectionController.prototype.initialize = function() {
        var tableConfig, view;
        this.questionsCollection = App.request("get:content:pieces");
        tableConfig = {
          'data': [
            {
              'label': 'Question',
              'value': 'post_title'
            }, {
              'label': 'Creator'
            }, {
              'label': 'Last Modified',
              'value': 'post_modified',
              'dateField': true
            }
          ],
          'idAttribute': 'ID',
          'selectbox': true,
          'pagination': true
        };
        this.view = view = this._getContentSelectionView(this.questionsCollection, tableConfig);
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
        var make_slug, pagerOptions, td_ID;
        td_ID = 'id';
        make_slug = function(str) {
          var $slug, trimmed;
          $slug = '';
          trimmed = $.trim(str);
          $slug = trimmed.replace(/[^a-z0-9-]/gi, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
          return $slug.toLowerCase();
        };
        if (this.tableData.idAttribute) {
          td_ID = this.tableData.idAttribute;
        }
        _.each(this.collection.models, (function(_this) {
          return function(item, index) {
            var row;
            row = '<tr>';
            if (_this.tableData.selectbox) {
              row += '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="' + item.get(td_ID) + '" id="checkbox' + index + '"> <label for="checkbox' + index + '"></label> </div> </td>';
            }
            _.each(_this.tableData.data, function(el, ind) {
              var el_value, slug;
              if (el.value) {
                el_value = item.get(el.value);
              } else {
                slug = make_slug(el.label);
                el_value = item.get(slug);
              }
              if (el.dateField) {
                el_value = moment(el_value).format("Do MMM YYYY");
              }
              return row += '<td> ' + el_value + ' </td>';
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
          return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
        } else {
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
