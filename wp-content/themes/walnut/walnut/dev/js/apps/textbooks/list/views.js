var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/textbooks/templates/textbooks-list.html', 'text!apps/textbooks/list/templates/list_item.html', 'text!apps/textbooks/templates/no_textbooks.html'], function(App, textbooksListTpl, listitemTpl, notextbooksTpl) {
  return App.module("TextbooksApp.List.Views", function(Views, App) {
    var EmptyView, ListItemView;
    ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'li';

      ListItemView.prototype.className = 'mix mix_all';

      ListItemView.prototype.template = listitemTpl;

      ListItemView.prototype.onShow = function() {
        var class_id, class_ids, i, j, len, len1, subject, subjects;
        this.$el.attr('data-name', this.model.get('name'));
        class_ids = this.model.get('classes');
        if (class_ids) {
          for (i = 0, len = class_ids.length; i < len; i++) {
            class_id = class_ids[i];
            this.$el.addClass(_.slugify(CLASS_LABEL[class_id]));
          }
        }
        subjects = this.model.get('subjects');
        if (subjects) {
          for (j = 0, len1 = subjects.length; j < len1; j++) {
            subject = subjects[j];
            this.$el.addClass(subject);
          }
        }
        return $('#textbooks').mixitup({
          layoutMode: 'list',
          listClass: 'list',
          gridClass: 'grid',
          effects: ['fade', 'blur'],
          listEffects: ['fade', 'rotateX']
        });
      };

      ListItemView.prototype.serializeData = function() {
        var classString, class_id, class_ids, class_string, data, i, item_classes, len;
        data = ListItemView.__super__.serializeData.call(this);
        class_ids = this.model.get('classes');
        if (class_ids) {
          item_classes = _.sortBy(class_ids, function(num) {
            return num;
          });
          class_string = '';
          for (i = 0, len = item_classes.length; i < len; i++) {
            class_id = item_classes[i];
            class_string += CLASS_LABEL[class_id];
            classString = class_string;
            if (_.last(item_classes) !== class_id) {
              class_string += ', ';
            }
          }
          data.class_string = class_string;
        }
        return data;
      };

      return ListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = notextbooksTpl;

      EmptyView.prototype.tagName = 'div';

      EmptyView.prototype.className = 'visible-msg';

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ListView = (function(superClass) {
      extend(ListView, superClass);

      function ListView() {
        this.filterBooks = bind(this.filterBooks, this);
        this.searchTextbooks = bind(this.searchTextbooks, this);
        this.addTextbook = bind(this.addTextbook, this);
        return ListView.__super__.constructor.apply(this, arguments);
      }

      ListView.prototype.template = textbooksListTpl;

      ListView.prototype.itemView = ListItemView;

      ListView.prototype.emptyView = EmptyView;

      ListView.prototype.itemViewContainer = 'ul.textbooks_list';

      ListView.prototype.serializeData = function() {
        var collection_classes, collection_subjects, data, data_subjects;
        data = ListView.__super__.serializeData.call(this);

        /*defer = $.Deferred()
        url     = AJAXURL + '?action=get-admin-capability'
        datas = 'data'
            $.post url, 
                datas, (response) =>
                    #console.log 'ADMIN'
                    console.log response
                    #current_blog_id = response
                    #response = response.toString
                    if response
                        data.isAdmin = response
                        console.log isAdmin
                    defer.resolve response
                'json'
        
            defer.promise()
         */
        collection_classes = this.collection.pluck('classes');
        data.classes = _.chain(collection_classes).flatten().union().compact().sortBy(function(num) {
          return parseInt(num);
        }).map(function(m) {
          var classes;
          classes = [];
          classes.slug = _.slugify(CLASS_LABEL[m]);
          classes.label = CLASS_LABEL[m];
          return classes;
        }).value();
        collection_subjects = this.collection.pluck('subjects');
        data_subjects = _.union(_.flatten(collection_subjects));
        data.subjects = _.compact(_.sortBy(data_subjects, function(num) {
          return num;
        }));
        return data;
      };

      ListView.prototype.events = {
        'click #Filters li': 'filterBooks',
        'click #search-btn': 'searchTextbooks',
        'keypress .search-box': function(e) {
          if (e.which === 13) {
            return this.searchTextbooks();
          }
        },
        'click .add-textbook': 'addTextbook'
      };

      ListView.prototype.addTextbook = function() {
        var datas, defer, url;
        defer = $.Deferred();
        url = AJAXURL + '?action=get-all-classes';
        datas = 'data';
        $.post(url, datas, (function(_this) {
          return function(response) {
            var classids;
            classids = response;
            defer.resolve(response);
            _this.collection.class_ids = classids;
            return _this.trigger('show:add:textbook:popup', _this.collection);
          };
        })(this), 'json');
        return defer.promise();
      };

      ListView.prototype.sortTable = function(e) {
        var data_sort, options, sort_by;
        options = {};
        data_sort = $(e.target).attr('data-sort');
        sort_by = data_sort.split('-');
        options.orderby = sort_by[1];
        options.order = $(e.target).attr('data-order');
        return this.trigger("sort:textbooks", options);
      };

      ListView.prototype.onShow = function() {
        return this.dimensions = {
          region: 'all',
          recreation: 'all'
        };
      };

      ListView.prototype.searchTextbooks = function(e) {
        var id, models, searchStr;
        this.$el.find('.anim250').removeClass('visible-msg');
        id = [];
        searchStr = $('.search-box').val();
        console.log(searchStr);
        this.$el.find("#error-div").hide();
        this.$el.find('.progress-spinner').show();

        /*@dimensions.region = searchStr
        #console.log @dimensions
        $('#textbooks').mixitup('filter', [@dimensions.region, @dimensions.recreation])
         */
        models = textbooksCollectionOrigninal.filter(function(model) {
          return _.any(model.attributes, function(val, attr) {
            var m, n, name, nameL;
            name = model.get('name');
            nameL = model.get('name').toLowerCase();
            n = name.search(searchStr);
            m = nameL.search(searchStr);
            n = n.toString();
            m = m.toString();
            if (n !== '-1' || m !== '-1') {
              id = model.get('term_id');
              return model.pick(id);
            } else {
              return console.log("none found");
            }
          });
        });
        if (models.length === 0) {
          this.$el.find('.anim250').addClass('visible-msg');
        }
        this.collection.reset(models);
        this.trigger('search:textbooks', this.collection);

        /*@collection.filter((model) ->
            _.some _.values(model.pick('name')), (value) ->
                console.log value.toLowerCase().indexOf(searchStr)
        )
         */
        return this.$el.find('.progress-spinner').hide();
      };


      /*else
          @$el.find "#error-div"
          .show()
       */

      ListView.prototype.filterBooks = function(e) {
        var $t, dimension, filter, filterString, re;
        $t = $(e.target).closest('li');
        dimension = $t.attr('data-dimension');
        filter = $t.attr('data-filter');
        filterString = this.dimensions[dimension];
        if (filter === 'all') {
          if (!$t.hasClass('active')) {
            $t.addClass('active').siblings().removeClass('active');
            filterString = 'all';
          } else {
            $t.removeClass('active');
            filterString = '';
          }
        } else {
          $t.siblings('[data-filter="all"]').removeClass('active');
          filterString = filterString.replace('all', '');
          if (!$t.hasClass('active')) {
            $t.addClass('active');
            if (filterString === '') {
              filterString = filter;
            } else {
              filterString = filterString + ' ' + filter;
            }
          } else {
            $t.removeClass('active');
            re = new RegExp('(\\s|^)' + filter);
            filterString = filterString.replace(re, '');
          }
        }
        this.dimensions[dimension] = filterString;
        return $('#textbooks').mixitup('filter', [this.dimensions.region, this.dimensions.recreation]);
      };

      return ListView;

    })(Marionette.CompositeView);
  });
});
