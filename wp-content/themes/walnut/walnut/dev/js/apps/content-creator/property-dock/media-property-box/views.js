var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.PropertyDock.MediaPropertyBox.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles blue"> <div class="tile-footer drag"> Media <i class="fa fa-chevron-right"></i> <span class="semi-bold">{{element}} Properties</span> </div> <div class="docket-body"> <br> <div class="radio radio-success"> Autoplay? <input id="autoplayTrue" type="radio" name="autoplay" value="true"> <label for="autoplayTrue">Yes</label> <input id="autoplayFalse" type="radio" name="autoplay" value="false"> <label for="autoplayFalse">No</label> </div> <br> <div class="media_times hidden"> Start Time: <input name="startTime" value="{{startTime}}" type = "text" /><br> End Time: <input name="endTime" value="{{endTime}}" type = "text" /> </div> <br> </div> </div> </div>';

      PropertyView.prototype.events = {
        'change input[name="autoplay"]': function() {
          return this.model.set({
            'autoplay': _.toBool(this.$el.find('input[name="autoplay"]:checked').val())
          });
        },
        'blur input[name="startTime"]': function(e) {
          var startTime;
          $(e.target).removeClass('error');
          startTime = parseInt($(e.target).val());
          if (_.isNaN(startTime)) {
            $(e.target).addClass('error');
            return this.model.set({
              'startTime': 0
            });
          } else {
            if (!_.isNaN(startTime)) {
              return this.model.set({
                'startTime': startTime
              });
            }
          }
        },
        'blur input[name="endTime"]': function(e) {
          var endTime;
          $(e.target).removeClass('error');
          endTime = parseInt($(e.target).val());
          if (_.isNaN(endTime)) {
            $(e.target).addClass('error');
            return this.model.set({
              'endTime': 0
            });
          } else {
            if (!_.isNaN(endTime)) {
              return this.model.set({
                'endTime': endTime
              });
            }
          }
        }
      };

      PropertyView.prototype.onShow = function() {
        if (this.model.get('element') === 'Video') {
          this.$el.find('.media_times').removeClass('hidden');
        }
        if (_.toBool(this.model.get('autoplay'))) {
          return this.$el.find('#autoplayTrue').attr('checked', true);
        } else {
          return this.$el.find('#autoplayFalse').attr('checked', true);
        }
      };

      PropertyView.prototype._changeMarks = function(evt) {
        if (!isNaN($(evt.target).val())) {
          return this.model.set('marks', parseInt($(evt.target).val()));
        }
      };

      PropertyView.prototype._changeOptionNumber = function(evt) {
        return this.model.set('optioncount', parseInt($(evt.target).val()));
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
