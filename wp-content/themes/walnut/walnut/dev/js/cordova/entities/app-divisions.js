define(['underscore', 'unserialize'], function(_) {
  return _.mixin({
    getDivisionIds: function() {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'divisions'], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var ids;
          ids = '';
          if (data.results.length !== 0) {
            ids = unserialize(unserialize(data.rows.item(0)['meta_value']));
          }
          return d.resolve(ids);
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('getDivisionIds transaction completed');
      }).fail(_.failureHandler);
    },
    getStudentsCount: function(id) {
      var onSuccess, runQuery;
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(umeta_id) AS students_count FROM wp_usermeta WHERE meta_key=? AND meta_value=?", ['student_division', id], onSuccess(d), _.deferredErrorHandler(d));
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
    },
    fetchSingleDivision: function(id) {},
    getAllDivisions: function() {
      var divisionIds;
      divisionIds = _.getDivisionIds();
      return divisionIds.done(function(ids) {
        return console.log('');
      });
    }
  });
});
