var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentSelectionApp.Views", function(Controller, App) {
    var dataContentTableView;
    return dataContentTableView = (function(_super) {
      __extends(dataContentTableView, _super);

      function dataContentTableView() {
        this.onShow = __bind(this.onShow, this);
        return dataContentTableView.__super__.constructor.apply(this, arguments);
      }

      dataContentTableView.prototype.template = '<table class="table table-hover table-condensed table-fixed-layout table-bordered" id="dataContentTable"> <thead> <tr> {{#tableData}} {{#selectbox}} <th style="width:8%"><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div> </th> {{/selectbox}} {{#data}} <th>{{label}}</th> {{/data}} {{/tableData}} </tr> </thead> <tbody> </tbody> </table>';

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
          this.$el.find('#dataContentTable').after('<div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option selected="selected" value="5">5</option> <option value="10">10</option> <option value="20">20</option> <option value="30">30</option> <option value="40">40</option> </select> </div>');
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
  });
});