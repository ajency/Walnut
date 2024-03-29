var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['marionette', 'mustache', 'text!config/marionette/templates/modal.html'], function(Marionette, Mustache, modalTpl) {
  return Marionette.Region.Dialog = (function(superClass) {
    extend(Dialog, superClass);

    function Dialog() {
      return Dialog.__super__.constructor.apply(this, arguments);
    }

    Dialog.prototype.template = modalTpl;

    Dialog.prototype.open = function(view) {
      var options, wrapper;
      options = view.dialogOptions ? view.dialogOptions : {};
      options = this._getOptions(options);
      wrapper = Mustache.to_html(modalTpl, options);
      this.$el.html(wrapper);
      this.$el.find('.modal-body').append(view.el);
      return this.$el.addClass(options.modal_size + ' modal');
    };

    Dialog.prototype.onShow = function(view) {
      this.setupBindings(view);
      this.$el.modal();
      this.$el.modal('show');
      return this.$el.on('hidden.bs.modal', (function(_this) {
        return function() {
          return _this.clearDialog();
        };
      })(this));
    };

    Dialog.prototype.reloadCollection = function(collection) {
      console.log('reloadCollection');
      return Backbone.trigger("reload:collection", this.collection);
    };

    Dialog.prototype.closeDialog = function() {
      return this.$el.modal('hide');
    };

    Dialog.prototype._getOptions = function(options) {
      return _.defaults(options, {
        modal_title: '',
        modal_size: 'wide-modal'
      });
    };

    Dialog.prototype.setupBindings = function(view) {
      this.listenTo(view, 'dialog:close', this.closeDialog);
      return this.listenTo(view, 'dialog:resize', this.resizeDialog);
    };

    Dialog.prototype.clearDialog = function() {
      this.close();
      return this.$el.empty();
    };

    return Dialog;

  })(Marionette.Region);
});
