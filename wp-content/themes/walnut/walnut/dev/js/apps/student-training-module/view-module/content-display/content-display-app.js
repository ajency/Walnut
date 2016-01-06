var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/student-training-module/view-module/content-display/templates/content-display-item.html'], function(App, RegionController, contentDisplayItemTpl) {
  return App.module("StudentTrainingApp.Controller", function(Controller, App) {
    var ContentDisplayView, ContentItemView;
    Controller.CollectionContentDisplayController = (function(superClass) {
      extend(CollectionContentDisplayController, superClass);

      function CollectionContentDisplayController() {
        this._getCollectionContentDisplayView = bind(this._getCollectionContentDisplayView, this);
        return CollectionContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionContentDisplayController.prototype.initialize = function(opts) {
        var groupContentCollection, model, questionResponseCollection, view;
        model = opts.model, questionResponseCollection = opts.questionResponseCollection, groupContentCollection = opts.groupContentCollection, this.studentCollection = opts.studentCollection;
        this.mode = 'training';
        this.view = view = this._getCollectionContentDisplayView(model, groupContentCollection, questionResponseCollection);
        this.show(view, {
          loading: true,
          entities: [groupContentCollection, questionResponseCollection]
        });
        return this.listenTo(this.view, 'view:item', (function(_this) {
          return function(data) {
            return _this.region.trigger('goto:item', data);
          };
        })(this));
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function(model, collection, responseCollection) {
        return new ContentDisplayView({
          model: model,
          collection: collection,
          responseCollection: responseCollection,
          studentCollection: this.studentCollection,
          mode: this.mode
        });
      };

      return CollectionContentDisplayController;

    })(RegionController);
    ContentItemView = (function(superClass) {
      extend(ContentItemView, superClass);

      function ContentItemView() {
        return ContentItemView.__super__.constructor.apply(this, arguments);
      }

      ContentItemView.prototype.template = contentDisplayItemTpl;

      ContentItemView.prototype.tagName = 'li';

      ContentItemView.prototype.className = '';

      ContentItemView.prototype.mixinTemplateHelpers = function(data) {
        var additionalData;
        data.isContentPiece = data.post_type === 'content-piece' ? true : false;
        additionalData = Marionette.getOption(this, 'additionalData');
        data.dateCompleted = additionalData.dateCompleted;
        if (data.question_type === 'multiple_eval') {
          data.question_type = 'multiple Evaluation';
        }
        data.question_type = _.str.capitalize(data.question_type);
        if (additionalData.responseStatus) {
          data.responseStatus = additionalData.responseStatus;
          data.timeTaken = additionalData.timeTaken;
          data.correctAnswer = additionalData.correctAnswer;
          data.teacherName = additionalData.teacherName;
        }
        return data;
      };

      ContentItemView.prototype.onShow = function() {
        var content_icon;
        content_icon = 'fa-question';
        if (this.model.get('content_type' === 'content_piece')) {
          content_icon = 'fa-youtube-play';
        }
        this.$el.find('.cbp_tmicon .fa').addClass(content_icon);
        if (this.model.get('content_type') === 'content_piece') {
          return this.$el.find('#correct-answer-div, .question-type-div').remove();
        }
      };

      return ContentItemView;

    })(Marionette.ItemView);
    ContentDisplayView = (function(superClass) {
      extend(ContentDisplayView, superClass);

      function ContentDisplayView() {
        this.viewItem = bind(this.viewItem, this);
        this.getResults = bind(this.getResults, this);
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = '<div id="myCanvas-miki" class="col-md-10"><ul class="cbp_tmtimeline"></ul></div>';

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.itemViewOptions = function(model, index) {
        var additionalData, data, i, len, responseCollection, responseModel, responseModelArray;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        responseModelArray = responseCollection.where({
          "content_piece_id": model.get('ID')
        });
        for (i = 0, len = responseModelArray.length; i < len; i++) {
          responseModel = responseModelArray[i];
          responseModel = responseModel;
        }
        additionalData = {};
        additionalData.dateCompleted = 'N/A';
        if (responseModel) {
          if (responseModel.get('status') === 'completed') {
            additionalData.responseStatus = responseModel.get('status');
            additionalData.timeTaken = $.timeMinSecs(responseModel.get('time_taken'));
            additionalData.dateCompleted = moment(responseModel.get('end_date')).format("Do MMM YYYY");
            additionalData.correctAnswer = this.getResults(model, responseModel.get('question_response'));
            additionalData.teacherName = responseModel.get('teacher_name');
          }
        }
        return data = {
          model: model,
          additionalData: additionalData
        };
      };

      ContentDisplayView.prototype.getResults = function(model, question_response) {
        var ans, answeredCorrectly, correct_answer, i, j, len, len1, name, names, studID, studentCollection, student_names;
        correct_answer = 'No One';
        names = [];
        studentCollection = Marionette.getOption(this, 'studentCollection');
        if (model.get('question_type') === 'chorus') {
          if (question_response) {
            correct_answer = CHORUS_OPTIONS[question_response];
          }
        } else if (model.get('question_type') === 'individual') {
          for (i = 0, len = question_response.length; i < len; i++) {
            studID = question_response[i];
            answeredCorrectly = studentCollection.where({
              "ID": studID
            });
            for (j = 0, len1 = answeredCorrectly.length; j < len1; j++) {
              ans = answeredCorrectly[j];
              name = ans.get('display_name');
            }
            names.push(name);
          }
          if (_.size(names) > 0) {
            student_names = names.join(', ');
            correct_answer = _.size(names) + ' Students (' + student_names + ')';
          }
        } else {
          correct_answer = _.size(_.pluck(question_response, 'id')) + ' Students';
        }
        return correct_answer;
      };

      ContentDisplayView.prototype.events = {
        'click .cbp_tmlabel.completed': 'viewItem'
      };

      ContentDisplayView.prototype.onShow = function() {
        var completedResponses, i, j, len, len1, question, ref, ref1, responseCollection, responseQuestionIDs, results, results1;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        completedResponses = responseCollection.where({
          'status': 'completed'
        });
        responseQuestionIDs = _.chain(completedResponses).map(function(m) {
          return m.toJSON();
        }).pluck('content_piece_id').value();
        if (Marionette.getOption(this, 'mode') === 'training') {
          ref = this.$el.find('.contentPiece');
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            question = ref[i];
            results.push($(question).find('.cbp_tmlabel').addClass('completed').css('cursor', 'pointer'));
          }
          return results;
        } else {
          ref1 = this.$el.find('.contentPiece');
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            question = ref1[j];
            if (_.contains(responseQuestionIDs, parseInt($(question).attr('data-id')))) {
              results1.push($(question).find('.cbp_tmlabel').addClass('done completed').css('cursor', 'pointer'));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }
      };

      ContentDisplayView.prototype.viewItem = function(e) {
        var itemID, itemType;
        itemID = $(e.target).closest('.contentPiece').attr('data-id');
        itemType = $(e.target).closest('.contentPiece').attr('data-type');
        return this.trigger("view:item", {
          id: itemID,
          type: itemType
        });
      };

      return ContentDisplayView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:student:training:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionContentDisplayController(opt);
    });
  });
});
