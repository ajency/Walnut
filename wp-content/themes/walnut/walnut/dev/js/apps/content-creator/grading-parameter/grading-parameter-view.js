var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app'], function(App) {
  return App.module('ContentCreator.GradingParameter.Views', function(Views, App) {
    var GradingParamsItemView;
    GradingParamsItemView = (function(_super) {
      __extends(GradingParamsItemView, _super);

      function GradingParamsItemView() {
        return GradingParamsItemView.__super__.constructor.apply(this, arguments);
      }

      GradingParamsItemView.prototype.className = 'singleParam';

      GradingParamsItemView.prototype.template = '<div class="row m-b-10"> <div class="col-sm-4"> <input id="parameter" type="text" placeholder="Parameter name" class="w100" value="{{parameter}}"> </div><div class="saved" style="color: dodgerblue;display: none">Updated</div><div class="changed" style="color: #ff0000; display: none">Changed</div> </div> <div class="row p-b-15"> {{#attributes}} <div class="col-sm-3"> <input type="text" placeholder="Attribute" class="w100 attribute" value="{{.}}"> </div> {{/attributes}} </div> <div class="row b-grey b-b p-b-15 m-b-15"> <div class="col-sm-12"> <button id="btn-delete" class="btn btn-default btn-sm btn-small pull-right">Delete</button> <button id="btn-save" class="btn btn-success btn-sm btn-small pull-right m-r-10">Save</button> </div> </div>';

      GradingParamsItemView.prototype.mixinTemplateHelpers = function(data) {
        data = GradingParamsItemView.__super__.mixinTemplateHelpers.call(this, data);
        while (data.attributes.length < 4) {
          data.attributes.push('');
        }
        return data;
      };

      GradingParamsItemView.prototype.events = {
        'click #btn-save': '_saveGradingParameter',
        'click #btn-delete': '_deleteGradingParameter',
        'change input': '_inputChanged'
      };

      GradingParamsItemView.prototype._saveGradingParameter = function() {
        var attributes;
        if (this.$el.find('input#parameter').val() === '') {
          return;
        }
        attributes = new Array();
        _.each(this.$el.find('input.attribute'), function(attributeInput) {
          if ($(attributeInput).val() !== '') {
            return attributes.push($(attributeInput).val());
          }
        });
        if (!attributes.length) {
          return;
        }
        this.model.set('parameter', this.$el.find('input#parameter').val());
        this.model.set('attributes', attributes);
        this.trigger('save:grading:parameter');
        this.$el.find('.saved').show();
        return this.$el.find('.changed').hide();
      };

      GradingParamsItemView.prototype._deleteGradingParameter = function() {
        return this.trigger('delete:grading:parameter');
      };

      GradingParamsItemView.prototype._inputChanged = function() {
        this.$el.find('.saved').hide();
        return this.$el.find('.changed').show();
      };

      return GradingParamsItemView;

    })(Marionette.ItemView);
    return Views.GradingParamsView = (function(_super) {
      __extends(GradingParamsView, _super);

      function GradingParamsView() {
        return GradingParamsView.__super__.constructor.apply(this, arguments);
      }

      GradingParamsView.prototype.className = 'createParameters';

      GradingParamsView.prototype.template = '<h4 class="semi-bold">Grading Parameters</h4> <div id="grading-params-table"> </div> <div class="row"> <div class="col-sm-12"> <button id="add-parameter" class="btn btn-info btn-block btn-small h-center block addParam">Add Parameter</button> </div> </div>';

      GradingParamsView.prototype.itemViewContainer = '#grading-params-table';

      GradingParamsView.prototype.itemView = GradingParamsItemView;

      GradingParamsView.prototype.events = {
        'click button#add-parameter': '_addParameter'
      };

      GradingParamsView.prototype._addParameter = function() {
        return this.trigger('add:new:grading:parameter');
      };

      return GradingParamsView;

    })(Marionette.CompositeView);
  });
});
