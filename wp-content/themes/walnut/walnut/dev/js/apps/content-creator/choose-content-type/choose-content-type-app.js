var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
  return App.module("ContentCreator.Controller", function(Controller, App) {
    var ChooseContentTypeView;
    Controller.ChooseContentType = (function(superClass) {
      extend(ChooseContentType, superClass);

      function ChooseContentType() {
        this._getChooseContentTypeView = bind(this._getChooseContentTypeView, this);
        return ChooseContentType.__super__.constructor.apply(this, arguments);
      }

      ChooseContentType.prototype.initialize = function() {
        var breadcrumb_items, view;
        breadcrumb_items = {
          'items': [
            {
              'label': 'Dashboard',
              'link': 'javascript://'
            }, {
              'label': 'Content Management',
              'link': 'javascript:;'
            }, {
              'label': 'Choose Content Type',
              'link': 'javascript:;',
              'active': 'active'
            }
          ]
        };
        App.execute("update:breadcrumb:model", breadcrumb_items);
        this.view = view = this._getChooseContentTypeView();
        return this.show(view, {
          loading: true
        });
      };

      ChooseContentType.prototype._getChooseContentTypeView = function() {
        return new ChooseContentTypeView;
      };

      return ChooseContentType;

    })(RegionController);
    return ChooseContentTypeView = (function(superClass) {
      extend(ChooseContentTypeView, superClass);

      function ChooseContentTypeView() {
        return ChooseContentTypeView.__super__.constructor.apply(this, arguments);
      }

      ChooseContentTypeView.prototype.template = '<h1 class="text-center muted m-b-20">Select a <span class="bold">content type</span> to create</h1> <div class="col-sm-4"> <div class="tiles white text-center"> <a class="heading p-t-40 p-b-40" href="#create-content/teacher_question"> Teacher Question </a> </div> </div> <div class="col-sm-4"> <div class="tiles white text-center"> <a class="heading p-t-40 p-b-40" href="#create-content/student_question"> Student Question </a> </div> </div> <div class="col-sm-4"> <div class="tiles white text-center"> <a class="heading p-t-40 p-b-40" href="#create-content/content_piece"> Content </a> </div> </div> </div>';

      ChooseContentTypeView.prototype.className = 'row creator';

      return ChooseContentTypeView;

    })(Marionette.ItemView);
  });
});
