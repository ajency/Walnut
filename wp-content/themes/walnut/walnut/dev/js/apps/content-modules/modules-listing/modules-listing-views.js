var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'text!apps/content-modules/modules-listing/templates/content-modules-list-tmpl.html', 'bootbox'], function(App, contentListTpl, bootbox) {
  return App.module("ContentModulesApp.ModulesListing.Views", function(Views, App, Backbone, Marionette, $, _) {
    var EmptyView, ListItemView;
    ListItemView = (function(superClass) {
      extend(ListItemView, superClass);

      function ListItemView() {
        this.removeSpinner = bind(this.removeSpinner, this);
        this.successUpdateFn = bind(this.successUpdateFn, this);
        this.successSaveFn = bind(this.successSaveFn, this);
        return ListItemView.__super__.constructor.apply(this, arguments);
      }

      ListItemView.prototype.tagName = 'tr';

      ListItemView.prototype.className = 'gradeX odd';

      ListItemView.prototype.template = '<td class="v-align-middle"><div class="checkbox check-default"> <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}"> <label for="checkbox{{id}}"></label> </div> </td> <td>{{name}}</td> {{#isQuiz}}<td>{{quiz_type}}</td>{{/isQuiz}} <td>{{textbookName}}</td> <td>{{chapterName}}</td> <td>{{durationRounded}} {{minshours}}</td> {{#isQuiz}}<td>{{marks}}</td>{{/isQuiz}} <td>{{&statusMessage}}</td> <td><a target="_blank" class="view-content-piece" href="{{view_url}}">View</a> {{#is_editable}} <span class="editLinkSpan nonDevice">|</span> <a target="_blank" href="{{edit_url}}" class="editLink nonDevice">Edit</a> {{/is_editable}} {{#is_under_review}} <span class="nonDevice publishModuleSpan">|</span> <a target="_blank" class="nonDevice publishModule">Publish</a> {{/is_under_review}} {{#is_published}} <span class="nonDevice archiveModuleSpan">|</span> <a target="_blank" class="nonDevice archiveModule"> Archive</a> {{/is_published}} <span class="nonDevice">|</span><a target="_blank" class="nonDevice cloneModule"> Clone</a> <i class="fa spinner"></i> </td>';

      ListItemView.prototype.serializeData = function() {
        var data;
        console.log("serializeData");
        data = ListItemView.__super__.serializeData.call(this);
        data.view_url = SITEURL + ("/#view-group/" + data.id);
        data.edit_url = SITEURL + ("/#edit-module/" + data.id);
        console.log(data);
        data.textbookName = (function(_this) {
          return function() {
            var textbook;
            console.log(data.term_ids.textbook);
            textbook = _.findWhere(_this.textbooks, {
              "id": parseInt(data.term_ids.textbook)
            });
            if (textbook != null) {
              return textbook.name;
            }
          };
        })(this);
        console.log(data.textbookName);
        data.chapterName = (function(_this) {
          return function() {
            var chapter;
            chapter = _.chain(_this.chapters.findWhere({
              "id": data.term_ids.chapter
            })).pluck('name').compact().value();
            return chapter;
          };
        })(this);
        data.durationRounded = function() {
          if (data.minshours === 'hrs') {
            return _.numberFormat(parseFloat(data.duration), 2);
          } else {
            return data.duration;
          }
        };
        if (this.groupType === 'quiz') {
          data.quiz_type = this.model.getQuizTypeLabel();
          data.view_url = SITEURL + ("/#view-quiz/" + data.id);
          data.edit_url = SITEURL + ("/#edit-quiz/" + data.id);
        }
        if (this.groupType === 'student-training') {
          data.view_url = SITEURL + ("/#view-student-training-module/" + data.id);
          data.edit_url = SITEURL + ("/#edit-student-training-module/" + data.id);
        }
        data.statusMessage = function() {
          if (data.post_status === 'underreview') {
            return '<span class="post-status label label-important">Under Review</span>';
          } else if (data.post_status === 'publish') {
            return '<span class="post-status label label-info">Published</span>';
          } else if (data.post_status === 'archive') {
            return '<span class="post-status label label-success">Archived</span>';
          }
        };
        if (data.post_status === 'publish') {
          data.is_published = true;
        }
        if (data.post_status === 'underreview') {
          data.is_under_review = true;
        }
        if (data.post_status === 'underreview') {
          data.is_editable = true;
        }
        return data;
      };

      ListItemView.prototype.mixinTemplateHelpers = function(data) {
        data = ListItemView.__super__.mixinTemplateHelpers.call(this, data);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        return data;
      };

      ListItemView.prototype.events = {
        'click a.cloneModule': 'cloneModule',
        'click a.publishModule': function() {
          return this.changeModuleStatus('publish');
        },
        'click a.archiveModule': function() {
          return this.changeModuleStatus('archive');
        }
      };

      ListItemView.prototype.initialize = function(options) {
        console.log("here");
        this.textbooks = options.textbooksCollection;
        this.chapters = options.chaptersCollection;
        return this.groupType = options.groupType;
      };

      ListItemView.prototype.cloneModule = function() {
        return bootbox.confirm("Are you sure you want to clone '" + (this.model.get('name')) + "' ?", (function(_this) {
          return function(result) {
            var groupData;
            if (result) {
              _this.addSpinner();
              _this.cloneModel = (function() {
                switch (this.groupType) {
                  case 'teaching-module':
                    return App.request("new:content:group");
                  case 'quiz':
                    return App.request("new:quiz");
                  case 'student-training':
                    return App.request("new:student:training:module");
                }
              }).call(_this);
              groupData = _this.model.toJSON();
              _this.clonedData = _.omit(groupData, ['id', 'last_modified_on', 'last_modified_by', 'created_on', 'created_by']);
              _this.clonedData.name = "" + _this.clonedData.name;
              _this.clonedData.post_status = "underreview";
              return App.execute("when:fetched", _this.cloneModel, function() {
                return _this.cloneModel.save(_this.clonedData, {
                  wait: true,
                  success: _this.successSaveFn,
                  error: _this.errorFn,
                  complete: _this.removeSpinner
                });
              });
            }
          };
        })(this));
      };

      ListItemView.prototype.successSaveFn = function(model) {
        model.set('content_pieces', this.clonedData.content_pieces);
        return model.save({
          'changed': 'content_pieces'
        }, {
          wait: true,
          success: this.successUpdateFn,
          error: this.errorFn
        });
      };

      ListItemView.prototype.successUpdateFn = function(model) {
        var url;
        url = (function() {
          switch (this.groupType) {
            case 'teaching-module':
              return "edit-module";
            case 'quiz':
              return "edit-quiz";
            case 'student-training':
              return "edit-student-training-module";
          }
        }).call(this);
        return App.navigate(url + "/" + model.id, true);
      };

      ListItemView.prototype.errorFn = function() {
        return console.log('error');
      };

      ListItemView.prototype.addSpinner = function() {
        return this.$el.find('.spinner').addClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.removeSpinner = function() {
        return this.$el.find('.spinner').removeClass('fa-spin fa-spinner');
      };

      ListItemView.prototype.changeModuleStatus = function(status) {
        return bootbox.confirm("Are you sure you want to " + status + " '" + (this.model.get('name')) + "' ?", (function(_this) {
          return function(result) {
            if (result) {
              _this.addSpinner();
              return _this.model.save({
                post_status: status,
                changed: 'module_details'
              }, {
                success: function() {
                  return _this.changeStatusLabel(status);
                },
                error: function(resp) {
                  return console.log(resp);
                },
                complete: _this.removeSpinner
              });
            }
          };
        })(this));
      };

      ListItemView.prototype.changeStatusLabel = function(status) {
        switch (status) {
          case 'archive':
            this.$el.find('.post-status').removeClass('label-info').addClass('label-success').html('Archived');
            return this.$el.find('.archiveModule, .archiveModuleSpan').remove();
          case 'publish':
            this.$el.find('.post-status').removeClass('label-important').addClass('label-info').html('Published');
            this.$el.find('.view-content-piece').after('<span class="nonDevice archiveModuleSpan">|</span> <a target="_blank" class="nonDevice archiveModule">Archive</a>');
            return this.$el.find('.publishModule, .publishModuleSpan, .editLink, .editLinkSpan').remove();
        }
      };

      return ListItemView;

    })(Marionette.ItemView);
    EmptyView = (function(superClass) {
      extend(EmptyView, superClass);

      function EmptyView() {
        return EmptyView.__super__.constructor.apply(this, arguments);
      }

      EmptyView.prototype.template = 'No Content Available';

      EmptyView.prototype.tagName = 'td';

      EmptyView.prototype.onShow = function() {
        console.log("empty view");
        return this.$el.attr('colspan', 9);
      };

      return EmptyView;

    })(Marionette.ItemView);
    return Views.ModulesListingView = (function(superClass) {
      extend(ModulesListingView, superClass);

      function ModulesListingView() {
        this.changeStatus = bind(this.changeStatus, this);
        return ModulesListingView.__super__.constructor.apply(this, arguments);
      }

      ModulesListingView.prototype.template = contentListTpl;

      ModulesListingView.prototype.className = 'row';

      ModulesListingView.prototype.itemView = ListItemView;

      ModulesListingView.prototype.emptyView = EmptyView;

      ModulesListingView.prototype.itemViewContainer = '#list-content-pieces';

      ModulesListingView.prototype.itemViewOptions = function() {
        return {
          textbooksCollection: this.textbooks,
          chaptersCollection: Marionette.getOption(this, 'chaptersCollection'),
          groupType: this.groupType
        };
      };

      ModulesListingView.prototype.mixinTemplateHelpers = function(data) {
        data = ModulesListingView.__super__.mixinTemplateHelpers.call(this, data);
        if (this.groupType === 'quiz') {
          data.isQuiz = true;
        }
        data.type = _.titleize(_.humanize(data.type));
        console.log(this.groupType);
        return data;
      };

      ModulesListingView.prototype.events = {
        'change .textbook-filter': function(e) {
          this.trigger("fetch:chapters:or:sections", $(e.target).val(), e.target.id);
          return console.log(e.target.id);
        },
        'change #check_all_div': function() {
          return $.toggleCheckAll(this.$el.find('table'));
        },
        'change .tab_checkbox,#check_all_div ': 'showSubmitButton',
        'change #content-post-status-filter': 'setFilteredContent',
        'click .change-status button': 'changeStatus',
        'click .send-email-to-stud button': 'sendEmailStud'
      };

      ModulesListingView.prototype.initialize = function() {
        this.textbooksCollection = Marionette.getOption(this, 'textbooksCollection');
        this.groupType = Marionette.getOption(this, 'groupType');
        this.textbooks = new Array();
        return this.textbooksCollection.each((function(_this) {
          return function(textbookModel, ind) {
            return _this.textbooks.push({
              'name': textbookModel.get('name'),
              'id': textbookModel.get('term_id')
            });
          };
        })(this));
      };

      ModulesListingView.prototype.onShow = function() {
        var textbookFiltersHTML;
        textbookFiltersHTML = $.showTextbookFilters({
          textbooks: this.textbooksCollection
        });
        this.fullCollection = Marionette.getOption(this, 'fullCollection');
        this.$el.find('#textbook-filters').html(textbookFiltersHTML);
        this.$el.find('#content-pieces-table').tablesorter();
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.sendEmailStud = function(e) {
        var allQuizIDs, data, excludeIDs;
        console.log("email sent module executed");
        data = [];
        this.$el.find('.communication_sent').remove();
        allQuizIDs = _.map($.getCheckedItems(this.$el.find('#content-pieces-table')), function(m) {
          return parseInt(m);
        });
        excludeIDs = _.chain(this.collection.where({
          'taken_by': 0
        })).pluck('id').value();
        data.quizIDs = allQuizIDs;
        console.log(data.quizIDs);
        data.division = this.$el.find('#divisions-filter').val();
        console.log(this.$el.find('#divisions-filter')).val();
        if ($(e.target).hasClass('send-email')) {
          data.communication_mode = 'email';
        } else {
          data.communication_mode = 'sms';
        }
        if (_.isEmpty(data.quizIDs)) {
          return this.$el.find('.send-email').after('<span class="m-l-40 text-error small communication_sent"> No quiz has been selected</span>');
        } else {
          console.log(data);
          return this.trigger("save:communications", data);
        }
      };

      ModulesListingView.prototype.onFetchChaptersOrSectionsCompleted = function(filteredCollection, filterType) {
        switch (filterType) {
          case 'textbooks-filter':
            $.populateChapters(filteredCollection, this.$el);
            break;
          case 'chapters-filter':
            $.populateSections(filteredCollection, this.$el);
            break;
          case 'sections-filter':
            $.populateSubSections(filteredCollection, this.$el);
        }
        return this.setFilteredContent();
      };

      ModulesListingView.prototype.setFilteredContent = function() {
        var filtered_data;
        filtered_data = $.filterTableByTextbooks(this);
        this.collection.set(filtered_data);
        return this.onUpdatePager();
      };

      ModulesListingView.prototype.onUpdatePager = function() {
        var pagerOptions;
        this.$el.find("#content-pieces-table").trigger("updateCache");
        pagerOptions = {
          container: this.$el.find(".pager"),
          output: '{startRow} to {endRow} of {totalRows}'
        };
        return this.$el.find("#content-pieces-table").tablesorterPager(pagerOptions);
      };

      ModulesListingView.prototype.showSubmitButton = function() {
        if (this.$el.find('.tab_checkbox').is(':checked')) {
          this.$el.find('.change-status').show();
          return this.$el.find('.send-email-to-stud').show();
        } else {
          this.$el.find('.change-status').hide();
          return this.$el.find('.send-email-to-stud').hide();
        }
      };

      ModulesListingView.prototype.changeStatus = function(e) {
        var data, msg;
        data = {};
        data.IDs = $.getCheckedItems(this.$el.find('table'));
        data.status = $(e.target).closest('.change-status').find('select').val();
        msg = "Are you sure you want to " + data.status + " the selected modules ?";
        if (data.status === 'publish') {
          data.IDs = _.filter(data.IDs, (function(_this) {
            return function(id) {
              if (_this.collection.get(id).get('post_status') === 'underreview') {
                return id;
              }
            };
          })(this));
          msg += "<div class='small m-t-10'> Note: Only modules with status 'Under Review' will be changed to publish </div>";
          if (0 === _.size(data.IDs)) {
            bootbox.alert('None of the selected modules can be published');
            return;
          }
        }
        return bootbox.confirm(msg, (function(_this) {
          return function(result) {
            if (result) {
              $(e.target).find('.fa').addClass('fa-spin fa-spinner');
              data.action = 'update-content-module-status';
              return $.post(AJAXURL, data).success(function(resp) {
                return _this.updateStatusValues(data.IDs, data.status);
              }).fail(function(resp) {
                console.log('some error occurred');
                return console.log(resp);
              }).done(function() {
                return $(e.target).find('.fa').removeClass('fa-spin fa-spinner').addClass('fa-check');
              });
            }
          };
        })(this));
      };

      ModulesListingView.prototype.updateStatusValues = function(IDs, status) {
        _.each(IDs, (function(_this) {
          return function(id) {
            var model;
            model = _this.collection.get(parseInt(id));
            return model.set({
              'post_status': status
            });
          };
        })(this));
        this.collection.reset(this.collection.models);
        return this.onUpdatePager();
      };

      return ModulesListingView;

    })(Marionette.CompositeView);
  });
});
