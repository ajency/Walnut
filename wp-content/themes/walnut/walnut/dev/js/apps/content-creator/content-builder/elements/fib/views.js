var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Fib.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        this.configureEditor = __bind(this.configureEditor, this);
        return FibView.__super__.constructor.apply(this, arguments);
      }

      FibView.prototype.template = '<p class="fib-text" ></p>';

      FibView.prototype.modelEvents = {
        'change:font': function(model, font) {
          return this._changeFont(font);
        },
        'change:font_size': function(model, size) {
          return this._changeSize(size);
        },
        'change:color': function(model, color) {
          return this._changeColor(color);
        },
        'change:bg_color': function(model, bg_color) {
          return this._changeBGColor(model);
        },
        'change:bg_opacity': function(model, bg_opacity) {
          return this._changeBGColor(model);
        },
        'change:style': function(model, style) {
          return this._changeFibStyle(style);
        }
      };

      FibView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur p': '_textBlur',
        'DOMSubtreeModified p': '_updateInputProperties'
      };

      FibView.prototype.initialize = function(options) {
        return this.blanksCollection = options.blanksCollection;
      };

      FibView.prototype.onShow = function() {
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:fib:properties");
            return evt.stopPropagation();
          };
        })(this));
        this.$el.find('p').attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        CKEDITOR.on('instanceCreated', this.configureEditor);
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.find('p').attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        return _.delay((function(_this) {
          return function() {
            return $('#cke_' + _this.editor.name).on('click', function(evt) {
              return evt.stopPropagation();
            });
          };
        })(this), 500);
      };

      FibView.prototype.configureEditor = function(event) {
        var editor, element;
        editor = event.editor;
        element = editor.element;
        return editor.on("configLoaded", function() {
          return editor.config.toolbar.splice(2, 0, {
            name: 'forms',
            items: ['TextField']
          });
        });
      };

      FibView.prototype._changeFont = function(font) {
        return this.$el.find('input').css('font-family', font);
      };

      FibView.prototype._changeSize = function(size) {
        return this.$el.find('input').css('font-size', size + "px");
      };

      FibView.prototype._changeColor = function(color) {
        return this.$el.find('input').css('color', color);
      };

      FibView.prototype._changeBGColor = function(model) {
        return this.$el.find('input').css('background-color', _.convertHex(this.model.get('bg_color'), this.model.get('bg_opacity')));
      };

      FibView.prototype._changeFibStyle = function(style) {
        if (style === 'uline') {
          return this.$el.find('input').css('border-style', 'none none groove none');
        } else if (style === 'box') {
          return this.$el.find('input').css('border-style', 'groove');
        } else {
          return this.$el.find('input').css('border-style', 'none');
        }
      };

      FibView.prototype._textBlur = function(evt) {
        return this.model.set('text', this.$el.find('p').html());
      };

      FibView.prototype._updateInputProperties = function() {
        _.each(this.$el.find('input'), (function(_this) {
          return function(blank) {
            var blanksData, blanksModel;
            if (_.isUndefined($(blank).attr('data-id'))) {
              $(blank).attr('data-id', _.uniqueId('input-'));
              blanksData = {
                id: $(blank).attr('data-id'),
                correct: [],
                marks: 1,
                maxlength: 12
              };
              _this.trigger("create:new:fib:element", blanksData);
              blanksModel = _this.blanksCollection.get($(blank).attr('data-id'));
              return $(blank).on('click', function() {
                return console.log(blanksModel);
              });
            }
          };
        })(this));
        _.delay((function(_this) {
          return function() {
            if (_this.blanksCollection.length > 0) {
              return _.each(_this.blanksCollection.toJSON(), function(blank) {
                var blankFound;
                blankFound = _.find(_this.$el.find('input'), function(blankUI) {
                  return _this.blanksCollection.get(blank.id).get('id') === $(blankUI).attr('data-id');
                });
                if (_.isUndefined(blankFound)) {
                  return _this.blanksCollection.remove(blank);
                }
              });
            }
          };
        })(this), 100);
        console.log(JSON.stringify(this.blanksCollection));
        this._changeFont(this.model.get('font'));
        this._changeSize(this.model.get('font_size'));
        this._changeColor(this.model.get('color'));
        this._changeBGColor(this.model);
        return this._changeFibStyle(this.model.get('style'));
      };

      FibView.prototype.onClose = function() {
        return this.editor.destroy();
      };

      return FibView;

    })(Marionette.ItemView);
  });
});
