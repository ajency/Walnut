define(['underscore'], function(_) {
  return _.mixin({
    getAllDivisions: function() {
      var defer;
      defer = $.Deferred();
      _.getDivisionIds().then(function(ids) {
        var results;
        results = [];
        return _.each(ids, function(id, i) {
          return _.fetchSingleDivision(id).then(function(data) {
            results[i] = data;
            return defer.resolve(results);
          });
        });
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
          ids = _.unserialize(data.rows.item(0))['meta_value'];
        }
        return defer.resolve(ids);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'divisions'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    fetchSingleDivision: function(id) {
      var defer, divisionData, divisionid, onSuccess;
      divisionid = parseInt(id);
      divisionData = {
        id: '',
        division: '',
        class_id: '',
        class_label: '',
        students_count: ''
      };
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var row;
        if (data.rows.length !== 0) {
          row = data.rows.item(0);
          return _.getUserDetails(_.getUserID()).then(function(userDetails) {
            return _.getStudentsCountForBlogId(userDetails.blog_id).then(function(students_count_classid_value) {
              return _.getStudentsCount(row['id'], students_count_classid_value).then(function(students_count) {
                divisionData = {
                  id: row['id'],
                  division: row['division'],
                  class_id: row['class_id'],
                  class_label: CLASS_LABEL[row['class_id']],
                  students_count: students_count
                };
                return defer.resolve(divisionData);
              });
            });
          });
        }
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT * FROM " + _.getTblPrefix() + "class_divisions WHERE id=?", [id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getStudentsCountForBlogId: function(blog_id) {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var forEach, students_count_classid_value;
        students_count_classid_value = [];
        forEach = function(row, i) {
          students_count_classid_value.push(row['user_id']);
          i = i + 1;
          if (i < data.rows.length) {
            return forEach(data.rows.item(i), i);
          } else {
            return defer.resolve(students_count_classid_value);
          }
        };
        return forEach(data.rows.item(0), 0);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT user_id FROM wp_usermeta WHERE meta_key=? AND meta_value=?", ['primary_blog', blog_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getStudentsCount: function(division_id, ids) {
      var defer, onSuccess;
      ids = ids.join();
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var students_count;
        students_count = data.rows.item(0)['students_count'];
        return defer.resolve(students_count);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT COUNT(user_id) AS students_count FROM wp_usermeta WHERE meta_key=? AND meta_value=? AND user_id IN (" + ids + ")", ['student_division', division_id], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    },
    getDivisionIdForSchedule: function() {
      var defer, onSuccess;
      defer = $.Deferred();
      onSuccess = function(tx, data) {
        var id;
        id = '';
        if (data.rows.length !== 0) {
          id = data.rows.item(0)['meta_value'];
        }
        return defer.resolve(id);
      };
      _.db.transaction(function(tx) {
        return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'student_division'], onSuccess, _.transactionErrorHandler);
      });
      return defer.promise();
    }
  });
});
