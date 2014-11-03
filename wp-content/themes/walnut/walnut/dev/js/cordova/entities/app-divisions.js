define(['underscore'], function(_) {
  return _.mixin({
    cordovaDivisionCollection: function() {
      var defer;
      defer = $.Deferred();
      _.getDivisionIds().then(function(ids) {
        var forEach, length, results;
        console.log('getDivisionIds done');
        results = [];
        length = ids.length;
        if (length === 0) {
          return defer.resolve(results);
        } else {
          forEach = function(id, i) {
            return _.fetchSingleDivision(id).then(function(divisionData) {
              console.log('fetchSingleDivision done');
              results[i] = divisionData;
              i = i + 1;
              if (i < ids.length) {
                return forEach(ids[i], i);
              } else {
                return defer.resolve(results);
              }
            });
          };
          return forEach(ids[0], 0);
        }
      });
      return defer.promise();
    },
    getDivisionIds: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var ids;
        ids = '';
        if (data.rows.length !== 0) {
          ids = _.unserialize(data.rows.item(0)['meta_value']);
        }
        return defer.resolve(ids);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'divisions'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    fetchSingleDivision: function(id) {
      var defer, divisionData, onSuccess;
      defer = $.Deferred();
      divisionData = {
        id: '',
        division: '',
        class_id: '',
        class_label: '',
        students_count: ''
      };
      onSuccess = function(tx, data) {
        var row;
        if (data.rows.length !== 0) {
          row = data.rows.item(0);
          return _.getStudentsCount(row['id']).then(function(students_count) {
            console.log('getStudentsCount done');
            divisionData = {
              id: row['id'],
              division: row['division'],
              class_id: row['class_id'],
              class_label: CLASS_LABEL[row['class_id']],
              students_count: students_count
            };
            return defer.resolve(divisionData);
          });
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "class_divisions WHERE id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getStudentsCount: function(id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var students_count;
        students_count = data.rows.item(0)['students_count'];
        return defer.resolve(students_count);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT COUNT(umeta_id) AS students_count FROM wp_usermeta WHERE meta_key=? AND meta_value=?", ['student_division', id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
