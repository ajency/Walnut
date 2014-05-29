var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(["app", 'backbone', 'unserialize'], function(App, Backbone) {
  return App.module("Entities.Divisions", function(Divisions, App, Backbone, Marionette, $, _) {
    var API, DivisionCollection, DivisionModel, divisionCollection;
    DivisionModel = (function(_super) {
      __extends(DivisionModel, _super);

      function DivisionModel() {
        return DivisionModel.__super__.constructor.apply(this, arguments);
      }

      DivisionModel.prototype.idAttribute = 'id';

      DivisionModel.prototype.defaults = {
        division: '',
        class_id: 0,
        students_count: 0
      };

      DivisionModel.prototype.name = 'division';

      return DivisionModel;

    })(Backbone.Model);
    DivisionCollection = (function(_super) {
      __extends(DivisionCollection, _super);

      function DivisionCollection() {
        return DivisionCollection.__super__.constructor.apply(this, arguments);
      }

      DivisionCollection.prototype.model = DivisionModel;

      DivisionCollection.prototype.name = 'division';

      DivisionCollection.prototype.url = function() {
        return AJAXURL + '?action=get-divisions';
      };

      DivisionCollection.prototype.parse = function(resp) {
        return resp.data;
      };

      return DivisionCollection;

    })(Backbone.Collection);
    divisionCollection = new DivisionCollection;
    API = {
      getDivisions: function(param) {
        if (param == null) {
          param = {};
        }
        if (!divisionCollection.length > 0) {
          divisionCollection.fetch({
            reset: true,
            data: param
          });
        }
        return divisionCollection;
      },
      getDivisionByID: function(id) {
        var division;
        division = divisionCollection.get(id);
        if (!division) {
          division = new DivisionModel({
            'id': id
          });
          division.fetch();
          console.log(division);
        }
        return division;
      },
      getDivisionsFromLocal: function() {
        var onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              console.log('User id: ' + _.getUserID());
              return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'divisions'], onSuccess(d), _.deferredErrorHandler(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var ids, result;
            result = [];
            ids = unserialize(unserialize(data.rows.item(0)['meta_value']));
            ids = _.compact(ids);
            console.log('ids: ' + ids);
            return tx.executeSql('SELECT cd.id AS id, cd.division AS division, cd.class_id AS class_id, COUNT(um.umeta_id) AS students_count FROM ' + _.getTblPrefix() + 'class_divisions cd LEFT JOIN wp_usermeta um ON cd.id = meta_value AND meta_key="student_division" WHERE id in (' + ids + ') GROUP BY cd.id', [], function(tx, data) {
              var i, r, _i, _ref;
              for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
                r = data.rows.item(i);
                result[i] = {
                  id: r['id'],
                  division: r['division'],
                  class_id: r['class_id'],
                  class_label: CLASS_LABEL[r['class_id']],
                  students_count: r['students_count']
                };
              }
              return d.resolve(result);
            }, _.transactionErrorHandler);
          };
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getDivisionsFromLocal transaction completed');
        }).fail(_.failureHandler);
      }
    };
    App.reqres.setHandler("get:divisions", function(opt) {
      return API.getDivisions(opt);
    });
    App.reqres.setHandler("get:division:by:id", function(id) {
      return API.getDivisionByID(id);
    });
    return App.reqres.setHandler("get:division:local", function() {
      return API.getDivisionsFromLocal();
    });
  });
});
