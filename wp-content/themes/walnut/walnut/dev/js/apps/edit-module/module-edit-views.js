var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app'], function(App) {
  return App.module('ContentModulesApp.Edit.Views', function(Views, App) {
    var NotEditView;
    Views.ContentGroupEditLayout = (function(superClass) {
      extend(ContentGroupEditLayout, superClass);

      function ContentGroupEditLayout() {
        return ContentGroupEditLayout.__super__.constructor.apply(this, arguments);
      }

      ContentGroupEditLayout.prototype.template = '<div class="teacher-app" id="teacher-app"> <div id="collection-details-region"></div> <div id="content-selection-region"></div> </div> <div id="content-display-region"></div>';

      ContentGroupEditLayout.prototype.className = '';

      ContentGroupEditLayout.prototype.regions = {
        collectionDetailsRegion: '#collection-details-region',
        contentSelectionRegion: '#content-selection-region',
        contentDisplayRegion: '#content-display-region'
      };

      return ContentGroupEditLayout;

    })(Marionette.Layout);
    return NotEditView = (function(superClass) {
      extend(NotEditView, superClass);

      function NotEditView() {
        return NotEditView.__super__.constructor.apply(this, arguments);
      }

      NotEditView.prototype.template = '<div class="teacher-app"> <div id="collection-details-region"> <div class="tiles white grid simple vertical green animated fadeIn"> <div class="grid-title no-border"> <h3>This module is not editable</h3> <p>Current Status: {{currentStatus}}</p> </div> </div> </div> </div>';

      NotEditView.prototype.mixinTemplateHelpers = function(data) {
        var status;
        status = Marionette.getOption(this, 'status');
        switch (status) {
          case 'publish':
            data.currentStatus = 'Published';
            break;
          case 'archive':
            data.currentStatus = 'Archived';
            break;
          default:
            data.currentStatus = 'Not specified!';
        }
        return data;
      };

      return NotEditView;

    })(Marionette.ItemView);
  });
});
