define(['underscore'], function(_) {
  return _.mixin({
    getAppMenuItems: function() {
      var runFunc;
      runFunc = function() {
        return $.Deferred(function(d) {
          var lastSyncOperation;
          lastSyncOperation = _.getLastSyncOperation();
          return lastSyncOperation.done(function(typeOfOperation) {
            var data;
            if (typeOfOperation === 'file_import') {
              data = [
                {
                  "ID": 92,
                  "menu-order": 4,
                  "post_title": "Training Module",
                  "menu_item_link": "#",
                  "menu_id": null,
                  "submenu": [
                    {
                      "ID": 93,
                      "menu-order": 6,
                      "post_title": "Teacher Training",
                      "menu_item_link": "#teachers/dashboard",
                      "menu_id": null
                    }
                  ]
                }, {
                  "ID": 95,
                  "menu-order": 1,
                  "post_title": "Data Synchronization",
                  "menu_item_link": "#",
                  "menu_id": null,
                  "submenu": [
                    {
                      "ID": 96,
                      "menu-order": 2,
                      "post_title": "Sync",
                      "menu_item_link": "#sync",
                      "menu_id": null
                    }
                  ]
                }
              ];
            } else {
              data = [
                {
                  "ID": 95,
                  "menu-order": 1,
                  "post_title": "Data Synchronization",
                  "menu_item_link": "#",
                  "menu_id": null,
                  "submenu": [
                    {
                      "ID": 96,
                      "menu-order": 2,
                      "post_title": "Sync",
                      "menu_item_link": "#sync",
                      "menu_id": null
                    }
                  ]
                }
              ];
            }
            return d.resolve(data);
          });
        });
      };
      return $.when(runFunc()).done(function() {
        return console.log('getAppMenuItems done');
      }).fail(_.failureHandler);
    }
  });
});
