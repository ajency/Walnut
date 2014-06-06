var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/edit-group/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.Controller", function(Controller, App) {
    var DataContentTableView;
    Controller.ContentSelectionController = (function(_super) {
      __extends(ContentSelectionController, _super);

      function ContentSelectionController() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        this.contentPieceRemoved = __bind(this.contentPieceRemoved, this);
        return ContentSelectionController.__super__.constructor.apply(this, arguments);
      }

      ContentSelectionController.prototype.initialize = function(opts) {
        var tableConfig, view;
        this.textbooksCollection = App.request("get:textbooks");
        this.contentPiecesCollection = App.request("get:content:pieces", {
          content_type: ['teacher_question', 'content_piece']
        });
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        tableConfig = {
          'data': [
            {
              'label': 'Question',
              'value': 'post_excerpt'
            }, {
              'label': 'Author',
              'value': 'post_author_name'
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
        this.view = view = this._getContentSelectionView(this.contentPiecesCollection, tableConfig);
        this.show(view, {
          loading: true,
          entities: [this.textbooksCollection, this.contentGroupCollection]
        });
        this.listenTo(this.view, {
          "fetch:chapters": (function(_this) {
            return function(term_id) {
              var chaptersCollection;
              chaptersCollection = App.request("get:chapters", {
                'parent': term_id
              });
              return App.execute("when:fetched", chaptersCollection, function() {
                return _this.view.triggerMethod('fetch:chapters:complete', chaptersCollection);
              });
            };
          })(this)
        });
        this.listenTo(this.view, {
          "fetch:sections:subsections": function(term_id) {
            var allSectionsCollection;
            allSectionsCollection = App.request("get:subsections:by:chapter:id", {
              'child_of': term_id
            });
            return App.execute("when:fetched", allSectionsCollection, (function(_this) {
              return function() {
                var allSections, sectionsList, subsectionsList;
                sectionsList = allSectionsCollection.where({
                  'parent': term_id
                });
                subsectionsList = _.difference(allSectionsCollection.models, sectionsList);
                allSections = {
                  'sections': sectionsList,
                  'subsections': subsectionsList
                };
                return _this.view.triggerMethod('fetch:subsections:complete', allSections);
              };
            })(this));
          }
        });
        this.listenTo(this.view, {
          "add:content:pieces": (function(_this) {
            return function(contentIDs) {
              _.each(contentIDs, function(ele, index) {
                return _this.contentGroupCollection.add(_this.contentPiecesCollection.get(ele));
              });
              return console.log(_this.contentGroupCollection);
            };
          })(this)
        });
        return this.listenTo(this.contentGroupCollection, 'content:pieces:of:group:removed', this.contentPieceRemoved);
      };

      ContentSelectionController.prototype.contentPieceRemoved = function(model) {
        return this.view.triggerMethod("content:piece:removed", model);
      };

      ContentSelectionController.prototype._getContentSelectionView = function(collection, tableConfig) {
        return new DataContentTableView({
          collection: collection,
          tableConfig: tableConfig,
          templateHelpers: {
            textbooksFilter: (function(_this) {
              return function() {
                var textbooks;
                textbooks = [];
                _.each(_this.textbooksCollection.models, function(el, ind) {
                  return textbooks.push({
                    'name': el.get('name'),
                    'id': el.get('term_id')
                  });
                });
                return textbooks;
              };
            })(this)
          }
        });
      };

      return ContentSelectionController;

    })(RegionController);
    DataContentTableView = (function(_super) {
      __extends(DataContentTableView, _super);

      function DataContentTableView() {
        this.onContentPieceRemoved = __bind(this.onContentPieceRemoved, this);
        this.addContentPieces = __bind(this.addContentPieces, this);
        this.changeTextbooks = __bind(this.changeTextbooks, this);
        this.filterContentType = __bind(this.filterContentType, this);
        this.filterTableData = __bind(this.filterTableData, this);
        this.onShow = __bind(this.onShow, this);
        return DataContentTableView.__super__.constructor.apply(this, arguments);
      }

      DataContentTableView.prototype.template = contentSelectionTpl;

      DataContentTableView.prototype.className = 'tiles white grid simple vertical green';

      DataContentTableView.prototype.events = {
        'change #check_all_div': 'checkAll',
        'change .filters': 'filterTableData',
        'change #textbooks-filter': 'changeTextbooks',
        'change #chapters-filter': function(e) {
          return this.trigger("fetch:sections:subsections", $(e.target).val());
        },
        'click #add-content-pieces': 'addContentPieces'
      };

      DataContentTableView.prototype.serializeData = function() {
        var data;
        data = DataContentTableView.__super__.serializeData.call(this);
        data.tableData = Marionette.getOption(this, 'tableConfig');
        return data;
      };

      DataContentTableView.prototype.onShow = function() {
        this.makeDataTable(this.collection.models, Marionette.getOption(this, 'tableConfig'));
        return $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
      };

      DataContentTableView.prototype.makeRow = function(item, index, tableData) {
        var row, td_ID;
        td_ID = 'id';
        if (tableData.idAttribute) {
          td_ID = tableData.idAttribute;
        }
        row = '<tr id="row_' + item.get(td_ID) + '">';
        if (tableData.selectbox) {
          row += '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="' + item.get(td_ID) + '" id="checkbox' + index + '"> <label for="checkbox' + index + '"></label> </div> </td>';
        }
        _.each(tableData.data, function(el, ind) {
          var el_value, slug;
          if (el.value) {
            el_value = item.get(el.value);
          } else {
            slug = _.str.underscored(el.label);
            el_value = item.get(slug);
          }
          if (el.dateField) {
            el_value = moment(el_value).format("Do MMM YYYY");
          }
          return row += '<td> ' + el_value + ' </td>';
        });
        row += '</tr>';
        return row;
      };

      DataContentTableView.prototype.makeDataTable = function(dataCollection, tableData) {
        var colspan, pagerDiv, pagerOptions;
        this.$el.find('#dataContentTable tbody').empty();
        _.each(dataCollection, (function(_this) {
          return function(item, index) {
            var row;
            row = _this.makeRow(item, index, tableData);
            return _this.$el.find('#dataContentTable tbody').append(row);
          };
        })(this));
        if (_.size(dataCollection) === 0) {
          colspan = _.size(tableData.data);
          if (tableData.selectbox) {
            colspan++;
          }
          this.$el.find('#dataContentTable tbody').append('<td id="empty_row" colspan="' + colspan + '">No Data found</td>');
        }
        $('#dataContentTable').tablesorter();
        if (tableData.pagination) {
          $("#dataContentTable").trigger("updateCache");
          this.$el.find('#pager').remove();
          pagerDiv = '<div id="pager" class="pager"> <i class="fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div>';
          this.$el.find('#dataContentTable').after(pagerDiv);
          pagerOptions = {
            totalRows: _.size(dataCollection),
            container: $(".pager"),
            output: '{startRow} to {endRow} of {totalRows}'
          };
          return $('#dataContentTable').tablesorterPager(pagerOptions);
        }
      };

      DataContentTableView.prototype.checkAll = function() {
        if (this.$el.find('#check_all').is(':checked')) {
          return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
        }
      };

      DataContentTableView.prototype.filterTableData = function(e) {
        var content_type, filter_ids, filtered_data, filtered_models;
        filter_ids = _.map(this.$el.find('select.textbook-filter'), function(ele, index) {
          var item;
          item = '';
          if (!isNaN(ele.value)) {
            item = ele.value;
          }
          return item;
        });
        filter_ids = _.compact(filter_ids);
        content_type = this.$el.find('#content-type-filter').val();
        filtered_models = this.collection.models;
        if (content_type !== '') {
          filtered_models = this.collection.where({
            'content_type': content_type
          });
        }
        if (_.size(filter_ids) > 0) {
          filtered_data = _.filter(filtered_models, (function(_this) {
            return function(item) {
              var filtered_item, term_ids;
              filtered_item = '';
              term_ids = _.flatten(item.get('term_ids'));
              if (_.size(_.intersection(term_ids, filter_ids)) === _.size(filter_ids)) {
                filtered_item = item;
              }
              return filtered_item;
            };
          })(this));
        } else {
          filtered_data = filtered_models;
        }
        return this.makeDataTable(filtered_data, Marionette.getOption(this, 'tableConfig'));
      };

      DataContentTableView.prototype.filterContentType = function(e) {
        var content_type, filtered_data;
        content_type = $(e.target).val();
        if (content_type) {
          filtered_data = this.collection.where({
            'content_type': content_type
          });
        } else {
          filtered_data = this.collection.models;
        }
        return this.makeDataTable(filtered_data, Marionette.getOption(this, 'tableConfig'));
      };

      DataContentTableView.prototype.changeTextbooks = function(e) {
        this.$el.find('#chapters-filter, #sections-filter, #subsections-filter').select2('data', '');
        return this.trigger("fetch:chapters", $(e.target).val());
      };

      DataContentTableView.prototype.onFetchChaptersComplete = function(chapters) {
        if (_.size(chapters) > 0) {
          $('#chapters-filter').select2('data', {
            'text': 'Select Chapter'
          });
          return _.each(chapters.models, (function(_this) {
            return function(chap, index) {
              return _this.$el.find('#chapters-filter').append('<option value="' + chap.get('term_id') + '">' + chap.get('name') + '</option>');
            };
          })(this));
        } else {
          this.$el.find('#chapters-filter,#sections-filter,#subsections-filter').html('');
          this.$el.find('#chapters-filter').select2('data', {
            'text': 'No chapters'
          });
          this.$el.find('#sections-filter').select2('data', {
            'text': 'No Sections'
          });
          return this.$el.find('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          });
        }
      };

      DataContentTableView.prototype.onFetchSubsectionsComplete = function(allsections) {
        if (_.size(allsections) > 0) {
          if (_.size(allsections.sections) > 0) {
            $('#sections-filter').select2('data', {
              'text': 'Select Section'
            });
            _.each(allsections.sections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#sections-filter').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            $('#sections-filter').select2('data', {
              'text': 'No Sections'
            }).html('');
          }
          if (_.size(allsections.subsections) > 0) {
            $('#subsections-filter').select2('data', {
              'text': 'Select SubSection'
            });
            return _.each(allsections.subsections, (function(_this) {
              return function(section, index) {
                return _this.$el.find('#subsections-filter').append('<option value="' + section.get('term_id') + '">' + section.get('name') + '</option>');
              };
            })(this));
          } else {
            return $('#subsections-filter').select2('data', {
              'text': 'No Subsections'
            }).html('');
          }
        } else {
          $('#sections-filter,#subsections-filter').html('');
          $('#sections-filter').select2('data', {
            'text': 'No Sections'
          });
          return $('#subsections-filter').select2('data', {
            'text': 'No Subsections'
          });
        }
      };

      DataContentTableView.prototype.addContentPieces = function() {
        var colspan, content_id, content_pieces, tableData, _i, _len, _results;
        content_pieces = _.pluck($('#dataContentTable .tab_checkbox:checked'), 'value');
        if (content_pieces) {
          this.trigger("add:content:pieces", content_pieces);
          _results = [];
          for (_i = 0, _len = content_pieces.length; _i < _len; _i++) {
            content_id = content_pieces[_i];
            this.$el.find("#dataContentTable tr#row_" + content_id).remove();
            tableData = Marionette.getOption(this, 'tableConfig');
            if (_.size(this.$el.find("#dataContentTable tbody tr")) === 0) {
              colspan = _.size(tableData.data);
              if (tableData.selectbox) {
                colspan++;
              }
              this.$el.find('#dataContentTable tbody').append('<td id="empty_row" colspan="' + colspan + '">No Data found</td>');
            }
            _results.push(this.$el.find("#dataContentTable").trigger('update').trigger("updateCache"));
          }
          return _results;
        }
      };

      DataContentTableView.prototype.onContentPieceRemoved = function(model) {
        var $row, row, row_index, tableData;
        this.$el.find('#empty_row').remove();
        tableData = Marionette.getOption(this, 'tableConfig');
        row_index = _.size(this.$el.find("#dataContentTable tbody tr"));
        row = this.makeRow(model, row_index, tableData);
        $row = $(row);
        this.$el.find('#dataContentTable tbody').append($row);
        return this.$el.find("#dataContentTable").trigger('addRows', [$row, true]).trigger("updateCache");
      };

      return DataContentTableView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:content:selectionapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ContentSelectionController(opt);
    });
  });
});
