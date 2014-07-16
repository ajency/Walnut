var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/quiz-modules/edit-quiz/content-selection/templates/content-selection.html'], function(App, contentSelectionTmpl) {
  return App.module('QuizModuleApp.EditQuiz.QuizContentSelection.Views', function(Views, App) {
    var DataContentItemView, NoDataItemView;
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
    return Views.DataContentTableView = (function(_super) {
      __extends(DataContentTableView, _super);

      function DataContentTableView() {
        this._addContentPieces = __bind(this._addContentPieces, this);
        this._onSpinEditValueChanged = __bind(this._onSpinEditValueChanged, this);
        this.onAfterItemAdded = __bind(this.onAfterItemAdded, this);
        return DataContentTableView.__super__.constructor.apply(this, arguments);
      }

      DataContentTableView.prototype.template = contentSelectionTmpl;

      DataContentTableView.prototype.className = 'tiles grey grid simple vertical blue animated slideInRight';

      DataContentTableView.prototype.emptyView = NoDataItemView;

      DataContentTableView.prototype.itemView = DataContentItemView;

      DataContentTableView.prototype.itemViewContainer = '#dataContentTable tbody';

      DataContentTableView.prototype.events = function() {
        return {
          'change .filters': function(e) {
            return this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          },
          'click #addContent a': function(e) {
            e.preventDefault();
            return $(e.target).tab('show');
          },
          'change #check_all': 'checkAll',
          'change .level-selection input': '_onSpinEditValueChanged',
          'click #add-set-button': '_addSet',
          'click #add-content-pieces': '_addContentPieces',
          'change #selectAll': '_selectAllForSet'
        };
      };

      DataContentTableView.prototype.initialize = function() {
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        return this.fullCollection = Marionette.getOption(this, 'fullCollection');
      };

      DataContentTableView.prototype.onShow = function() {
        var textbookFiltersHTML;
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find("#textbooks-filter, #chapters-filter, #sections-filter, #subsections-filter").select2();
        this.$el.find('#dataContentTable').tablesorter();
        this._setLevelCount();
        return this._updatePager();
      };

      DataContentTableView.prototype.onAfterItemAdded = function(options) {
        this.fullCollection.add(options.model);
        this.$el.find("#dataContentTable").trigger("updateCache");
        return this._updatePager();
      };

      DataContentTableView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType, currItem) {
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
        return this.setFilteredContent();
      };

      DataContentTableView.prototype.setFilteredContent = function() {
        var filtered_data;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        this._setLevelCount();
        this.$el.find('#selectAll').prop('checked', false);
        this.$el.find("#dataContentTable").trigger("updateCache");
        return this._updatePager();
      };

      DataContentTableView.prototype._setLevelCount = function() {
        var count, i, levelCount, _i, _ref, _results;
        levelCount = this.collection.countBy('difficulty_level');
        console.log(levelCount);
        _results = [];
        for (i = _i = 1; _i <= 3; i = ++_i) {
          count = (_ref = levelCount["" + i]) != null ? _ref : 0;
          this.$el.find("#lvl" + i).find(" input, .spinedit").remove();
          this.$el.find("#lvl" + i).append("<input type='text'  />");
          this.$el.find("#lvl" + i + " input").spinedit({
            minimum: 0,
            maximum: count,
            value: 0
          });
          _results.push(this.$el.find("#lvl" + i + " span").text(count));
        }
        return _results;
      };

      DataContentTableView.prototype._onSpinEditValueChanged = function() {
        var total;
        total = 0;
        _.each(this.$el.find(".level-selection input.spinedit"), function(num) {
          return total += parseInt($(num).val());
        });
        console.log(total);
        return this.$el.find('#total-questions').val(total);
      };

      DataContentTableView.prototype._updatePager = function() {
        var pagerOptions;
        console.log('update pager');
        pagerOptions = {
          container: $(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find('#dataContentTable').tablesorterPager(pagerOptions);
      };

      DataContentTableView.prototype._selectAllForSet = function(e) {
        var levelCount, _ref, _ref1, _ref2;
        if ($(e.target).is(':checked')) {
          levelCount = this.collection.countBy('difficulty_level');
          this.$el.find("#lvl1 input").val((_ref = levelCount["1"]) != null ? _ref : 0);
          this.$el.find("#lvl2 input").val((_ref1 = levelCount["2"]) != null ? _ref1 : 0);
          this.$el.find("#lvl3 input").val((_ref2 = levelCount["3"]) != null ? _ref2 : 0);
          return this._onSpinEditValueChanged();
        } else {
          this.$el.find("#lvl1 input").val(0);
          this.$el.find("#lvl2 input").val(0);
          this.$el.find("#lvl3 input").val(0);
          return this._onSpinEditValueChanged();
        }
      };

      DataContentTableView.prototype._addSet = function() {
        var data, terms_id;
        terms_id = {
          textbook: this.$el.find('#textbooks-filter').val(),
          chapter: this.$el.find('#chapters-filter').val(),
          section: this.$el.find('#sections-filter').val(),
          subsection: this.$el.find('#subsections-filter').val()
        };
        data = {
          terms_id: terms_id,
          textbook: this.$el.find('#textbooks-filter :selected').text(),
          chapter: this.$el.find('#chapters-filter :selected').text(),
          section: this.$el.find('#sections-filter :selected').text(),
          'sub-section': this.$el.find('#subsections-filter :selected').text(),
          lvl1: this.$el.find("#lvl1 input").val(),
          lvl2: this.$el.find("#lvl2 input").val(),
          lvl3: this.$el.find("#lvl3 input").val(),
          post_type: 'content_set'
        };
        _.each(['textbook', 'chapter', 'section', 'sub-section'], function(attr) {
          var x;
          console.log(data[attr]);
          x = _.slugify(data[attr]);
          if ((data[attr] == null) || data[attr] === '' || _.slugify(data[attr]) === _.slugify("All " + attr + "s")) {
            return data[attr] = "ALL";
          }
        });
        this.trigger("add:new:set", data);
        this.$el.find("#addSet input[type='text']").val(0);
        return this.$el.find('#selectAll').prop('checked', false);
      };

      DataContentTableView.prototype.checkAll = function(e) {
        if ($(e.target).is(':checked')) {
          console.log('dd');
          return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
        }
      };

      DataContentTableView.prototype._addContentPieces = function() {
        var content_pieces, id, _i, _len;
        content_pieces = _.pluck(this.$el.find('#dataContentTable .tab_checkbox:checked'), 'value');
        if (content_pieces) {
          this.trigger("add:content:pieces", content_pieces);
          for (_i = 0, _len = content_pieces.length; _i < _len; _i++) {
            id = content_pieces[_i];
            this.fullCollection.remove(id);
          }
          this.$el.find("#dataContentTable").trigger("updateCache");
          return this._updatePager();
        }
      };

      return DataContentTableView;

    })(Marionette.CompositeView);
  });
});
