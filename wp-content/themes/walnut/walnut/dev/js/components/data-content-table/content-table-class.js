Ajency.dataContentTableView = Marionette.CollectionView.extend({
  constructor: function() {
    return Marionette.ItemView.prototype.constructor.apply(this, arguments);
  },
  template: '<table class="table table-hover table-condensed table-fixed-layout table-bordered" id="dataContentTable"> <thead> <tr> {{#tableData}} {{#selectbox}} <th style="width:8%"><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div> </th> {{/selectbox}} {{#data}} <th>{{label}}</th> {{/data}} {{/tableData}} </tr> </thead> <tbody> </tbody> </table>',
  className: 'tiles white grid simple vertical green',
  events: {
    'change #check_all_div': 'check_all'
  },
  initialize: function(opts) {
    return this.tableData = opts.tableConfig;
  },
  onShow: (function(_this) {
    return function() {
      var pagerOptions;
      _.each(_this.collection.models, function(item, index) {
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
      });
      $('#dataContentTable').tablesorter();
      if (_this.tableData.pagination) {
        _this.$el.find('#dataContentTable').after('<div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option selected="selected" value="5">5</option> <option value="10">10</option> <option value="20">20</option> <option value="30">30</option> <option value="40">40</option> </select> </div>');
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#dataContentTable').tablesorterPager(pagerOptions);
      }
    };
  })(this),
  check_all: function() {
    if (this.$el.find('#check_all').is(':checked')) {
      console.log('checked');
      return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
    } else {
      console.log('not checked');
      return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
    }
  }
});
