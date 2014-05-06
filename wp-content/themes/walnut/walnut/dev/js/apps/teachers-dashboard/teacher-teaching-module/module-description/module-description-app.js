var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'controllers/region-controller', 'text!apps/teachers-dashboard/teacher-teaching-module/module-description/templates/module-description-template.html'], function(App, RegionController, moduleDescriptionTemplate) {
  return App.module("TeacherTeachingApp.ModuleDescription", function(ModuleDescription, App) {
    var ModuleDescriptionController, ModuleDescriptionView;
    ModuleDescriptionController = (function(_super) {
      __extends(ModuleDescriptionController, _super);

      function ModuleDescriptionController() {
        this._showModuleDescriptionView = __bind(this._showModuleDescriptionView, this);
        return ModuleDescriptionController.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionController.prototype.initialize = function(opts) {
        var model, view;
        model = opts.model, this.textbookNames = opts.textbookNames;
        console.log(' @textbookNames');
        console.log(this.textbookNames);
        this.view = view = this._showModuleDescriptionView(model);
        this.show(view, {
          loading: true,
          entities: [this.textbookNames]
        });
        return this.listenTo(this.view, "goto:previous:route", (function(_this) {
          return function() {
            return _this.region.trigger("goto:previous:route");
          };
        })(this));
      };

      ModuleDescriptionController.prototype._showModuleDescriptionView = function(model) {
        var terms;
        terms = model.get('term_ids');
        return new ModuleDescriptionView({
          model: model,
          templateHelpers: {
            getTextbookName: (function(_this) {
              return function() {
                var texbookName, textbook;
                textbook = _this.textbookNames.get(terms.textbook);
                if (textbook != null) {
                  return texbookName = textbook.get('name');
                }
              };
            })(this),
            getChapterName: (function(_this) {
              return function() {
                var chapter, chapterName;
                chapter = _this.textbookNames.get(terms.chapter);
                if (chapter != null) {
                  return chapterName = chapter.get('name');
                }
              };
            })(this),
            getSectionsNames: (function(_this) {
              return function() {
                var section, sectionName, sectionNames, sectionString, sections, term, _i, _len;
                sections = _.flatten(terms.sections);
                sectionString = '';
                sectionNames = [];
                if (sections) {
                  for (_i = 0, _len = sections.length; _i < _len; _i++) {
                    section = sections[_i];
                    term = _this.textbookNames.get(section);
                    if (term != null) {
                      sectionName = term.get('name');
                    }
                    sectionNames.push(sectionName);
                  }
                  return sectionString = sectionNames.join();
                }
              };
            })(this),
            getSubSectionsNames: (function(_this) {
              return function() {
                var sub, subSectionString, subsection, subsectionNames, subsections, _i, _len;
                subsections = _.flatten(terms.subsections);
                subSectionString = '';
                subsectionNames = [];
                if (subsections) {
                  for (_i = 0, _len = subsections.length; _i < _len; _i++) {
                    sub = subsections[_i];
                    subsection = _this.textbookNames.get(sub);
                    if (subsection != null) {
                      subsectionNames.push(subsection.get('name'));
                    }
                  }
                  return subSectionString = subsectionNames.join();
                }
              };
            })(this)
          }
        });
      };

      return ModuleDescriptionController;

    })(RegionController);
    ModuleDescriptionView = (function(_super) {
      __extends(ModuleDescriptionView, _super);

      function ModuleDescriptionView() {
        this.updateTime = __bind(this.updateTime, this);
        return ModuleDescriptionView.__super__.constructor.apply(this, arguments);
      }

      ModuleDescriptionView.prototype.className = 'pieceWrapper';

      ModuleDescriptionView.prototype.template = moduleDescriptionTemplate;

      ModuleDescriptionView.prototype.events = {
        'click #back-to-module': function() {
          return this.trigger("goto:previous:route");
        }
      };

      ModuleDescriptionView.prototype.onShow = function() {
        var clock;
        return clock = setInterval(this.updateTime, 500);
      };

      ModuleDescriptionView.prototype.updateTime = function() {
        if (_.size($('#timekeeper')) > 0) {
          return this.$el.find('.timedisplay').html('<i class="fa fa-clock-o"></i> ' + $('#timekeeper').html());
        }
      };

      return ModuleDescriptionView;

    })(Marionette.ItemView);
    return App.commands.setHandler("show:teacher:teaching:module:description", function(opt) {
      if (opt == null) {
        opt = {};
      }
      return new ModuleDescriptionController(opt);
    });
  });
});
