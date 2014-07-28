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

      AudioView.prototype.template = '{{#audio}} <audio title="{{title}}" class="audio1" controls> <source src="{{audioUrl}}" type="audio/mpeg"> Your browser does not support the audio element. </audio> {{/audio}} {{#placeholder}} <div class="audio-placeholder"><span class="bicon icon-uniF100"></span>Upload Audio</div> {{/placeholder}}';

      AudioView.prototype.mixinTemplateHelpers = function(data) {
        var arrays, audioArray;
        data = AudioView.__super__.mixinTemplateHelpers.call(this, data);
        if (!this.model.get('audio_ids').length) {
          data.placeholder = true;
        } else {
          arrays = _.zip(this.model.get('title'), this.model.get('audioUrls'));
          audioArray = new Array();
          _.each(arrays, function(array) {
            return audioArray.push(_.object(['title', 'audioUrl'], array));
          });
          data.audio = audioArray;
        }
        return data;
      };

      AudioView.prototype.events = {
        'click': function(e) {
          e.stopPropagation();
          return this.trigger("show:media:manager");
        },
        'click .panzerlist .controls': '_stopPropagating',
        'click .panzerlist .list': '_stopPropagating'
      };

      AudioView.prototype._stopPropagating = function(e) {
        return e.stopPropagation();
      };

      AudioView.prototype.onShow = function() {
        return this.$el.find('audio.audio1').panzerlist({
          theme: 'light',
          layout: 'big',
          expanded: true,
          showduration: true,
          show_prev_next: true
        });
      };

      return AudioView;

    })(Marionette.ItemView);
  });
});
