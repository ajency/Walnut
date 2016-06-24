var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'text!apps/textbooks/textbook-single/templates/textbook-full.html', 'text!apps/textbooks/textbook-single/templates/textbook-description.html', 'text!apps/textbooks/textbook-single/templates/chapters-list.html'], function(App, textbookSingleTpl, textbookDescriptionTpl, chapterListTpl) {
  return App.module("TextbooksApp.Single.Views", function(Views, App) {
    Views.TextbookDescriptionView = (function(superClass) {
      extend(TextbookDescriptionView, superClass);

      function TextbookDescriptionView() {
        return TextbookDescriptionView.__super__.constructor.apply(this, arguments);
      }

      TextbookDescriptionView.prototype.template = textbookDescriptionTpl;

      TextbookDescriptionView.prototype.className = '';

      TextbookDescriptionView.prototype.onShow = function() {
        console.log('Show Model');
        return console.log(this.model);
      };

      return TextbookDescriptionView;

    })(Marionette.ItemView);
    return Views.TextbookSingleLayout = (function(superClass) {
      extend(TextbookSingleLayout, superClass);

      function TextbookSingleLayout() {
        this.searchTextbooks = bind(this.searchTextbooks, this);
        return TextbookSingleLayout.__super__.constructor.apply(this, arguments);
      }

      TextbookSingleLayout.prototype.template = textbookSingleTpl;

      TextbookSingleLayout.prototype.className = 'row';

      TextbookSingleLayout.prototype.regions = {
        textbookDescriptionRegion: '#textbook-description-region',
        chaptersRegion: '#chapters-list-region'
      };

      TextbookSingleLayout.prototype.events = {
        'click .add-chapter': 'addChapter',
        'click #search-btn': 'searchTextbooks',
        'keypress .search-box': function(e) {
          if (e.which === 13) {
            return this.searchTextbooks();
          }
        }
      };

      TextbookSingleLayout.prototype.addChapter = function() {
        console.log(this.collection);
        this.collection.toAddText = 'true';
        return this.trigger('show:add:textbook:popup', this.collection);
      };

      TextbookSingleLayout.prototype.onAddReload = function() {
        return console.log('done');
      };

      TextbookSingleLayout.prototype.searchTextbooks = function(e) {
        var id, models, searchStr;
        id = [];
        searchStr = $('.search-box').val();
        this.$el.find("#error-div").hide();
        this.$el.find('.progress-spinner').show();
        console.log(chaptersOriginalCollection);
        console.log(this.collection);

        /*@dimensions.region = searchStr
                       #console.log @dimensions
                       $('#textbooks').mixitup('filter', [@dimensions.region, @dimensions.recreation])
         */
        models = chaptersOriginalCollection.filter(function(model) {
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
        this.collection.reset(models);
        console.log(this.collection);
        this.$el.find('.progress-spinner').hide();
        return this.trigger('search:textbooks', this.collection);

        /*else
        					console.log "dedede"
        					@trigger 'search:textbooks', chaptersOriginalCollection
         */
      };

      return TextbookSingleLayout;

    })(Marionette.Layout);
  });
});
