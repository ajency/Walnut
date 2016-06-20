var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module('AddTextbookPopup', function(AddTextbookPopup, App) {
    var AddTextbookView;
    AddTextbookPopup.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._addTextbookView = bind(this._addTextbookView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.view = this._addTextbookView(options.collection);
        this.show(this.view);
        this.listenTo(this.view, 'close:popup:dialog', function() {
          return this.region.closeDialog();
        });
        return this.listenTo(this.view, 'save:quiz:schedule', function(from, to) {
          var data, schedule;
          this.quizModel.set({
            'schedule': {
              'from': from,
              'to': to
            }
          });
          data = {
            quiz_id: this.quizModel.id,
            division: this.division,
            schedule: {
              from: from,
              to: to
            }
          };
          schedule = App.request("save:quiz:schedule", data);
          return schedule.done((function(_this) {
            return function(response) {
              return _this.view.triggerMethod("schedule:saved", response);
            };
          })(this));
        });
      };

      Controller.prototype._addTextbookView = function(collection) {
        return new AddTextbookView({
          collection: collection
        });
      };

      return Controller;

    })(RegionController);
    AddTextbookView = (function(superClass) {
      extend(AddTextbookView, superClass);

      function AddTextbookView() {
        this.addTextbook = bind(this.addTextbook, this);
        return AddTextbookView.__super__.constructor.apply(this, arguments);
      }

      AddTextbookView.prototype.template = '<form> <div class="row"> <div class="col-md-12"> Name:<br> <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12"> </div><br> <div class="col-md-12"> Classes suitable for:<br/> {{#classes}} <input style="width:20px" type="checkbox" name="textClass" value="{{label}}">{{label}}<br> {{/classes}} </div><br> <div class="col-md-12"> Description:<br> <textarea id="textdesc" name="textdesc" type="text" class="input-small span12"></textarea> </div><br> <div class="col-md-12"> Textbook Image Url<br> <input id="texturl" name="texturl" type="file" class="input-small span12"> </div><br> <div class="row"> <div class="col-md-12"> <button type="button" class="clear btn btn-success m-t-20 pull-left">Add Textbook</button> <div class=" p-l-10 p-t-30 pull-left success-msg"></div> </div> </div> </div> </form>';

      AddTextbookView.prototype.events = {
        'click .btn-success': 'addTextbook'
      };

      AddTextbookView.prototype.initialize = function() {
        return this.dialogOptions = {
          modal_title: 'Add Textbook',
          modal_size: 'small'
        };
      };

      AddTextbookView.prototype.serializeData = function() {
        var class_id, class_ids, class_string, collection_classes, data, i, item_classes, len;
        data = AddTextbookView.__super__.serializeData.call(this);
        collection_classes = this.collection.pluck('classes');
        data.classes = _.chain(collection_classes).flatten().union().compact().sortBy(function(num) {
          return parseInt(num);
        }).map(function(m) {
          var classes;
          classes = [];
          classes.slug = _.slugify(CLASS_LABEL[m]);
          classes.label = CLASS_LABEL[m];
          return classes;
        }).value();
        class_ids = this.collection.get('classes');
        console.log(class_ids);
        if (class_ids) {
          item_classes = _.sortBy(class_ids, function(num) {
            return num;
          });
          class_string = '';
          for (i = 0, len = item_classes.length; i < len; i++) {
            class_id = item_classes[i];
            class_string += CLASS_LABEL[class_id];
            if (_.last(item_classes) !== class_id) {
              class_string += ', ';
            }
            console.log(class_id + " " + class_string);
          }
          data.class_string = class_string;
        }
        return data;
      };

      AddTextbookView.prototype.onShow = function() {
        return console.log('onshow');
      };

      AddTextbookView.prototype.addTextbook = function(e) {
        var name;
        console.log(this.model);
        if (this.$el.find('form').valid()) {
          return name = $('#textname').val();
        } else {
          this.trigger("save:quiz:schedule", data);
          return onAddTextbook;
        }
      };

      AddTextbookView.prototype.onAddTextbook = function(response) {
        this.$el.find('.success-msg').html('').removeClass('text-success, text-error');
        if (response.code === 'ERROR') {
          return this.$el.find('.success-msg').html('Failed to save schedule').addClass('text-error');
        } else {
          this.$el.find('.success-msg').html('Saved Successfully').addClass('text-success');
          return setTimeout((function(_this) {
            return function() {
              return _this.trigger('close:popup:dialog');
            };
          })(this), 500);
        }
      };

      return AddTextbookView;

    })(Marionette.ItemView);
    return App.commands.setHandler('add:textbook:popup', function(options) {
      return new AddTextbookPopup.Controller(options);
    });
  });
});
