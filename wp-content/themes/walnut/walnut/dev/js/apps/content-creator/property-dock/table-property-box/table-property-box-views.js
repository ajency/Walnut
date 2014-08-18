var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.PropertyDock.TablePropertyBox.Views', function(Views, App) {
    return Views.PropertyView = (function(_super) {
      __extends(PropertyView, _super);

      function PropertyView() {
        return PropertyView.__super__.constructor.apply(this, arguments);
      }

      PropertyView.prototype.template = '<div class="tile-more-content no-padding"> <div class="tiles green"> <div class="tile-footer drag"> Sort <i class="fa fa-chevron-right"></i> <span class="semi-bold">Sort Properties</span> </div> <div class="docket-body"> <div class="control-group"> <label for="spinner-01">Columns: </label> <div class="input-group spinner column-spinner"> <input type="text" class="form-control" value="{{column}}"> <div class="input-group-btn-vertical"> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button> </div> </div> </div> <div class="control-group"> <label for="spinner-02">Rows: </label> <div class="input-group spinner row-spinner"> <input type="text" class="form-control" value="{{row}}"> <div class="input-group-btn-vertical"> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-up"></i></button> <button class="btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></button> </div> </div> </div> <div class="control-group "> <label for="properties">Properties: </label> <div class="checkbox check-success"> <input type="checkbox" value="" id="checkbox-bordered" data-toggle="checkbox"> <label class="checkbox" for="checkbox-bordered"> Bordered </label> <input type="checkbox" value="" id="checkbox-striped" data-toggle="checkbox"> <label class="checkbox" for="checkbox-striped"> Striped </label> </div> </div> <div class="control-group styles"> <label for="style">Style: </label> <select id="table-style"> <option value="style-1">Style 1</option> <option value="style-2">Style 2</option> </select> </div> </div> </div> </div>';

      PropertyView.prototype.events = {
        'click .spinner .btn:first-of-type': 'increaseCount',
        'click .spinner .btn:last-of-type': 'decreaseCount',
        'change #checkbox-bordered': 'changeBordered',
        'change #checkbox-striped': 'changeStriped',
        'change #table-style': 'changeStyle'
      };

      PropertyView.prototype.modelEvents = {
        'change:row': 'changeRowCount',
        'change:column': 'changeColCount'
      };

      PropertyView.prototype.onShow = function() {
        this.$el.find('#checkbox-bordered').prop('checked', this.model.get('bordered'));
        this.$el.find('#checkbox-striped').prop('checked', this.model.get('striped'));
        return this.$el.find('#table-style').val(this.model.get('style'));
      };

      PropertyView.prototype.increaseCount = function(evt) {
        evt.stopPropagation();
        $(evt.target).closest('.spinner').find('input').val(parseInt($(evt.target).closest('.spinner').find('input').val(), 10) + 1);
        if ($(evt.target).closest('.spinner').hasClass('column-spinner')) {
          this.model.set('column', parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
        if ($(evt.target).closest('.spinner').hasClass('row-spinner')) {
          return this.model.set('row', parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
      };

      PropertyView.prototype.decreaseCount = function(evt) {
        evt.stopPropagation();
        $(evt.target).closest('.spinner').find('input').val(parseInt($(evt.target).closest('.spinner').find('input').val(), 10) - 1);
        if ($(evt.target).closest('.spinner').hasClass('column-spinner')) {
          this.model.set('column', parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
        if ($(evt.target).closest('.spinner').hasClass('row-spinner')) {
          return this.model.set('row', parseInt($(evt.target).closest('.spinner').find('input').val()));
        }
      };

      PropertyView.prototype.changeRowCount = function(model, row) {
        return this.$el.find('.row-spinner input').val(row);
      };

      PropertyView.prototype.changeColCount = function(model, column) {
        return this.$el.find('.column-spinner input').val(column);
      };

      PropertyView.prototype.changeBordered = function(e) {
        if ($(e.target).prop('checked')) {
          return this.model.set('bordered', true);
        } else {
          return this.model.set('bordered', false);
        }
      };

      PropertyView.prototype.changeStriped = function(e) {
        if ($(e.target).prop('checked')) {
          return this.model.set('striped', true);
        } else {
          return this.model.set('striped', false);
        }
      };

      PropertyView.prototype.changeStyle = function(e) {
        return this.model.set('style', _.slugify($(e.target).val()));
      };

      return PropertyView;

    })(Marionette.ItemView);
  });
});
