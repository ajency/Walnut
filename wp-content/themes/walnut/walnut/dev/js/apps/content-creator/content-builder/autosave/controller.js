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

      Controller.prototype.autoSave = function() {
        var siteRegion, _json;
        siteRegion = App.mainContentRegion.$el;
        _json = this._getPageJson(siteRegion);
        if (!_.isObject(_json)) {
          throw new Error("invalid json...");
        }
        console.log(JSON.stringify(_json));
        return localStorage.setItem('layout', JSON.stringify(_json));
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
            var ele;
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
