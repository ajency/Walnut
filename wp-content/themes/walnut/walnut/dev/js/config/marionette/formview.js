var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['marionette'], function(Marionette) {
  return Marionette.FormView = (function(superClass) {
    extend(FormView, superClass);

    function FormView() {
      return FormView.__super__.constructor.apply(this, arguments);
    }

    FormView.prototype.tagName = 'form';

    FormView.prototype.className = 'form-horizontal clearfix';

    FormView.prototype.onShow = function() {
      var options;
      options = this._getOptions();
      return this.$el.validate(options);
    };

    FormView.prototype._getOptions = function() {
      if (!this.options) {
        this.options = {};
      }
      return _.defaults(this.options, {
        debug: true,
        success: "success",
        ignore: '.ignore',
        errorClass: 'p-message',
        submitHandler: this.submitForm
      });
    };

    FormView.prototype.submitForm = function(form) {
      throw new Error('Submit handler not defined');
      return form.submit();
    };

    return FormView;

  })(Marionette.ItemView);
});
