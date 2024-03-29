var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentPreview.ContentBoard.Element.Audio.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.AudioView = (function(superClass) {
      extend(AudioView, superClass);

      function AudioView() {
        return AudioView.__super__.constructor.apply(this, arguments);
      }

      AudioView.prototype.className = 'audio';

      AudioView.prototype.template = '{{#audio}} <audio title="{{title}}" class="audio1" controls autoplay> <source src="{{audioUrl}}" type="audio/mpeg"> Your browser does not support the audio element. </audio> {{/audio}}';

      AudioView.prototype.mixinTemplateHelpers = function(data) {
        var arrays, audioArray;
        data = AudioView.__super__.mixinTemplateHelpers.call(this, data);
        this.model.set({
          'autoplay': _.toBool(this.model.get('autoplay'))
        });
        if (this.model.get('audio_ids').length) {
          arrays = _.zip(this.model.get('title'), this.model.get('audioUrls'));
          audioArray = new Array();
          _.each(arrays, function(array) {
            return audioArray.push(_.object(['title', 'audioUrl'], array));
          });
          data.audio = audioArray;
        }
        return data;
      };

      AudioView.prototype.onShow = function() {
        return this.$el.find('audio').panzerlist({
          theme: 'light',
          layout: 'big',
          expanded: true,
          showduration: true,
          show_prev_next: true,
          auto_start: this.model.get('autoplay')
        });
      };

      return AudioView;

    })(Marionette.ItemView);
  });
});
