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
        var getClassLabel, onFailure, onSuccess, runQuery;
        runQuery = function() {
          return $.Deferred(function(d) {
            return _.db.transaction(function(tx) {
              return tx.executeSql('SELECT meta_value FROM wp_usermeta WHERE user_id=1 AND meta_key="classes"', [], onSuccess(d), onFailure(d));
            });
          });
        };
        onSuccess = function(d) {
          return function(tx, data) {
            var result;
            result = [];
            return tx.executeSql('SELECT cd.id AS id, cd.division AS division, cd.class_id AS class_id, COUNT(umeta_id) AS students_count FROM wp_class_divisions cd LEFT JOIN wp_usermeta um ON cd.id = meta_value AND meta_key="student_division" WHERE class_id in (' + unserialize(data.rows.item(0)['meta_value']) + ') GROUP BY cd.id', [], function(tx, data) {
              var i, r;
              i = 0;
              while (i < data.rows.length) {
                r = data.rows.item(i);
                result[i] = {
                  id: r['id'],
                  division: r['division'],
                  class_id: r['class_id'],
                  class_label: getClassLabel(r['class_id']),
                  students_count: r['students_count']
                };
                i++;
              }
              return d.resolve(result);
            }, function(tx, error) {
              return console.log('ERROR: ' + error.message);
            });
          };
        };
        onFailure = function(d) {
          return function(tx, error) {
            return d.reject(error);
          };
        };
        getClassLabel = function(class_id) {
          if (class_id === 1) {
            return 'Junior KG';
          } else if (class_id === 2) {
            return 'Senior KG';
          } else {
            return 'Class ' + (class_id - 2);
          }
        };
        return $.when(runQuery()).done(function(data) {
          return console.log('getDivisionsFromLocal transaction completed');
        }).fail(function(error) {
          return console.log('ERROR: ' + error.message);
        });
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
