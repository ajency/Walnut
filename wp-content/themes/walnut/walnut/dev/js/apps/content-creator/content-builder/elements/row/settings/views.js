var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/content-builder/elements/row/settings/templates/settings.html'], function(App, settingsTpl) {
  return App.module('ContentCreator.ContentBuilder.Element.Row.Settings.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.SettingsView = (function(_super) {
      __extends(SettingsView, _super);

      function SettingsView() {
        this._closeViewWhenClickedOutside = __bind(this._closeViewWhenClickedOutside, this);
        return SettingsView.__super__.constructor.apply(this, arguments);
      }

      SettingsView.prototype.template = settingsTpl;

      SettingsView.prototype.className = 'modal-content settings-box';

      SettingsView.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        this.eleModel = opt.eleModel;
        return SettingsView.__super__.initialize.call(this, opt);
      };

      SettingsView.prototype.onRender = function() {
        this.$el.find('input[type="checkbox"]').checkbox();
        return this.setFields();
      };

      SettingsView.prototype.setFields = function() {
        if (this.eleModel.get('draggable') === true) {
          return this.$el.find('input[name="draggable"]').checkbox('check');
        }
      };

      SettingsView.prototype.events = {
        'click': function(evt) {
          return evt.stopPropagation();
        },
        'click .close-settings': function(evt) {
          evt.preventDefault();
          return App.settingsRegion.close();
        },
        'click .set-column-count a.btn': function(evt) {
          return this.trigger("element:column:count:changed", parseInt($(evt.target).text()));
        },
        'change select[name="style"]': function(evt) {
          return this.trigger("element:style:changed", $(evt.target).val());
        },
        'change input[name="draggable"]': function(evt) {
          return this.trigger("element:draggable:changed", $(evt.target).is(':checked'));
        }
      };

      SettingsView.prototype.onShow = function() {
        return $(window).on('click', this._closeViewWhenClickedOutside);
      };

      SettingsView.prototype._closeViewWhenClickedOutside = function() {
        console.log('window clicked closing setting');
        return this.close();
      };

      SettingsView.prototype.onClose = function() {
        return $(window).off('click', this._closeViewWhenClickedOutside);
      };

      return SettingsView;

    })(Marionette.ItemView);
  });
});
