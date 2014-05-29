var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/content-creator/content-builder/elements/image/settings/templates/settings.html'], function(App, settingsTpl) {
  return App.module('ContentCreator.ContentBuilder.Element.Image.Settings.Views', function(Views, App, Backbone, Marionette, $, _) {
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
        this.$el.find('select').select2({
          minimumResultsForSearch: -1
        });
        return this.setFields();
      };

      SettingsView.prototype.setFields = function() {
        if (this.eleModel.get('draggable') === true) {
          this.$el.find('input[name="draggable"]').checkbox('check');
        }
        this.$el.find('select[name="align"]').select2('val', this.eleModel.get('align'));
        this.$el.find('select[name="top_margin"]').select2('val', this.eleModel.get('top_margin'));
        this.$el.find('select[name="left_margin"]').select2('val', this.eleModel.get('left_margin'));
        this.$el.find('select[name="bottom_margin"]').select2('val', this.eleModel.get('bottom_margin'));
        return this.$el.find('select[name="right_margin"]').select2('val', this.eleModel.get('right_margin'));
      };

      SettingsView.prototype.events = {
        'click': function(evt) {
          return evt.stopPropagation();
        },
        'click .close-settings': function(evt) {
          evt.preventDefault();
          return App.settingsRegion.close();
        },
        'change input[name="draggable"]': function(evt) {
          return this.trigger("element:draggable:changed", $(evt.target).is(':checked'));
        },
        'change select[name="align"]': function(evt) {
          return this.trigger("element:alignment:changed", $(evt.target).val());
        },
        'change select.spacing': function(evt) {
          return this.trigger("element:spacing:changed", $(evt.target).attr('name'), $(evt.target).val());
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
