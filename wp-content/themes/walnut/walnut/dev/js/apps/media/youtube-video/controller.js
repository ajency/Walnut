var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller'], function(App, AppController) {
  return App.module("Media.Youtube", function(Youtube, App) {
    var YoutubeView;
    YoutubeView = (function(_super) {
      __extends(YoutubeView, _super);

      function YoutubeView() {
        return YoutubeView.__super__.constructor.apply(this, arguments);
      }

      YoutubeView.prototype.template = '<div class="row"> <div class="col-md-6"> <input type="text" class="form-control youtubeUrl" placeholder="http://www.youtube.com/watch?v=xW_AsV7k42o"> <i class="text-danger hidden">Your URL should be something like http://www.youtube.com/watch?v=xW_AsV7k42o</i> </div> <div class="col-md-4"> <button class="pull-left btn btn-info btn-small">Add Video</button> </div> </div>';

      YoutubeView.prototype.events = function() {
        return {
          'click button': function() {
            var url;
            url = $('.youtubeUrl').val();
            this.$el.find('.text-danger').addClass('hidden');
            this.$el.find('.youtubeUrl').removeClass('error');
            if (_.str.contains(url, 'http://www.youtube.com/watch?v=') || _.str.contains(url, 'https://www.youtube.com/watch?v=')) {
              return this.trigger("youtube:url:selected", url);
            } else {
              this.$el.find('.text-danger').removeClass('hidden');
              return this.$el.find('.youtubeUrl').addClass('error');
            }
          }
        };
      };

      return YoutubeView;

    })(Marionette.ItemView);
    Youtube.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function() {
        var view;
        view = this._getView();
        this.show(view);
        return this.listenTo(view, 'youtube:url:selected', function(url) {
          return this.region.trigger('youtube:url:selected', url);
        });
      };

      Controller.prototype._getView = function(mediaCollection) {
        return new YoutubeView;
      };

      return Controller;

    })(AppController);
    return App.commands.setHandler('start:youtube:video:app', (function(_this) {
      return function(options) {
        return new Youtube.Controller({
          region: options.region
        });
      };
    })(this));
  });
});
