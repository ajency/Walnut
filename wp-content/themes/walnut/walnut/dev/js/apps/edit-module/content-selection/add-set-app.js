var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('ContentSelectionApp.AddSet', function(AddSet, App) {
    var SetView;
    AddSet.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._addNewSet = bind(this._addNewSet, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.contentPiecesCollection = options.contentPiecesCollection, this.contentGroupCollection = options.contentGroupCollection, this.selectedFilterParamsObject = options.selectedFilterParamsObject;
        this.view = this._getView();
        this.listenTo(this.region, "update:collection", (function(_this) {
          return function() {
            var filters;
            filters = _this.selectedFilterParamsObject.request('get:selected:parameters');
            return _this.view.triggerMethod('set:level:count');
          };
        })(this));
        this.listenTo(this.view, 'get:textbook:filter', function() {
          var filters;
          filters = this.selectedFilterParamsObject.request('get:selected:parameters');
          return this.view.triggerMethod('add:set', filters);
        });
        this.listenTo(this.view, 'add:new:set', this._addNewSet);
        return this.show(this.view);
      };

      Controller.prototype._getView = function() {
        return new SetView({
          collection: this.contentPiecesCollection
        });
      };

      Controller.prototype._addNewSet = function(data) {
        var newSetModel;
        data.id = this._getNewSetId();
        newSetModel = new Backbone.Model(data);
        return this.contentGroupCollection.add(newSetModel);
      };

      Controller.prototype._getNewSetId = function() {
        var id, idArray, modelsArray;
        modelsArray = this.contentGroupCollection.where({
          post_type: 'content_set'
        });
        idArray = _.map(_.pluck(modelsArray, 'id'), function(id) {
          return parseInt(_.ltrim(id, 'set '));
        });
        if (_.isEmpty(idArray)) {
          id = 1;
        } else {
          id = _.max(idArray) + 1;
        }
        return "set " + id;
      };

      return Controller;

    })(RegionController);
    SetView = (function(superClass) {
      extend(SetView, superClass);

      function SetView() {
        this._onSpinEditValueChanged = bind(this._onSpinEditValueChanged, this);
        return SetView.__super__.constructor.apply(this, arguments);
      }

      SetView.prototype.template = ' <div class="row"> <div class="col-md-12"> <table class="table table-bordered table-flip-scroll cf"> <thead class="cf"> <tr> <th>Total Questions</th> <th>Level 1</th> <th>Level 2</th> <th>Level 3</th> </tr> </thead> <tbody> <tr> <td> <input type="text" id="total-questions" class="disabled" size="1"  disabled="disabled" value="0"> </td> <td class="level-selection" id="lvl1"><span></span> <input type="text"  /></td> <td class="level-selection" id="lvl2"><span></span> <input type="text"  /></td> <td class="level-selection" id="lvl3"><span></span> <input type="text" /></td> </tr> </tbody> </table> <div class="checkbox check-info"> <input id="selectAll" type="checkbox" value="1"> <label for="selectAll" class="text-grey">Select All</label> </div> <div class="pull-right"> <button type="button" class="btn btn-success btn-cons2" id="add-set-button"><i class="fa fa-plus"></i> Add</button> </div> </div> </div>';

      SetView.prototype.events = {
        'change .level-selection input': '_onSpinEditValueChanged',
        'click #add-set-button': function() {
          var ref;
          if ((ref = this.$el.find('#total-questions').val()) !== 0 && ref !== '0') {
            return this.trigger('get:textbook:filter');
          }
        },
        'change #selectAll': '_selectAllForSet'
      };

      SetView.prototype.className = 'row';

      SetView.prototype.onShow = function() {
        this.listenTo(this.collection, 'add remove', (function(_this) {
          return function() {
            return _this.onSetLevelCount();
          };
        })(this));
        return this.onSetLevelCount();
      };

      SetView.prototype.onSetLevelCount = function() {
        var count, i, j, levelCount, ref, results;
        levelCount = this.collection.countBy('difficulty_level');
        this.$el.find('#selectAll').prop('checked', false);
        results = [];
        for (i = j = 1; j <= 3; i = ++j) {
          count = (ref = levelCount["" + i]) != null ? ref : 0;
          this.$el.find("#lvl" + i).find(" input, .spinedit").remove();
          this.$el.find("#lvl" + i).append("<input type='text'  />");
          this.$el.find("#lvl" + i + " input").spinedit({
            minimum: 0,
            maximum: count,
            value: 0
          });
          results.push(this.$el.find("#lvl" + i + " span").text(count));
        }
        return results;
      };

      SetView.prototype._onSpinEditValueChanged = function() {
        var total;
        total = 0;
        _.each(this.$el.find(".level-selection input.spinedit"), function(num) {
          return total += parseInt($(num).val());
        });
        return this.$el.find('#total-questions').val(total);
      };

      SetView.prototype._selectAllForSet = function(e) {
        var levelCount, ref, ref1, ref2;
        if ($(e.target).is(':checked')) {
          levelCount = this.collection.countBy('difficulty_level');
          this.$el.find("#lvl1 input").val((ref = levelCount["1"]) != null ? ref : 0);
          this.$el.find("#lvl2 input").val((ref1 = levelCount["2"]) != null ? ref1 : 0);
          this.$el.find("#lvl3 input").val((ref2 = levelCount["3"]) != null ? ref2 : 0);
          return this._onSpinEditValueChanged();
        } else {
          this.$el.find("#lvl1 input").val(0);
          this.$el.find("#lvl2 input").val(0);
          this.$el.find("#lvl3 input").val(0);
          return this._onSpinEditValueChanged();
        }
      };

      SetView.prototype.onAddSet = function(filters) {
        var data, setAvgs, terms_id;
        _.each(filters, function(term, index) {
          var newTerm;
          if ((term == null) || term.id === '') {
            newTerm = {
              id: '',
              text: 'ALL'
            };
            return filters[index] = newTerm;
          }
        });
        terms_id = {
          textbook: filters[0].id,
          chapter: filters[1].id,
          section: filters[2].id,
          subsection: filters[3].id
        };
        setAvgs = this.getSetAvgs();
        data = {
          terms_id: terms_id,
          textbook: filters[0].text,
          chapter: filters[1].text,
          section: filters[2].text,
          'sub-section': filters[2].text,
          lvl1: this.$el.find("#lvl1 input").val(),
          lvl2: this.$el.find("#lvl2 input").val(),
          lvl3: this.$el.find("#lvl3 input").val(),
          post_type: 'content_set',
          avg_marks: setAvgs.marks,
          avg_duration: setAvgs.time
        };
        this.trigger("add:new:set", data);
        this.$el.find("input[type='text']").val(0);
        return this.$el.find('#selectAll').prop('checked', false);
      };

      SetView.prototype.getSetAvgs = function() {
        var avgMarks, avgTime, j, lev, marks, models, numQuestions, setAvgs, time;
        avgMarks = avgTime = 0;
        for (lev = j = 1; j <= 3; lev = ++j) {
          marks = time = 0;
          models = this.collection.where({
            'difficulty_level': lev
          });
          _.each(models, function(m, ele) {
            if (m.get('marks')) {
              marks += parseInt(m.get('marks'));
            }
            return time += parseInt(m.get('duration'));
          });
          numQuestions = parseInt(this.$el.find("#lvl" + lev + " input").val());
          if (numQuestions) {
            avgMarks += numQuestions * marks / models.length;
          }
          if (numQuestions) {
            avgTime += numQuestions * time / models.length;
          }
        }
        return setAvgs = {
          'marks': avgMarks,
          'time': avgTime
        };
      };

      return SetView;

    })(Marionette.ItemView);
    return App.commands.setHandler('show:add:set:app', function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new AddSet.Controller(opt);
    });
  });
});
