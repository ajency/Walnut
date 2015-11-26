var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('ContentSelectionApp.AddQuiz', function(AddQuiz, App) {
    var EmptyView, QuizIView, QuizView;
    AddQuiz.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._showView = __bind(this._showView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        var model, quizCollection, termIds, textbookNames;
        this.contentGroupCollection = options.contentGroupCollection, this.selectedFilterParamsObject = options.selectedFilterParamsObject, model = options.model;
        termIds = model.get('term_ids');
        quizCollection = App.request("get:quizes", {
          'textbook': this._getTextbookIDParam(termIds)
        });
        textbookNames = App.request("get:textbook:names:by:ids", _.compact(_.flatten(termIds)));
        return App.execute("when:fetched", [textbookNames, quizCollection], (function(_this) {
          return function() {
            return _this._showView(textbookNames, quizCollection);
          };
        })(this));
      };

      Controller.prototype._getTextbookIDParam = function(termIds) {
        var textbookid;
        textbookid = termIds.textbook;
        if (termIds.chapter) {
          textbookid = termIds.chapter;
        }
        if (!_.isEmpty(_.compact(termIds.sections))) {
          textbookid = _.last(termIds.sections);
        }
        if (!_.isEmpty(_.compact(termIds.subsections))) {
          textbookid = _.last(termIds.subsections);
        }
        return textbookid;
      };

      Controller.prototype._showView = function(textbookNames, quizCollection) {
        this.view = this._getView(quizCollection, textbookNames);
        this.show(this.view);
        return this.listenTo(this.view, 'add:quizzes', (function(_this) {
          return function(quizIds) {
            return _.each(quizIds, function(qid) {
              _this.contentGroupCollection.add(quizCollection.get(qid));
              return quizCollection.remove(qid);
            });
          };
        })(this));
      };

      Controller.prototype._getView = function(quizCollection, textbookNames) {
        return new QuizView({
          collection: quizCollection,
          textbookNames: textbookNames
        });
      };

      return Controller;

    })(RegionController);
    QuizIView = (function(_super) {
      __extends(QuizIView, _super);

      function QuizIView() {
        return QuizIView.__super__.constructor.apply(this, arguments);
      }

      QuizIView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{name}}</td> <td>{{quiz_type}}</td> <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td>{{duration}} mins</td> <td>{{marks}}</td> <td>{{modified_date}}</td>';

      QuizIView.prototype.tagName = 'tr';

      QuizIView.prototype.mixinTemplateHelpers = function(data) {
        var textbookNames;
        textbookNames = Marionette.getOption(this, 'textbookNames');
        data.textbookName = textbookNames.findWhere({
          'id': data.term_ids.textbook
        }).get('name');
        data.chapterName = textbookNames.findWhere({
          'id': data.term_ids.chapter
        }).get('name');
        data.quiz_type = this.model.getQuizTypeLabel();
        data.modified_date = moment(data.last_modified_on).format("Do MMM YYYY");
        return data;
      };

      return QuizIView;

    })(Marionette.ItemView);
    EmptyView = (function(_super) {
      __extends(EmptyView, _super);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        return this.$el.attr('colspan', 8);
      };

      return EmptyView;

    })(Marionette.ItemView);
    QuizView = (function(_super) {
      __extends(QuizView, _super);

      function QuizView() {
        this.onQuizRemoved = __bind(this.onQuizRemoved, this);
        this.addQuiz = __bind(this.addQuiz, this);
        return QuizView.__super__.constructor.apply(this, arguments);
      }

      QuizView.prototype.template = ' <div class="row"> <div class="col-md-12"> <table class="table table-bordered"> <thead class="cf"> <tr> <th><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;"> <input id="check_all" type="checkbox"> <label for="check_all"></label> </div></th> <th>Name</th> <th>Type</th> <th>Textbook</th> <th>Chapter</th> <th>Duration</th> <th>Marks</th> <th>Last Modified</th> </tr> </thead> <tbody></tbody> </table><div id="pager" class="pager"> <i class="cursor fa fa-chevron-left prev"></i> <span style="padding:0 15px"  class="pagedisplay"></span> <i class="cursor fa fa-chevron-right next"></i> <select class="pagesize"> <option selected value="10">10</option> <option value="25">25</option> <option value="50">50</option> <option value="100">100</option> </select> </div> <button type="button" class="btn btn-success btn-cons2" id="add-quiz-button"><i class="fa fa-plus"></i> Add</button> </div> </div>';

      QuizView.prototype.itemView = QuizIView;

      QuizView.prototype.emptyView = EmptyView;

      QuizView.prototype.itemViewContainer = 'table tbody';

      QuizView.prototype.itemViewOptions = function() {
        return {
          textbookNames: Marionette.getOption(this, 'textbookNames')
        };
      };

      QuizView.prototype.className = 'row';

      QuizView.prototype.events = function() {
        return {
          'change #check_all_div': 'checkAll',
          'click #add-quiz-button': 'addQuiz'
        };
      };

      QuizView.prototype.onShow = function() {
        var pagerOptions;
        this.$el.find("table").tablesorter();
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("table").tablesorterPager(pagerOptions);
      };

      QuizView.prototype.checkAll = function() {
        if (this.$el.find('#check_all').is(':checked')) {
          return this.$el.find('table .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          return this.$el.find('table .tab_checkbox').removeAttr('checked');
        }
      };

      QuizView.prototype.addQuiz = function() {
        var quizIds;
        quizIds = _.pluck(this.$el.find('table .tab_checkbox:checked'), 'value');
        console.log(quizIds);
        if (quizIds) {
          this.trigger("add:quizzes", quizIds);
          return this.onUpdatePager();
        }
      };

      QuizView.prototype.onQuizRemoved = function(model) {
        this.fullCollection.add(model);
        return this.onUpdatePager();
      };

      QuizView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("table").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("table").tablesorterPager(pagerOptions);
      };

      return QuizView;

    })(Marionette.CompositeView);
    return App.commands.setHandler('show:add:quiz:app', function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new AddQuiz.Controller(opt);
    });
  });
});
