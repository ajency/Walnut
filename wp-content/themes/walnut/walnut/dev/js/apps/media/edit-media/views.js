var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/media/edit-media/templates/form.html'], function(App, formTpl) {
  return App.module('Media.EditMedia.Views', function(Views, App) {
    return Views.EditMediaView = (function(superClass) {
      extend(EditMediaView, superClass);

      function EditMediaView() {
        return EditMediaView.__super__.constructor.apply(this, arguments);
      }

      EditMediaView.prototype.template = formTpl;

      EditMediaView.prototype.events = {
        'click #save-media-details': '_updateImageData'
      };

      EditMediaView.prototype._updateImageData = function() {
        var data;
        data = Backbone.Syphon.serialize(this);
        return this.trigger('update:image:data', data);
      };

      return EditMediaView;

    })(Marionette.ItemView);
  });
});
