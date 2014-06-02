var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module("ContentCreator.ContentBuilder.Element.Fib.Views", function(Views, App, Backbone, Marionette, $, _) {
    return Views.FibView = (function(_super) {
      __extends(FibView, _super);

      function FibView() {
        this._updateInputProperties = __bind(this._updateInputProperties, this);
        this._onClickOfBlank = __bind(this._onClickOfBlank, this);
        this._initializeEachBlank = __bind(this._initializeEachBlank, this);
        this._afterCKEditorInitialization = __bind(this._afterCKEditorInitialization, this);
        return FibView.__super__.constructor.apply(this, arguments);
      }

      FibView.prototype.className = 'fib-text';

      FibView.prototype.modelEvents = {
        'change:font': function(model, font) {
          return this._changeFont(font);
        },
        'change:font_size': function(model, fontSize) {
          return this._changeFontSize(fontSize);
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
        },
        'change:numberOfBlanks': '_changeNumberOfBlanks'
      };

      FibView.prototype.events = {
        'click a': function(e) {
          return e.preventDefault();
        },
        'blur .fib-text': 'onSaveText'
      };

      FibView.prototype.onShow = function() {
        this.$el.parent().parent().on('click', (function(_this) {
          return function(evt) {
            _this.trigger("show:this:fib:properties");
            _this.trigger("close:question:element:properties");
            return evt.stopPropagation();
          };
        })(this));
        this.$el.attr('contenteditable', 'true').attr('id', _.uniqueId('text-'));
        this.editor = CKEDITOR.inline(document.getElementById(this.$el.attr('id')));
        this.editor.setData(_.stripslashes(this.model.get('text')));
        return _.delay(this._afterCKEditorInitialization, 500);
      };

      FibView.prototype._afterCKEditorInitialization = function() {
        $("#cke_" + this.editor.name).on('click', function(evt) {
          return evt.stopPropagation();
        });
        this.$el.append('<p class=\"hidden-align-fix\" contenteditable=\"false\" style=\"display:none;\"></p>');
        if (!parseInt(this.model.get('numberOfBlanks'))) {
          this.model.set('numberOfBlanks', 1);
        } else {
          this.$el.find('input').wrap('<span contenteditable="false"></span>');
          this.$el.find('input').before('<span class="fibno"></span>');
          this.$el.find("input").on('click', this._onClickOfBlank);
          this.model.get('blanksArray').each(this._initializeEachBlank);
        }
        console.log("now checking dom tree");
        this.$el.on('DOMSubtreeModified', this._updateInputProperties);
        return this._updateInputProperties();
      };

      FibView.prototype._initializeEachBlank = function(blanksModel) {
        this._changeBlankSize(blanksModel, blanksModel.get('blank_size'));
        this._changeCorrectAnswers(blanksModel, blanksModel.get('correct_answers'));
        this.listenTo(blanksModel, 'change:correct_answers', this._changeCorrectAnswers);
        return this.listenTo(blanksModel, 'change:blank_size', this._changeBlankSize);
      };

      FibView.prototype._changeNumberOfBlanks = function(model, numberOfBlanks) {
        var noOfBlanksToAdd, noOfBlanksToRemove;
        if (this.$el.find('input').length !== numberOfBlanks) {
          if (numberOfBlanks > model.previous('numberOfBlanks')) {
            noOfBlanksToAdd = numberOfBlanks - model.previous('numberOfBlanks');
            this._addBlanks(noOfBlanksToAdd);
            return console.log(noOfBlanksToAdd);
          } else if (numberOfBlanks < model.previous('numberOfBlanks')) {
            noOfBlanksToRemove = model.previous('numberOfBlanks') - numberOfBlanks;
            console.log(noOfBlanksToRemove);
            return this._removeBlanks(noOfBlanksToRemove);
          }
        }
      };

      FibView.prototype._removeBlanks = function(noOfBlanksToRemove) {
        var _results;
        _results = [];
        while (noOfBlanksToRemove !== 0) {
          this.$el.find('input').last().parent().remove();
          _results.push(noOfBlanksToRemove--);
        }
        return _results;
      };

      FibView.prototype._addBlanks = function(noOfBlanksToAdd) {
        var blanksModel, inputId, inputNumber, _results;
        _results = [];
        while (noOfBlanksToAdd !== 0) {
          inputId = _.uniqueId('input-');
          inputNumber = this.model.get('blanksArray').size() + 1;
          this.trigger("create:new:fib:element", inputId);
          this.$el.find('p').first().append("<span contenteditable='false'> <span class='fibno'>" + inputNumber + "</span><input type='text' data-id='" + inputId + "' data-cke-editable='1' style=' height :100%' contenteditable='false' disabled></span>&nbsp;&nbsp;");
          blanksModel = this.model.get('blanksArray').get(inputId);
          this._initializeEachBlank(blanksModel);
          this.$el.find("input").on('click', this._onClickOfBlank);
          _results.push(noOfBlanksToAdd--);
        }
        return _results;
      };

      FibView.prototype._onClickOfBlank = function(e) {
        var blanksModel, inputId;
        inputId = $(e.target).attr('data-id');
        blanksModel = this.model.get('blanksArray').get(inputId);
        App.execute("show:fib:element:properties", {
          model: blanksModel,
          fibModel: this.model
        });
        this.trigger("show:this:fib:properties");
        return e.stopPropagation();
      };

      FibView.prototype._changeFont = function(font) {
        return this.$el.find('input').css('font-family', font);
      };

      FibView.prototype._changeFontSize = function(fontSize) {
        return this.$el.find('input').css('font-size', "" + fontSize + "px");
      };

      FibView.prototype._changeColor = function(color) {
        return this.$el.find('input').css('color', color);
      };

      FibView.prototype._changeBGColor = function(model) {
        return this.$el.find('input').css('background-color', _.convertHex(this.model.get('bg_color'), this.model.get('bg_opacity')));
      };

      FibView.prototype._changeFibStyle = function(style) {
        if (style === 'uline') {
          return this.$el.find('input').removeClass("border").addClass("underline");
        } else if (style === 'box') {
          return this.$el.find('input').removeClass("underline").addClass("border");
        } else {
          return this.$el.find('input').removeClass("underline border");
        }
      };

      FibView.prototype._changeCorrectAnswers = function(model, answerArray) {
        if (answerArray.length) {
          return this.$el.find("input[data-id=" + model.id + "]").val(answerArray[0]);
        }
      };

      FibView.prototype._changeBlankSize = function(model, blankSize) {
        return this.$el.find("input[data-id=" + model.id + "]").attr('size', blankSize);
      };

      FibView.prototype.onSaveText = function() {
        var formatedText;
        formatedText = this.$el.find('p').first().clone();
        $(formatedText).find('input').attr('value', '');
        $(formatedText).find('input').unwrap();
        $(formatedText).find('input').prev().remove();
        this.model.set('text', formatedText.html());
        console.log(formatedText.html());
        return console.log(this.model);
      };

      FibView.prototype._updateInputProperties = function() {
        _.each(this.$el.find('input'), (function(_this) {
          return function(blank, index) {
            return _.delay(function() {
              var blanksModel;
              blanksModel = _this.model.get('blanksArray').get($(blank).attr('data-id'));
              if (blanksModel !== void 0) {
                blanksModel.set('blank_index', index + 1);
              }
              if (parseInt($(blank).prev().text()) !== index + 1) {
                return $(blank).prev().text(index + 1);
              }
            }, 20);
          };
        })(this));
        _.delay((function(_this) {
          return function() {
            if (_this.model.get('blanksArray').size() > 0) {
              return _this.model.get('blanksArray').each(function(blank) {
                var blankFound;
                blankFound = _.find(_this.$el.find('input'), function(blankUI) {
                  return blank.get('id') === $(blankUI).attr('data-id');
                });
                if (_.isUndefined(blankFound)) {
                  console.log(' in remove');
                  _this.model.get('blanksArray').remove(blank);
                  _this.trigger('close:question:element:properties');
                  if (_this.model.get('blanksArray').size() < _this.model.get('numberOfBlanks')) {
                    return _this.model.set('numberOfBlanks', _this.model.get('numberOfBlanks') - 1);
                  }
                }
              });
            }
          };
        })(this), 500);
        this._changeFont(this.model.get('font'));
        this._changeFontSize(this.model.get('font_size'));
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
