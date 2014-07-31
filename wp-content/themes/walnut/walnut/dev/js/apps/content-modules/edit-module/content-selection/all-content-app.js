var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/content-modules/edit-module/content-selection/templates/content-selection.html'], function(App, RegionController, contentSelectionTpl) {
  return App.module("ContentSelectionApp.AllContent", function(AllContent, App, Backbone, Marionette, $, _) {
    var DataContentItemView, DataContentTableView, NoDataItemView;
    AllContent.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        this._getContentSelectionView = __bind(this._getContentSelectionView, this);
        this.contentPieceRemoved = __bind(this.contentPieceRemoved, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opts) {
        var view;
        this.contentPiecesCollection = opts.contentPiecesCollection, this.contentGroupCollection = opts.contentGroupCollection;
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
              _this.contentGroupCollection.add(_this.contentPiecesCollection.get(ele));
              return _this.contentPiecesCollection.remove(ele);
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
          fullCollection: collection.clone()
        });
      };

      return Controller;

    })(RegionController);
    DataContentItemView = (function(_super) {
      __extends(DataContentItemView, _super);

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
    NoDataItemView = (function(_super) {
      __extends(NoDataItemView, _super);

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
    DataContentTableView = (function(_super) {
      __extends(DataContentTableView, _super);

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
        'change #check_all_div': 'checkAll',
        'click #add-content-pieces': 'addContentPieces'
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
        var content_pieces, id, _i, _len;
        content_pieces = _.pluck(this.$el.find('#dataContentTable .tab_checkbox:checked'), 'value');
        if (content_pieces) {
          this.trigger("add:content:pieces", content_pieces);
          for (_i = 0, _len = content_pieces.length; _i < _len; _i++) {
            id = content_pieces[_i];
            this.fullCollection.remove(id);
          }
        }
        return this.onUpdatePager();
      };

      DataContentTableView.prototype.onContentPieceRemoved = function(model) {
        this.fullCollection.add(model);
        return this.onUpdatePager();
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
