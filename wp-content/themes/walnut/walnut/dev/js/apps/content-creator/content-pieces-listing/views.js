var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentPieces.Views", function(Views, App) {
    var ContentPiecesIV;
    ContentPiecesIV = (function(_super) {
      __extends(ContentPiecesIV, _super);

      function ContentPiecesIV() {
        return ContentPiecesIV.__super__.constructor.apply(this, arguments);
      }

      ContentPiecesIV.prototype.template = '{{&excerpt}}<br> <label class="form-label list-group-item-text"> {{textbookName}} | {{chapterName}} | {{contentType}} </label> <label>Last Modified: {{date_modified}}</label>';

      ContentPiecesIV.prototype.className = 'col-md-2 list-group-item browse-content-pieces-item';

      ContentPiecesIV.prototype.tagName = 'a';

      ContentPiecesIV.prototype.modelEvents = function() {
        return {
          'change:isActive': function() {
            this.$el.closest('div').find('a').removeClass('active');
            return this.$el.addClass('active');
          }
        };
      };

      ContentPiecesIV.prototype.events = function() {
        return {
          'click': function() {
            return this.trigger("change:content:piece", this.model);
          }
        };
      };

      ContentPiecesIV.prototype.onShow = function() {
        if (Marionette.getOption(this, 'isCurrentItem')) {
          return this.$el.addClass('active');
        }
      };

      ContentPiecesIV.prototype.mixinTemplateHelpers = function(data) {
        data.excerpt = _.prune(data.post_excerpt, 50);
        data.contentType = _.str.titleize(_.str.humanize(data.content_type));
        data.date_modified = moment(data.post_modified).format("Do MMM YYYY h:mm a");
        return data;
      };

      return ContentPiecesIV;

    })(Marionette.ItemView);
    return Views.ContentPieces = (function(_super) {
      __extends(ContentPieces, _super);

      function ContentPieces() {
        return ContentPieces.__super__.constructor.apply(this, arguments);
      }

      ContentPieces.prototype.template = '<div class="col-md-12"> <div class="browse-thru none"> <div class="row"> <h4>Navigate between editable content pieces</h4> <div class="list-group" id="list-content-pieces"> </div> </div> <div class="row"> <div class"col-md-10"> <a class="pull-left btn btn-default browse-prev"><i class="fa fa-backward"></i> Browse Previous</a> <a class="pull-right btn btn-default browse-next"><i class="fa fa-forward"></i> Browse Next</a> </div> </div> </div> <div class="row m-t-20"> <div class="col-md-8"> {{#isTeacherQuestion}} <h3 class="m-t-0">Create a <span class="semi-bold">Teacher</span> Question<br> <small>Create questions for training module to be taken during the class</small></h3> {{/isTeacherQuestion}} {{#isContentPiece}} <h3 class="m-t-0">Create <span class="semi-bold">Content</span><br> <small>Create content for training modules. This will not have any student interaction like teacher question</small></h3> {{/isContentPiece}} {{#isStudentQuestion}} <h3 class="m-t-0">Create a <span class="semi-bold">Student</span> Question<br> <small>Create questions for quizzes to be taken by the students</small></h3> {{/isStudentQuestion}} </div> <div class="pull-right md-col-4"> <a class="btn btn-default previous-item"><i class="fa fa-backward"></i> Previous Question</a> <a class="btn btn-default next-item"><i class="fa fa-forward"></i> Next Question</a> <a class="btn btn-default browse-all">Browse</a> </div> </div> </div>';

      ContentPieces.prototype.className = 'row m-b-20';

      ContentPieces.prototype.itemView = ContentPiecesIV;

      ContentPieces.prototype.itemViewContainer = '#list-content-pieces';

      ContentPieces.prototype.events = function() {
        return {
          'click .browse-next': function() {
            return this.trigger("browse:more", "next");
          },
          'click .browse-prev': function() {
            return this.trigger("browse:more", "prev");
          },
          'click .previous-item': function() {
            return this.trigger("change:content:piece", "prev");
          },
          'click .next-item': function() {
            return this.trigger("change:content:piece", "next");
          },
          'click .browse-all': function() {
            return this.$el.find('.browse-thru').toggle();
          }
        };
      };

      ContentPieces.prototype.itemViewOptions = function(model, index) {
        var data;
        data = {};
        if (this.model.id === model.id) {
          data.isCurrentItem = true;
        }
        return data;
      };

      ContentPieces.prototype.mixinTemplateHelpers = function(data) {
        data = ContentPieces.__super__.mixinTemplateHelpers.call(this, data);
        data.isStudentQuestion = this.model.get('content_type') === 'student_question' ? true : false;
        data.isTeacherQuestion = this.model.get('content_type') === 'teacher_question' ? true : false;
        data.isContentPiece = this.model.get('content_type') === 'content_piece' ? true : false;
        return data;
      };

      return ContentPieces;

    })(Marionette.CompositeView);
  });
});
