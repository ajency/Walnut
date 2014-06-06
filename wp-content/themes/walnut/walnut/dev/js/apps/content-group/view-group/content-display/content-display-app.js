var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-group/view-group/content-display/templates/content-display.html', 'text!apps/content-group/view-group/content-display/templates/content-display-item.html'], function(App, RegionController, contentDisplayTpl, contentDisplayItemTpl) {
  return App.module("CollectionContentDisplayApp.Controller", function(Controller, App) {
    var ContentDisplayView, ContentItemView;
    Controller.CollectionContentDisplayController = (function(_super) {
      __extends(CollectionContentDisplayController, _super);

      function CollectionContentDisplayController() {
        this._getCollectionContentDisplayView = __bind(this._getCollectionContentDisplayView, this);
        return CollectionContentDisplayController.__super__.constructor.apply(this, arguments);
      }

      CollectionContentDisplayController.prototype.initialize = function(opts) {
        var groupContentCollection, model, questionResponseCollection, view;
        model = opts.model, this.mode = opts.mode, questionResponseCollection = opts.questionResponseCollection, groupContentCollection = opts.groupContentCollection, this.studentCollection = opts.studentCollection;
        this.view = view = this._getCollectionContentDisplayView(model, groupContentCollection, questionResponseCollection);
        this.show(view, {
          loading: true,
          entities: [groupContentCollection, questionResponseCollection]
        });
        return this.listenTo(this.view, 'view:question:readonly', (function(_this) {
          return function(questionID) {
            return _this.region.trigger('goto:question:readonly', questionID);
          };
        })(this));
      };

      CollectionContentDisplayController.prototype._getCollectionContentDisplayView = function(model, collection, responseCollection) {
        var timeTakenArray, totalTimeTakenForModule;
        timeTakenArray = responseCollection.pluck('time_taken');
        totalTimeTakenForModule = 0;
        if (_.size(timeTakenArray) > 0) {
          totalTimeTakenForModule = _.reduce(timeTakenArray, function(memo, num) {
            return parseInt(memo + parseInt(num));
          });
        }
        return new ContentDisplayView({
          model: model,
          collection: collection,
          responseCollection: responseCollection,
          studentCollection: this.studentCollection,
          mode: this.mode,
          templateHelpers: {
            showElapsedTime: (function(_this) {
              return function() {
                var display_time, hours, mins, seconds, time;
                hours = 0;
                time = totalTimeTakenForModule;
                mins = parseInt(totalTimeTakenForModule / 60);
                if (mins > 59) {
                  hours = parseInt(mins / 60);
                  mins = parseInt(mins % 60);
                }
                seconds = parseInt(time % 60);
                display_time = '';
                if (hours > 0) {
                  display_time = hours + 'h ';
                }
                display_time += mins + 'm ' + seconds + 's';
                return display_time;
              };
            })(this)
          }
        });
      };

      return CollectionContentDisplayController;

    })(RegionController);
    ContentItemView = (function(_super) {
      __extends(ContentItemView, _super);

      function ContentItemView() {
        return ContentItemView.__super__.constructor.apply(this, arguments);
      }

      ContentItemView.prototype.template = contentDisplayItemTpl;

      ContentItemView.prototype.tagName = 'li';

      ContentItemView.prototype.className = '';

      ContentItemView.prototype.mixinTemplateHelpers = function(data) {
        var additionalData;
        additionalData = Marionette.getOption(this, 'additionalData');
        data.dateCompleted = additionalData.dateCompleted;
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
        return this.$el.find('.cbp_tmicon .fa').addClass(content_icon);
      };

      return ContentItemView;

    })(Marionette.ItemView);
    ContentDisplayView = (function(_super) {
      __extends(ContentDisplayView, _super);

      function ContentDisplayView() {
        this.viewQuestionReadOnly = __bind(this.viewQuestionReadOnly, this);
        this.getResults = __bind(this.getResults, this);
        return ContentDisplayView.__super__.constructor.apply(this, arguments);
      }

      ContentDisplayView.prototype.template = contentDisplayTpl;

      ContentDisplayView.prototype.itemView = ContentItemView;

      ContentDisplayView.prototype.itemViewContainer = 'ul.cbp_tmtimeline';

      ContentDisplayView.prototype.itemViewOptions = function(model, index) {
        var additionalData, data, mins, responseCollection, responseModel, responseModelArray, seconds, time, _i, _len;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        responseModelArray = responseCollection.where({
          "content_piece_id": model.get('ID')
        });
        for (_i = 0, _len = responseModelArray.length; _i < _len; _i++) {
          responseModel = responseModelArray[_i];
          responseModel = responseModel;
        }
        additionalData = {};
        additionalData.dateCompleted = 'N/A';
        if (responseModel) {
          if (responseModel.get('status') === 'completed') {
            additionalData.responseStatus = responseModel.get('status');
            time = responseModel.get('time_taken');
            mins = parseInt(time / 60);
            if (mins > 59) {
              mins = parseInt(mins % 60);
            }
            seconds = parseInt(time % 60);
            additionalData.timeTaken = mins + 'm ' + seconds + 's';
            additionalData.dateCompleted = moment(responseModel.get('end_date')).format("Do MMM YYYY");
            additionalData.correctAnswer = this.getResults(model, responseModel.get('question_response'));
            additionalData.teacherName = responseModel.get('teacher_name');
          }
          console.log(additionalData);
        }
        return data = {
          model: model,
          additionalData: additionalData
        };
      };

      ContentDisplayView.prototype.getResults = function(model, question_response) {
        var ans, answeredCorrectly, correct_answer, name, names, studID, studentCollection, student_names, _i, _j, _len, _len1;
        correct_answer = 'No One';
        names = [];
        studentCollection = Marionette.getOption(this, 'studentCollection');
        if (model.get('question_type') === 'chorus') {
          if (question_response) {
            correct_answer = CHORUS_OPTIONS[question_response];
          }
        } else {
          for (_i = 0, _len = question_response.length; _i < _len; _i++) {
            studID = question_response[_i];
            answeredCorrectly = studentCollection.where({
              "ID": studID
            });
            for (_j = 0, _len1 = answeredCorrectly.length; _j < _len1; _j++) {
              ans = answeredCorrectly[_j];
              name = ans.get('display_name');
            }
            names.push(name);
          }
          if (_.size(names) > 0) {
            student_names = names.join(', ');
            correct_answer = _.size(names) + ' Students (' + student_names + ')';
          }
        }
        return correct_answer;
      };

      ContentDisplayView.prototype.events = {
        'click .cbp_tmlabel.completed': 'viewQuestionReadOnly'
      };

      ContentDisplayView.prototype.onShow = function() {
        var completedResponses, question, responseCollection, responseQuestionIDs, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
        responseCollection = Marionette.getOption(this, 'responseCollection');
        completedResponses = responseCollection.where({
          'status': 'completed'
        });
        responseQuestionIDs = _.chain(completedResponses).map(function(m) {
          return m.toJSON().pluck('content_piece_id').value();
        });
        if (Marionette.getOption(this, 'mode') === 'training') {
          _ref = this.$el.find('.contentPiece');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            question = _ref[_i];
            _results.push($(question).find('.cbp_tmlabel').addClass('completed').css('cursor', 'pointer'));
          }
          return _results;
        } else {
          _ref1 = this.$el.find('.contentPiece');
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            question = _ref1[_j];
            if (_.contains(responseQuestionIDs, parseInt($(question).attr('data-id')))) {
              _results1.push($(question).find('.cbp_tmlabel').addClass('done completed').css('cursor', 'pointer'));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        }
      };

      ContentDisplayView.prototype.viewQuestionReadOnly = function(e) {
        var questionID;
        questionID = $(e.target).closest('.contentPiece').attr('data-id');
        return this.trigger("view:question:readonly", questionID);
      };

      return ContentDisplayView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:viewgroup:content:displayapp", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new Controller.CollectionContentDisplayController(opt);
    });
  });
});
