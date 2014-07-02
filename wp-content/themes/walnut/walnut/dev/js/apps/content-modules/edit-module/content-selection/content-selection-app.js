var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.Controller", function(Controller, App) {
    var DataContentItemView, DataContentTableView, NoDataItemView;
    Controller.ContentSelectionController = (function(_super) {
      __extends(ContentSelectionController, _super);

      function ContentSelectionController() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        this.contentPieceRemoved = __bind(this.contentPieceRemoved, this);
        return ContentSelectionController.__super__.constructor.apply(this, arguments);
      }

      ContentSelectionController.prototype.initialize = function(opts) {
        this.textbooksCollection = App.request("get:textbooks");
        this.contentPiecesCollection = App.request("get:content:pieces", {
          post_status: 'publish',
          content_type: ['teacher_question', 'content_piece']
        });
        this.model = opts.model, this.contentGroupCollection = opts.contentGroupCollection;
        return App.execute("when:fetched", [this.contentPiecesCollection, this.contentGroupCollection, this.textbooksCollection], (function(_this) {
          return function() {
            var model, view, _i, _len, _ref;
            _ref = _this.contentGroupCollection.models;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              model = _ref[_i];
              _this.contentPiecesCollection.remove(model);
            }
            _this.view = view = _this._getContentSelectionView(_this.contentPiecesCollection);
            _this.show(_this.view, {
              loading: true
            });
            _this.listenTo(_this.view, "fetch:chapters:or:sections", function(parentID, filterType) {
              var chaptersOrSections;
              chaptersOrSections = App.request("get:chapters", {
                'parent': parentID
              });
              return App.execute("when:fetched", chaptersOrSections, function() {
                return _this.view.triggerMethod("fetch:chapters:or:sections:completed", chaptersOrSections, filterType);
              });
            });
            _this.listenTo(_this.view, {
              "add:content:pieces": function(contentIDs) {
                return _.each(contentIDs, function(ele, index) {
                  _this.contentGroupCollection.add(_this.contentPiecesCollection.get(ele));
                  return _this.contentPiecesCollection.remove(ele);
                });
              }
            });
            return _this.listenTo(_this.contentGroupCollection, 'content:pieces:of:group:removed', _this.contentPieceRemoved);
          };
        })(this));
      };

      ContentSelectionController.prototype.contentPieceRemoved = function(model) {
        this.contentPiecesCollection.add(model);
        return this.view.triggerMethod("content:piece:removed", model);
      };

      ContentSelectionController.prototype._getContentSelectionView = function(collection) {
        return new DataContentTableView({
          collection: collection,
          fullCollection: collection.clone(),
          contentGroupModel: this.model,
          textbooksCollection: this.textbooksCollection
        });
      };

      return ContentSelectionController;

    })(RegionController);
    DataContentItemView = (function(_super) {
      __extends(DataContentItemView, _super);

      function DataContentItemView() {
        return DataContentItemView.__super__.constructor.apply(this, arguments);
      }

      DataContentItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}"> <label for="checkbox{{ID}}"></label> </div> </td> <td>{{post_excerpt}}</td> <td>{{post_author_name}}</td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>';

      DataContentItemView.prototype.tagName = 'tr';

      DataContentItemView.prototype.serializeData = function() {
        var data;
        data = DataContentItemView.__super__.serializeData.call(this);
        data.modified_date = moment(data.post_modified).format("Do MMM YYYY");
        data.sort_date = moment(data.post_modified).format("YYYYMMDD");
        return data;
      };

      return DataContentItemView;

    })(Marionette.ItemView);
    NoDataItemView = (function(_super) {
      __extends(NoDataItemView, _super);

      function NoDataItemView() {
        return NoDataItemView.__super__.constructor.apply(this, arguments);
      }

      NoDataItemView.prototype.template = 'No Content Available';

      NoDataItemView.prototype.tagName = 'td';

      NoDataItemView.prototype.onShow = function() {
        return this.$el.attr('colspan', 4);
      };

      return NoDataItemView;

    })(Marionette.ItemView);
    DataContentTableView = (function(_super) {
      __extends(DataContentTableView, _super);

      function DataContentTableView() {
        this.onContentPieceRemoved = __bind(this.onContentPieceRemoved, this);
        this.addContentPieces = __bind(this.addContentPieces, this);
        return DataContentTableView.__super__.constructor.apply(this, arguments);
      }

      DataContentTableView.prototype.template = contentSelectionTpl;

      DataContentTableView.prototype.className = 'tiles white grid simple vertical green';

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
        var pagerOptions, textbookFiltersHTML;
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        textbookFiltersHTML = $.showTextbookFilters(this.textbooksCollection);
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        $("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter, #content-type-filter").select2();
        $('#dataContentTable').tablesorter();
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return $('#dataContentTable').tablesorterPager(pagerOptions);
      };

      DataContentTableView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
        var filtered_data, pagerOptions;
        switch (filterType) {
          case 'textbooks-filter':
            $.populateChapters(filteredCollection, this.$el);
            break;
          case 'chapters-filter':
            $.populateSections(filteredCollection, this.$el);
            break;
          case 'sections-filter':
            $.populateSubSections(filteredCollection, this.$el);
        }
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
    return App.commands.setHandler("show:content:selectionapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.ContentSelectionController(opt);
    });
  });
});
