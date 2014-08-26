define(['underscore'], function(_) {
  return _.mixin({
    getAllDivisions: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var divisionIds;
          divisionIds = _.getDivisionIds();
          return divisionIds.done(function(ids) {
            var results;
            results = [];
            _.each(ids, function(id, i) {
              return (function(id, i) {
                var singleDivision;
                singleDivision = _.fetchSingleDivision(id);
                return singleDivision.done(function(data) {
                  return results[i] = data;
                });
              })(id, i);
            });
            return d.resolve(results);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getAllDivisions done');
      }).fail(_.failureHandler);
    },
    getDivisionIds: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [253, 'divisions'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var ids;
          ids = '';
          if (data.rows.length !== 0) {
            ids = _.unserialize(data.rows.item(0)['meta_value']);
          }
          return d.resolve(ids);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDivisionIds transaction completed');
      }).fail(_.failureHandler);
    },
    fetchSingleDivision: function(id) {
      var divisionData, onSuccess, runQuery;
      divisionData = {
        id: '',
        division: '',
        class_id: '',
        class_label: '',
        students_count: ''
      };
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "class_divisions WHERE id=?", [id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var row, studentsCount;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            studentsCount = _.getStudentsCount(row['id']);
            return studentsCount.done(function(students_count) {
              divisionData = {
                id: row['id'],
                division: row['division'],
                class_id: row['class_id'],
                class_label: CLASS_LABEL[row['class_id']],
                students_count: students_count
              };
              return d.resolve(divisionData);
            });
          }
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('fetchSingleDivision transaction completed');
      }).fail(_.failureHandler);
    },
    getStudentsCount: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(umeta_id) AS students_count FROM wp_usermeta WHERE meta_key=? AND meta_value=?", ['student_division', 123456109], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var students_count;
          students_count = data.rows.item(0)['students_count'];
          return d.resolve(students_count);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getStudentsCount transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
