var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.Text.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.TextView = (function(_super) {
      __extends(TextView, _super);

      function TextView() {
        this.configureEditor = __bind(this.configureEditor, this);
        return TextView.__super__.constructor.apply(this, arguments);
      }

      TextView.prototype.tagName = 'p';

      TextView.prototype.template = '';

      TextView.prototype.className = 'text';

      TextView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur': function() {
          return this.trigger("text:element:blur", this.$el.html());
        }
      };

      TextView.prototype.onShow = function() {
        this.$el.attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.attr('id')));
        return this.editor.setData(_.stripslashes(this.model.get('content')));
      };

      TextView.prototype.configureEditor = function(event) {
        var editor, element;
        editor = event.editor;
        element = editor.element;
        return editor.on("configLoaded", function() {
          return editor.config.toolbarGroups = [
            {
              name: "paragraph",
              groups: ["list", "indent", "blocks", "align", "bidi"]
            }, {
              name: 'colors'
            }
          ];
        });
      };

      TextView.prototype.onClose = function() {
        return this.editor.destroy();
      };

      return TextView;

    })(Marionette.ItemView);
  });
});
