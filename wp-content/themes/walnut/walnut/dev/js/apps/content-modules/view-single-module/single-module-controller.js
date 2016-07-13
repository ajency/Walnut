var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-modules/view-single-module/module-description/description-app', 'apps/content-modules/view-single-module/content-display/content-display-app'], function(App, RegionController) {
  return App.module("ContentModulesApp.View", function(View, App) {
    var ContentGroupViewLayout;
    View.GroupController = (function(superClass) {
      var groupContentCollection, model;

      extend(GroupController, superClass);

      function GroupController() {
        this._getContentGroupViewLayout = bind(this._getContentGroupViewLayout, this);
        this.showContentGroupViews = bind(this.showContentGroupViews, this);
        this.gotoTrainingModule = bind(this.gotoTrainingModule, this);
        this.startTeachingModule = bind(this.startTeachingModule, this);
        return GroupController.__super__.constructor.apply(this, arguments);
      }

      model = null;

      groupContentCollection = null;

      GroupController.prototype.initialize = function(opts) {
        $.showHeaderAndLeftNav();
        model = opts.model, this.classID = opts.classID, this.mode = opts.mode, this.division = opts.division, this.studentCollection = opts.studentCollection, this.questionResponseCollection = opts.questionResponseCollection;
        if (!this.questionResponseCollection) {
          this.questionResponseCollection = App.request("get:question:response:collection", {
            'division': this.division,
            'collection_id': model.get('id')
          });
        }
        if (!this.studentCollection) {
          if (this.mode === 'training') {
            this.studentCollection = App.request("get:dummy:students");
          } else {
            this.studentCollection = App.request("get:user:collection", {
              'role': 'student',
              'division': this.division
            });
          }
        }
        return App.execute("when:fetched", model, (function(_this) {
          return function() {
            var layout;
            if (model.get('code') === 'ERROR') {
              App.execute("show:no:permissions:app", {
                region: App.mainContentRegion,
                error_header: 'Unauthorized Training Module',
                error_msg: model.get('error_msg')
              });
              return false;
            }
            groupContentCollection = App.request("get:content:pieces:by:ids", model.get('content_pieces'));
            _this.layout = layout = _this._getContentGroupViewLayout();
            _this.show(_this.layout, {
              loading: true,
              entities: [model, _this.questionResponseCollection, groupContentCollection, _this.textbookNames, _this.studentCollection]
            });
            _this.listenTo(_this.layout, 'show', _this.showContentGroupViews);
            _this.listenTo(_this.layout.collectionDetailsRegion, 'start:teaching:module', _this.startTeachingModule);
            return _this.listenTo(_this.layout.contentDisplayRegion, 'goto:question:readonly', function(questionID) {
              return _this.gotoTrainingModule(questionID, 'readonly');
            });
          };
        })(this));
      };

      GroupController.prototype.startTeachingModule = function() {
        var content_piece_ids, content_pieces, nextQuestion, responseCollection, responseQuestionIDs;
        responseCollection = this.questionResponseCollection.where({
          "status": "completed"
        });
        window.f = responseCollection;
        responseQuestionIDs = _.chain(responseCollection).map(function(m) {
          return m.toJSON();
        }).pluck('content_piece_id').value();
        content_pieces = model.get('content_pieces');
        if (content_pieces) {
          content_piece_ids = _.map(content_pieces, function(m) {
            return parseInt(m);
          });
        }
        nextQuestion = _.first(_.difference(content_piece_ids, responseQuestionIDs));
        if (model.get('post_status') === 'archive') {
          return this.gotoTrainingModule(nextQuestion, 'readonly');
        } else {
          return this.gotoTrainingModule(nextQuestion, 'class_mode');
        }
      };

      GroupController.prototype.gotoTrainingModule = function(question, display_mode) {
        if (this.mode === 'training') {
          display_mode = 'training';
        }
        return App.execute("start:teacher:teaching:app", {
          region: App.mainContentRegion,
          division: this.division,
          contentPiece: groupContentCollection.get(question),
          questionResponseCollection: this.questionResponseCollection,
          contentGroupModel: model,
          questionsCollection: groupContentCollection,
          classID: this.classID,
          studentCollection: this.studentCollection,
          display_mode: display_mode
        });
      };

      GroupController.prototype.showContentGroupViews = function() {
        var textbook_termIDs;
        textbook_termIDs = _.flatten(model.get('term_ids'));
        this.textbookNames = App.request("get:textbook:names:by:ids", textbook_termIDs);
        return App.execute("when:fetched", this.textbookNames, (function(_this) {
          return function() {
            App.execute("show:viewgroup:content:group:detailsapp", {
              region: _this.layout.collectionDetailsRegion,
              model: model,
              mode: _this.mode,
              questionResponseCollection: _this.questionResponseCollection,
              textbookNames: _this.textbookNames
            });
            if (_.size(model.get('content_pieces')) > 0) {
              return App.execute("show:viewgroup:content:displayapp", {
                region: _this.layout.contentDisplayRegion,
                model: model,
                mode: _this.mode,
                questionResponseCollection: _this.questionResponseCollection,
                groupContentCollection: groupContentCollection,
                studentCollection: _this.studentCollection
              });
            }
          };
        })(this));
      };

      GroupController.prototype._getContentGroupViewLayout = function() {
        return new ContentGroupViewLayout;
      };

      return GroupController;

    })(RegionController);
    ContentGroupViewLayout = (function(superClass) {
      extend(ContentGroupViewLayout, superClass);

      function ContentGroupViewLayout() {
        return ContentGroupViewLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupViewLayout.prototype.template = '<div class="teacher-app"> <div id="collection-details-region"></div> </div> <div id="content-display-region"></div>';

      ContentGroupViewLayout.prototype.className = '';

      ContentGroupViewLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupViewLayout;

    })(Marionette.Layout);
    return App.commands.setHandler("show:single:module:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new View.GroupController(opt);
    });
  });
});
