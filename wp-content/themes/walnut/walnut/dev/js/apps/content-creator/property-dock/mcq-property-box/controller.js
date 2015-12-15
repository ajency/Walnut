var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/mcq-property-box/views', 'apps/content-creator/property-dock/mcq-property-box/marksview'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.McqPropertyBox", function(McqPropertyBox, App, Backbone, Marionette, $, _) {
    McqPropertyBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model;
        App.execute("close:question:elements");
        App.execute("close:question:element:properties");
        this.layout = this._getView(this.model);
        this.listenTo(this.layout, "change:option:number", (function(_this) {
          return function(number) {
            return _this.model.set('optioncount', parseInt(number));
          };
        })(this));
        this.listenTo(this.layout, "show:individual:marks:table", (function(_this) {
          return function() {
            var marksView;
            marksView = _this._getMarksView(_this.model);
            return _this.layout.individualMarksRegion.show(marksView);
          };
        })(this));
        this.listenTo(this.layout, "hide:individual:marks:table", (function(_this) {
          return function() {
            return _this.layout.individualMarksRegion.close();
          };
        })(this));
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new McqPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype._getMarksView = function(model) {
        return new McqPropertyBox.Views.MarksView({
          collection: model.get('options'),
          mcq_model: model
        });
      };

      Controller.prototype.onClose = function() {
        var ans, answers, elements, i, len, models, opt, optionCollection, optionElements, options;
        if (this.model.get('marks') > 0 && this.model.get('correct_answer').length) {
          if (!this.model.get('multiple')) {
            this.model.set('complete', true);
          } else {
            answers = this.model.get('correct_answer');
            options = this.model.get('options');
            for (i = 0, len = answers.length; i < len; i++) {
              ans = answers[i];
              opt = options.get(ans);
              if (parseInt(opt.get('marks')) === 0) {
                this.model.set('complete', false);
                return false;
              } else {
                this.model.set('complete', true);
              }
            }
          }
        } else {
          this.model.set('complete', false);
        }
        models = this.model.get('options').models;
        elements = _.map(models, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'options': elements
        });
        optionElements = this.model.get('elements');
        this.model.unset('elements');
        this.model.save();
        this.model.set('elements', optionElements);
        optionCollection = App.request("create:new:option:collection", models);
        return this.model.set('options', optionCollection);
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:mcq:properties", function(options) {
      return new McqPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
