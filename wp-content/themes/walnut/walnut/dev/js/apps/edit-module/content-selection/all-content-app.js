var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'text!apps/edit-module/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.AllContent", function(AllContent, App, Backbone, Marionette, $, _) {
    var DataContentItemView, DataContentTableView, NoDataItemView;
    AllContent.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._getContentSelectionView = bind(this._getContentSelectionView, this);
        this.contentPieceRemoved = bind(this.contentPieceRemoved, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.contentPiecesCollection = opts.contentPiecesCollection, this.contentGroupCollection = opts.contentGroupCollection, this.groupType = opts.groupType;
        this.view = view = this._getContentSelectionView(this.contentPiecesCollection);
        this.show(this.view, {
          loading: true
        });
        this.listenTo(this.region, "update:pager", (function(_this) {
          return function() {
            return _this.view.triggerMethod("update:pager");
          };
        })(this));
        this.listenTo(this.view, "add:content:pieces", (function(_this) {
          return function(contentIDs) {
            return _.each(contentIDs, function(ele, index) {
              return _this.contentGroupCollection.add(_this.contentPiecesCollection.get(ele));
            });
          };
        })(this));
        return this.listenTo(this.contentGroupCollection, 'remove', this.contentPieceRemoved);
      };

      Controller.prototype.contentPieceRemoved = function(model) {
        if (model.get('post_type') === 'content-piece') {
          this.contentPiecesCollection.add(model);
          return this.view.triggerMethod("content:piece:removed", model);
        }
      };

      Controller.prototype._getContentSelectionView = function(collection) {
        return new DataContentTableView({
          collection: collection,
          fullCollection: collection.clone(),
          groupType: this.groupType
        });
      };

      return Controller;

    })(RegionController);
    DataContentItemView = (function(superClass) {
      extend(DataContentItemView, superClass);

      function DataContentItemView() {
        return DataContentItemView.__super__.constructor.apply(this, arguments);
      }

      DataContentItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{ID}}" id="checkbox{{ID}}"> <label for="checkbox{{ID}}"></label> </div> </td> <td class="cpHeight">{{&post_excerpt}}</td> {{#isModule}} <td>{{content_type_str}}</td> {{/isModule}} {{#isQuiz}} <td>{{difficulty_level}}</td> <td>{{marks}}</td> <td>{{duration}} mins</td> {{/isQuiz}} <td class="cpHeight"> {{&present_in_str}} </td> <td><span style="display:none">{{sort_date}} </span> {{modified_date}}</td>';

      DataContentItemView.prototype.tagName = 'tr';

      DataContentItemView.prototype.serializeData = function() {
        var data, modules, ref, type;
        data = DataContentItemView.__super__.serializeData.call(this);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        if ((ref = this.groupType) === 'teaching-module' || ref === 'student-training') {
          data.isModule = true;
        }
        if (this.groupType === 'student-training') {
          data.isStudentTraining = true;
        }
        data.modified_date = moment(data.post_modified).format("Do MMM YYYY");
        data.sort_date = moment(data.post_modified).format("YYYYMMDD");
        data.content_type_str = _(data.content_type).chain().humanize().titleize().value();
        modules = [];
        _.each(data.present_in_modules, function(ele, index) {
          var link;
          link = data.content_type === 'student_question' ? 'view-quiz' : 'view-group';
          return modules.push(("<a target='_blank' href='#" + link + "/" + ele.id + "'>") + ele.name + "</a>");
        });
        type = data.content_type === 'student_question' ? 'quiz' : 'teaching-module';
        if (data.content_type === 'student_question') {
          data.marks = this.model.get('marks');
        }
        data.present_in_str = _.size(modules) > 0 ? _.toSentence(modules) : "Not added to a " + type + " yet";
        return data;
      };

      DataContentItemView.prototype.initialize = function() {
        return this.groupType = Marionette.getOption(this, 'groupType');
      };

      return DataContentItemView;

    })(Marionette.ItemView);
    NoDataItemView = (function(superClass) {
      extend(NoDataItemView, superClass);

      function NoDataItemView() {
        return NoDataItemView.__super__.constructor.apply(this, arguments);
      }

      console.log("EMPYT VIEW");

      NoDataItemView.prototype.template = 'No Content Available';

      NoDataItemView.prototype.tagName = 'td';

      NoDataItemView.prototype.onShow = function() {
        return this.$el.attr('colspan', 5);
      };

      return NoDataItemView;

    })(Marionette.ItemView);
    DataContentTableView = (function(superClass) {
      extend(DataContentTableView, superClass);

      function DataContentTableView() {
        this.onContentPieceRemoved = bind(this.onContentPieceRemoved, this);
        this.addContentPieces = bind(this.addContentPieces, this);
        return DataContentTableView.__super__.constructor.apply(this, arguments);
      }

      DataContentTableView.prototype.template = contentSelectionTpl;

      DataContentTableView.prototype.emptyView = NoDataItemView;

      DataContentTableView.prototype.itemView = DataContentItemView;

      DataContentTableView.prototype.itemViewContainer = '#dataContentTable tbody';

      DataContentTableView.prototype.itemViewOptions = function() {
        return {
          groupType: Marionette.getOption(this, 'groupType')
        };
      };

      DataContentTableView.prototype.events = {
        'change #check_all_div': 'checkAll',
        'click #add-content-pieces': 'addContentPieces'
      };

      DataContentTableView.prototype.mixinTemplateHelpers = function(data) {
        var ref;
        data = DataContentTableView.__super__.mixinTemplateHelpers.call(this, data);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        if ((ref = this.groupType) === 'teaching-module' || ref === 'student-training') {
          data.isModule = true;
        }
        return data;
      };

      DataContentTableView.prototype.initialize = function() {
        return this.groupType = Marionette.getOption(this, 'groupType');
      };

      DataContentTableView.prototype.onShow = function() {
        this.$el.find('#dataContentTable').tablesorter();
        return this.fullCollection = Marionette.getOption(this, 'fullCollection');
      };

      DataContentTableView.prototype.checkAll = function() {
        if (this.$el.find('#check_all').is(':checked')) {
          return this.$el.find('#dataContentTable .tab_checkbox').trigger('click').prop('checked', true);
        } else {
          return this.$el.find('#dataContentTable .tab_checkbox').removeAttr('checked');
        }
      };

      DataContentTableView.prototype.addContentPieces = function() {
        var content_pieces;
        content_pieces = _.pluck(this.$el.find('#dataContentTable .tab_checkbox:checked'), 'value');
        if (content_pieces) {
          return this.trigger("add:content:pieces", content_pieces);
        }
      };

      DataContentTableView.prototype.onContentPieceRemoved = function(model) {
        var id;
        id = parseInt(model.get('ID'));
        this.fullCollection.add(model);
        return this.$el.find('input[type=checkbox][value=' + id + ']').trigger('click').prop('checked', false);
      };

      DataContentTableView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("#dataContentTable").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("#dataContentTable").tablesorterPager(pagerOptions);
      };

      return DataContentTableView;

    })(Marionette.CompositeView);
    return App.commands.setHandler("show:all:content:selection:app", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new AllContent.Controller(opt);
    });
  });
});
