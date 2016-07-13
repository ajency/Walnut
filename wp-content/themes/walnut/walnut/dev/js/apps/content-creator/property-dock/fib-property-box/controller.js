var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/content-creator/property-dock/fib-property-box/views'], function(App, RegionController) {
  return App.module("ContentCreator.PropertyDock.FibPropertyBox", function(FibPropertyBox, App, Backbone, Marionette, $, _) {
    FibPropertyBox.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.model = options.model;
        this.layout = this._getView(this.model);
        return this.show(this.layout);
      };

      Controller.prototype._getView = function(model) {
        return new FibPropertyBox.Views.PropertyView({
          model: model
        });
      };

      Controller.prototype.onClose = function() {
        var ElementCollection, elements, models;
        App.execute('save:fib:text');
        models = this.model.get('blanksArray').models;
        elements = _.map(models, function(m) {
          return m.toJSON();
        });
        this.model.set({
          'blanksArray': elements
        });
        if (this.model.get('marks') > 0) {
          this.model.set('complete', true);
          this.has_individual_marks = this.model.get('enableIndividualMarks');
          _.each(this.model.get('blanksArray'), (function(_this) {
            return function(blanks) {
              if (_.isEmpty(blanks.correct_answers) || _.isEmpty(blanks.correct_answers[0])) {
                _this.model.set('complete', false);
              }
              if (_this.has_individual_marks && blanks.marks === 0) {
                return _this.model.set('complete', false);
              }
            };
          })(this));
        } else {
          this.model.set('complete', false);
        }
        if (this.model.get('numberOfBlanks') === 0) {
          this.model.set({
            'complete': false
          });
        }
        this.model.save();
        ElementCollection = App.request("create:new:question:element:collection", models);
        return this.model.set('blanksArray', ElementCollection);
      };

      return Controller;

    })(RegionController);
    return App.commands.setHandler("show:fib:properties", function(options) {
      return new FibPropertyBox.Controller({
        region: options.region,
        model: options.model
      });
    });
  });
});
