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
            return tx.executeSql("SELECT meta_value FROM wp_usermeta WHERE user_id=? AND meta_key=?", [_.getUserID(), 'divisions'], onSuccess(d), _.deferredErrorHandler(d));
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
          var row, userDetails;
          if (data.rows.length !== 0) {
            row = data.rows.item(0);
            userDetails = _.getUserDetails(_.getUserID());
            return userDetails.done(function(userDetails) {
              var studentsCountClassIdValue;
              alert("userDetails");
              console.log(JSON.stringify(userDetails));
              studentsCountClassIdValue = _.getStudentsCountForBlogId(userDetails.blog_id);
              return studentsCountClassIdValue.done(function(students_count_classid_value) {
                var studentsCount;
                studentsCount = _.getStudentsCount(row['id'], students_count_classid_value);
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
              });
            });
          }
        };
      };
      return $.when(runQuery()).done(function() {
        return console.log('fetchSingleDivision transaction completed');
      }).fail(_.failureHandler);
    },
    getStudentsCountForBlogId: function(blog_id) {
      var onSuccess, runQuery;
      alert("blog_id");
      console.log(blog_id);
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT user_id FROM wp_usermeta WHERE meta_key=? AND meta_value=?", ['primary_blog', blog_id], onSuccess(d), _.deferredErrorHandler(d));
          });
        });
      };
      onSuccess = function(d) {
        return function(tx, data) {
          var i, students_count_classid_value, _i, _ref;
          students_count_classid_value = [];
          for (i = _i = 0, _ref = data.rows.length - 1; _i <= _ref; i = _i += 1) {
            students_count_classid_value.push(data.rows.item(i)['user_id']);
          }
          console.log(JSON.stringify(students_count_classid_value));
          return d.resolve(students_count_classid_value);
        };
      };
      return $.when(runQuery()).done(function() {
        alert("1");
        return console.log('getStudentsCountClassIdValue transaction completed');
      }).fail(_.failureHandler);
    },
    getStudentsCount: function(division_id, ids) {
      var onSuccess, runQuery;
      alert("ids");
      console.log(JSON.stringify(ids));
      ids = ids.join();
      runQuery = function() {
        return $.Deferred(function(d) {
          return _.db.transaction(function(tx) {
            return tx.executeSql("SELECT COUNT(user_id) AS students_count FROM wp_usermeta WHERE meta_key=? AND meta_value=? AND user_id IN (" + ids + ")", ['student_division', division_id], onSuccess(d), _.deferredErrorHandler(d));
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
        alert("2");
        return console.log('getStudentsCount transaction completed');
      }).fail(_.failureHandler);
    }
  });
});
