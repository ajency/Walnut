var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.Controller.Views", function(Views, App, Backbone, Marionette, $, _) {
    Views.AllContentController = (function(_super) {
      var DataContentItemView, DataContentTableView, NoDataItemView;

      __extends(AllContentController, _super);

      function AllContentController() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        this.contentPieceRemoved = __bind(this.contentPieceRemoved, this);
        return AllContentController.__super__.constructor.apply(this, arguments);
      }

      AllContentController.prototype.initialize = function(opts) {
        var view;
        this.contentPiecesCollection = opts.contentPiecesCollection, this.model = opts.model, this.textbooksCollection = opts.textbooksCollection, this.contentGroupCollection = opts.contentGroupCollection;
        this.view = view = this._getContentSelectionView(this.contentPiecesCollection);
        this.show(this.view, {
          loading: true
        });
        this.listenTo(this.view, {
          "add:content:pieces": (function(_this) {
            return function(contentIDs) {
              return _.each(contentIDs, function(ele, index) {
                _this.contentGroupCollection.add(_this.contentPiecesCollection.get(ele));
                return _this.contentPiecesCollection.remove(ele);
              });
            };
          })(this)
        });
        return this.listenTo(this.contentGroupCollection, 'content:pieces:of:group:removed', this.contentPieceRemoved);
      };

      AllContentController.prototype.contentPieceRemoved = function(model) {
        this.contentPiecesCollection.add(model);
        return this.view.triggerMethod("content:piece:removed", model);
      };

      AllContentController.prototype._getContentSelectionView = function(collection) {
        return new DataContentTableView({
          collection: collection,
          fullCollection: collection.clone(),
          contentGroupModel: this.model,
          textbooksCollection: this.textbooksCollection
        });
      };

      DataContentItemView = (function(_super1) {
        __extends(DataContentItemView, _super1);

        function DataContentItemView() {
          return DataContentItemView.__super__.constructor.apply(this, arguments);
        }

        DataContentItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}"> <label for="checkbox{{ID}}"></label> </div> </td> <td class="cpHeight">{{&post_excerpt}}</td> <td>{{content_type_str}}</td> <td class="cpHeight"> {{&present_in_str}} </td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>';

        DataContentItemView.prototype.tagName = 'tr';

        DataContentItemView.prototype.serializeData = function() {
          var data, modules;
          data = DataContentItemView.__super__.serializeData.call(this);
          data.modified_date = moment(data.post_modified).format("Do MMM YYYY");
          data.sort_date = moment(data.post_modified).format("YYYYMMDD");
          data.content_type_str = _(data.content_type).chain().humanize().titleize().value();
          modules = [];
          _.each(data.present_in_modules, function(ele, index) {
            return modules.push("<a target='_blank' href='#view-group/" + ele.id + "'>" + ele.name + "</a>");
          });
          data.present_in_str = _.size(modules) > 0 ? _.toSentence(modules) : 'Not added to a module yet';
          return data;
        };

        return DataContentItemView;

      })(Marionette.ItemView);

      NoDataItemView = (function(_super1) {
        __extends(NoDataItemView, _super1);

        function NoDataItemView() {
          return NoDataItemView.__super__.constructor.apply(this, arguments);
        }

        NoDataItemView.prototype.template = 'No Content Available';

        NoDataItemView.prototype.tagName = 'td';

        NoDataItemView.prototype.onShow = function() {
          return this.$el.attr('colspan', 5);
        };

        return NoDataItemView;

      })(Marionette.ItemView);

      DataContentTableView = (function(_super1) {
        __extends(DataContentTableView, _super1);

        function DataContentTableView() {
          this.onContentPieceRemoved = __bind(this.onContentPieceRemoved, this);
          this.addContentPieces = __bind(this.addContentPieces, this);
          return DataContentTableView.__super__.constructor.apply(this, arguments);
        }

        DataContentTableView.prototype.template = contentSelectionTpl;

        DataContentTableView.prototype.emptyView = NoDataItemView;

        DataContentTableView.prototype.itemView = DataContentItemView;

        DataContentTableView.prototype.itemViewContainer = '#dataContentTable tbody';

        DataContentTableView.prototype.events = {
          'change .filters': function(e) {
            return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          },
          'change #check_all_div': 'checkAll',
          'click #add-content-pieces': 'addContentPieces'
        };

        DataContentTableView.prototype.onShow = function() {
          var term_ids, textbookFiltersHTML;
          this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
          this.fullCollection = Marionette.getOption(this, 'fullCollection');
          textbookFiltersHTML = $.showTextbookFilters({
            textbooks: this.textbooksCollection
          });
          this.$el.find('#textbook-filters').html(textbookFiltersHTML);
          $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
          $('#dataContentTable').tablesorter();
          this.contentGroupModel = Marionette.getOption(this, 'contentGroupModel');
          term_ids = this.contentGroupModel.get('term_ids');
          $("#textbooks-filter").select2().select2('val', term_ids['textbook']);
          return this.setFilteredContent();
        };

        DataContentTableView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType, currItem) {
          switch (filterType) {
            case 'textbooks-filter':
              $.populateChapters(filteredCollection, this.$el, currItem);
              break;
            case 'chapters-filter':
              $.populateSections(filteredCollection, this.$el, currItem);
              break;
            case 'sections-filter':
              $.populateSubSections(filteredCollection, this.$el, currItem);
          }
          return this.setFilteredContent();
        };

        DataContentTableView.prototype.setFilteredContent = function() {
          var filtered_data, pagerOptions;
          filtered_data = $.filterTableByTextbooks(this);
          this.collection.set(filtered_data);
          $("#dataContentTable").trigger("updateCache");
          pagerOptions = {
            container: $(".pager"),
            output: '{startRow} to {endRow} of {totalRows}'
          };
          return $('#dataContentTable').tablesorterPager(pagerOptions);
        };

        DataContentTableView.prototype.checkAll = function() {
          if (this.$el.find('#check_all').is(':checked')) {
            return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
          } else {
            return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
          }
        };

        DataContentTableView.prototype.addContentPieces = function() {
          var content_pieces, id, _i, _len, _results;
          content_pieces = _.pluck(this.$el.find('#dataContentTable .tab_checkbox:checked'), 'value');
          if (content_pieces) {
            this.trigger("add:content:pieces", content_pieces);
            _results = [];
            for (_i = 0, _len = content_pieces.length; _i < _len; _i++) {
              id = content_pieces[_i];
              _results.push(this.fullCollection.remove(id));
            }
            return _results;
          }
        };

        DataContentTableView.prototype.onContentPieceRemoved = function(model) {
          return this.fullCollection.add(model);
        };

        return DataContentTableView;

      })(Marionette.CompositeView);

      return AllContentController;

    })(RegionController);
    return App.commands.setHandler("show:all:content:selection:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Views.AllContentController(opt);
    });
  });
});
