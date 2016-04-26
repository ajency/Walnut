var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Communications", function(Communications, App, Backbone, Marionette, $, _) {
    var API;
    Communications.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.defaults = {
        component: '',
        communication_type: '',
        recipients: [],
        status: '',
        date: '',
        priority: 0,
        communication_mode: '',
        additional_data: []
      };

      ItemModel.prototype.name = 'communications';

      ItemModel.prototype.getRecipients = function() {
        var data, defer, url;
        url = AJAXURL + '?action=get-communication-recipients';
        data = this.toJSON();
        defer = $.Deferred();
        $.post(url, data, (function(_this) {
          return function(response) {
            console.log(response);
            return defer.resolve(response);
          };
        })(this), 'json');
        return defer.promise();
      };

      ItemModel.prototype.getPreview = function(recipient) {
        var data, defer, url;
        console.log(recipient);
        console.log(this.toJSON());
        url = AJAXURL + '?action=get-communication-preview';
        data = this.toJSON();
        data.additional_data.preview_recipient = recipient.toJSON();
        defer = $.Deferred();
        $.post(url, data, (function(_this) {
          return function(response) {
            console.log(response);
            return defer.resolve(response);
          };
        })(this), 'json');
        return defer.promise();
      };

      return ItemModel;

    })(Backbone.Model);
    Communications.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Communications.ItemModel;

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-communications';
      };

      ItemCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return ItemCollection;

    })(Backbone.Collection);
    API = {
      createCommunication: function(data) {
        var CommunicationsModel;
        CommunicationsModel = new Communications.ItemModel();
        CommunicationsModel.set(data);
        return CommunicationsModel;
      }
    };
    return App.reqres.setHandler("create:communication", function(data) {
      return API.createCommunication(data);
    });
  });
});
