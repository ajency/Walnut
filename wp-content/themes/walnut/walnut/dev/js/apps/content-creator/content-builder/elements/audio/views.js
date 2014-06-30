var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Audio.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.AudioView = (function(_super) {
      __extends(AudioView, _super);

      function AudioView() {
        return AudioView.__super__.constructor.apply(this, arguments);
      }

      AudioView.prototype.className = 'audio';

      AudioView.prototype.template = '{{#audio}} <audio controls> <source src="{{audioUrl}}" type="audio/ogg"> Your browser does not support the audio element. </audio> {{/audio}} {{#placeholder}} <div class="audio-placeholder"><span class="bicon icon-uniF100"></span>Upload Audio</div> {{/placeholder}}';

      AudioView.prototype.mixinTemplateHelpers = function(data) {
        data = AudioView.__super__.mixinTemplateHelpers.call(this, data);
        if (!this.model.get('audio_id')) {
          data.placeholder = true;
        } else {
          data.audio = true;
          data.audioUrl = this.model.get('audioUrl');
        }
        return data;
      };

      AudioView.prototype.events = {
        'click': function(e) {
          e.stopPropagation();
          return this.trigger("show:media:manager");
        }
      };

      AudioView.prototype.onShow = function() {
        return this.$el.find('audio').panzer({
          layout: 'big',
          expanded: true,
          showduration: true
        });
      };

      return AudioView;

    })(Marionette.ItemView);
  });
});
