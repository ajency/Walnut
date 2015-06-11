var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.ContentBuilder.AutoSave', function(AutoSave, App, Backbone, Marionette, $, _) {
    AutoSave.Controller = (function(_super) {
      __extends(Controller, _super);

      function Controller() {
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
      };

      Controller.prototype.autoSave = function(contentPieceModel) {
        var data, options, siteRegion, valid_content, _json;
        siteRegion = App.mainContentRegion.$el;
        _json = this._getPageJson(siteRegion);
        if (!_.isObject(_json)) {
          throw new Error("invalid json...");
        }
        data = contentPieceModel.toJSON();
        delete data.layout;
        data.action = 'save-content-piece-json';
        data.json = _json;
        options = {
          type: 'POST',
          url: AJAXURL,
          data: data
        };
        valid_content = true;
        if (data.content_type === 'student_question') {
          if (this._questionExists() && this._checkIfMarksEntered()) {
            valid_content = true;
          } else {
            valid_content = false;
          }
        } else if (data.post_status !== 'pending') {
          if (_.isEmpty(data.json)) {
            this._showEmptyCanvasError(data.post_status);
            valid_content = false;
          }
        }
        if (valid_content) {
          $('#saved-successfully, #save-fail').remove();
          return $.ajax(options).done(function(response) {
            contentPieceModel.set({
              'ID': response.ID
            });
            $(".page-title").before('<div id="saved-successfully" style="text-align:center;" class="alert alert-success">Content Piece Saved Successfully</div>');
            return setTimeout(function() {
              return $('#saved-successfully').remove();
            }, 3000);
          }).fail(function(resp) {
            return console.log('error');
          });
        }
      };

      Controller.prototype._questionExists = function() {
        var elements, question_exists;
        elements = App.mainContentRegion.$el.find('#myCanvas').find('form input[name="element"]');
        question_exists = false;
        _.each(elements, function(element, index) {
          var _ref;
          if ((_ref = $(element).val()) === 'Fib' || _ref === 'Mcq' || _ref === 'Sort' || _ref === 'Hotspot' || _ref === 'BigAnswer') {
            return question_exists = true;
          }
        });
        if (!question_exists) {
          this._showNoQuestionExistsError();
          return false;
        } else {
          return true;
        }
      };

      Controller.prototype._checkIfMarksEntered = function() {
        var elements;
        elements = App.mainContentRegion.$el.find('#myCanvas').find('.element-wrapper');
        return _.every(elements, function(element) {
          var error_info, msg, _ref;
          $('#saved-successfully, #save-fail').remove();
          if (((_ref = $(element).find('form input[name="element"]').val()) === 'Fib' || _ref === 'Mcq' || _ref === 'Sort' || _ref === 'Hotspot' || _ref === 'BigAnswer') && $(element).find('form input[name="complete"]').val() === 'false') {
            msg = 'Ensure you have set the marks and added valid answers to save the question';
            error_info = $(element).find('form input[name="error_info"]').val();
            if (!_.isEmpty(error_info)) {
              msg = error_info;
            }
            $(".page-title").before('<div id="save-failure" style="text-align:center;" class="alert alert-failure">' + msg + '</div>');
            setTimeout(function() {
              return $('#save-failure').remove();
            }, 3000);
            return false;
          } else {
            return true;
          }
        });
      };

      Controller.prototype._showNoQuestionExistsError = function() {
        $('#saved-successfully, #save-fail').remove();
        $(".page-title").before('<div id="save-failure" style="text-align:center;" class="alert alert-failure">To save, at least 1 question element must be included in the question area</div>');
        return setTimeout(function() {
          return $('#save-failure').remove();
        }, 3000);
      };

      Controller.prototype._showEmptyCanvasError = function(post_status) {
        $('#saved-successfully, #save-fail').remove();
        $(".page-title").before("<div id='save-failure' style='text-align:center;' class='alert alert-failure'> Cannot " + post_status + " an empty canvas </div>");
        return setTimeout(function() {
          return $('#save-failure').remove();
        }, 3000);
      };

      Controller.prototype._getPageJson = function($site) {
        var json;
        json = this._getJson($site.find('#myCanvas'));
        return json;
      };

      Controller.prototype._getJson = function($element, arr) {
        var elements;
        if (arr == null) {
          arr = [];
        }
        elements = $element.children('.element-wrapper');
        _.each(elements, (function(_this) {
          return function(element, index) {
            var ele, elementsArray;
            ele = {
              element: $(element).find('form input[name="element"]').val(),
              meta_id: parseInt($(element).find('form input[name="meta_id"]').val())
            };
            if (ele.element === 'Row') {
              ele.draggable = $(element).children('form').find('input[name="draggable"]').val() === "true";
              ele.style = $(element).children('form').find('input[name="style"]').val();
              delete ele.meta_id;
              ele.elements = [];
              _.each($(element).children('.element-markup').children('.row').children('.column'), function(column, index) {
                var className, col;
                className = $(column).attr('data-class');
                col = {
                  position: index + 1,
                  element: 'Column',
                  className: className,
                  elements: _this._getJson($(column))
                };
                ele.elements.push(col);
              });
            }
            if (ele.element === 'TeacherQuestion') {
              delete ele.meta_id;
              ele.elements = [];
              _.each($(element).children('.element-markup').children('.teacher-question').children('.teacher-question-row'), function(column, index) {
                var col;
                col = {
                  position: index + 1,
                  element: 'TeacherQuestRow',
                  elements: _this._getJson($(column))
                };
                return ele.elements.push(col);
              });
            }
            if (ele.element === 'Mcq') {
              elements = $(element).find('.mcq').children('.element-wrapper').children('.element-markup').children('.row').children('.column').find('.row').find('.element-wrapper');
              elementsArray = new Array();
              console.log(elementsArray);
              _.each(elements, function(element, index) {
                var optionNo;
                optionNo = parseInt($(element).closest('.column[data-option]').attr('data-option'));
                console.log(elementsArray[optionNo - 1]);
                elementsArray[optionNo - 1] = elementsArray[optionNo - 1] != null ? elementsArray[optionNo - 1] : new Array();
                console.log(elementsArray[optionNo - 1]);
                return elementsArray[optionNo - 1].push({
                  element: $(element).find('form input[name="element"]').val(),
                  meta_id: parseInt($(element).find('form input[name="meta_id"]').val())
                });
              });
              console.log(JSON.stringify(elementsArray));
              ele.elements = elementsArray;
            }
            return arr.push(ele);
          };
        })(this));
        return arr;
      };

      return Controller;

    })(Marionette.Controller);
    return App.reqres.setHandler("autosave:question:layout", function() {
      return new AutoSave.Controller;
    });
  });
});
