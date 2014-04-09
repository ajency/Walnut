var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.Element.ImageWithText.Views', function(Views, App, Backbone, Marionette, $, _) {
    return Views.ImageWithTextView = (function(_super) {
      __extends(ImageWithTextView, _super);

      function ImageWithTextView() {
        this.configureEditor = __bind(this.configureEditor, this);
        return ImageWithTextView.__super__.constructor.apply(this, arguments);
      }

      ImageWithTextView.prototype.className = 'imagewithtext';

      ImageWithTextView.prototype.template = '{{#image}} <img src="{{imageurl}}" alt="{{title}}" class="{{alignclass}} img-responsive"/> {{/image}} {{#placeholder}} <div class="image-placeholder"><span class="bicon icon-uniF10E"></span>Upload Image</div> {{/placeholder}} <p class="editor"></p> <div class="clearfix"></div>';

      ImageWithTextView.prototype.mixinTemplateHelpers = function(data) {
        data = ImageWithTextView.__super__.mixinTemplateHelpers.call(this, data);
        data.holder = '';
        if (this.model.isNew()) {
          data.placeholder = true;
        } else {
          data.image = true;
          data.imageurl = function() {
            if (this.sizes['thumbnail']) {
              return this.sizes['thumbnail'].url;
            } else {
              return this.sizes['full'].url;
            }
          };
        }
        data.alignclass = function() {
          switch (this.align) {
            case 'left':
              return 'pull-left';
            case 'right':
              return 'pull-right';
          }
        };
        return data;
      };

      ImageWithTextView.prototype.events = {
        'click img,.image-placeholder': function(e) {
          return this.trigger("show:media:manager");
        },
        'blur p.editor': function(e) {
          return this.trigger("text:element:blur", this.$el.children('p.editor').html());
        }
      };

      ImageWithTextView.prototype.onStyleUpadted = function(newStyle, prevStyle) {
        return this.$el.removeClass(prevStyle).addClass(newStyle);
      };

      ImageWithTextView.prototype.onRender = function() {
        var style;
        style = Marionette.getOption(this, 'style');
        return this.onStyleUpadted(_.slugify(style), '');
      };

      ImageWithTextView.prototype.onShow = function() {
        var content;
        this.$el.children('p.editor').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        CKEDITOR.on('instanceCreated', this.configureEditor);
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.children('p.editor').attr('id')));
        content = Marionette.getOption(this, 'templateHelpers').content;
        return this.editor.setData(_.stripslashes(content));
      };

      ImageWithTextView.prototype.configureEditor = function(event) {
        var editor, element;
        editor = event.editor;
        element = editor.element;
        return editor.on("configLoaded", function() {
          return editor.config.toolbar = [
            {
              name: 'clipboard',
              groups: ['clipboard', 'undo'],
              items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
            }, {
              name: 'editing',
              groups: ['find', 'selection', 'spellchecker'],
              items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']
            }, '/', {
              name: 'basicstyles',
              groups: ['basicstyles', 'cleanup'],
              items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            }, {
              name: 'paragraph',
              groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
              items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
            }, {
              name: 'insert',
              items: ['SpecialChar', 'EqnEditor']
            }, '/', {
              name: 'styles',
              items: ['Styles', 'Format', 'Font', 'FontSize']
            }, {
              name: 'colors',
              items: ['TextColor', 'BGColor']
            }
          ];
        });
      };

      return ImageWithTextView;

    })(Marionette.ItemView);
  });
});
