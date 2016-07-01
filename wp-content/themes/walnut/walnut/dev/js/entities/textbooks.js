var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(["app", 'backbone'], function(App, Backbone) {
  return App.module("Entities.Textbooks", function(Textbooks, App, Backbone, Marionette, $, _) {
    var API;
    Textbooks.ItemModel = (function(superClass) {
      extend(ItemModel, superClass);

      function ItemModel() {
        return ItemModel.__super__.constructor.apply(this, arguments);
      }

      ItemModel.prototype.idAttribute = 'term_id';

      ItemModel.prototype.defaults = {
        name: '',
        slug: '',
        description: '',
        parent: 0,
        term_order: 0,
        count: 0,
        chapter_count: 0
      };

      ItemModel.prototype.name = 'textbook';

      ItemModel.prototype.getClasses = function() {
        var classLabel, classes, classesArray, i, len;
        classesArray = [];
        classes = this.get('classes');
        if (_.isArray(classes)) {
          for (i = 0, len = classes.length; i < len; i++) {
            classLabel = classes[i];
            classesArray.push(CLASS_LABEL[classLabel]);
          }
          classesArray.join();
        }
        console.log('classes');
        console.log(classesArray);
        return classesArray;
      };

      return ItemModel;

    })(Backbone.Model);
    Textbooks.NameModel = (function(superClass) {
      extend(NameModel, superClass);

      function NameModel() {
        return NameModel.__super__.constructor.apply(this, arguments);
      }

      NameModel.prototype.defaults = {
        name: ''
      };

      NameModel.prototype.name = 'textbookName';

      return NameModel;

    })(Backbone.Model);
    Textbooks.ItemCollection = (function(superClass) {
      extend(ItemCollection, superClass);

      function ItemCollection() {
        return ItemCollection.__super__.constructor.apply(this, arguments);
      }

      ItemCollection.prototype.model = Textbooks.ItemModel;

      ItemCollection.prototype.comparator = 'term_order';

      ItemCollection.prototype.url = function() {
        return AJAXURL + '?action=get-textbooks';
      };

      ItemCollection.prototype.parse = function(resp) {
        console.log(resp);
        this.total = resp.count;
        return resp.data;
      };

      ItemCollection.prototype.fetchChaptersOrSections = function(parentID) {
        var chaptersOrSectionsCollection;
        return chaptersOrSectionsCollection = App.request("get:chapters", {
          'parent': parentID
        });
      };

      return ItemCollection;

    })(Backbone.Collection);
    Textbooks.NamesCollection = (function(superClass) {
      extend(NamesCollection, superClass);

      function NamesCollection() {
        return NamesCollection.__super__.constructor.apply(this, arguments);
      }

      NamesCollection.prototype.model = Textbooks.NameModel;

      NamesCollection.prototype.comparator = 'term_order';

      NamesCollection.prototype.url = function() {
        return AJAXURL + '?action=get-textbook-names';
      };

      NamesCollection.prototype.getTextbookName = function(terms) {
        var texbookName, textbook;
        console.log(terms);
        textbook = this.get(terms.textbook);
        if (textbook != null) {
          return texbookName = textbook.get('name');
        }
      };

      NamesCollection.prototype.getChapterName = function(terms) {
        var chapter, chapterName;
        chapter = this.get(terms.chapter);
        if (chapter != null) {
          return chapterName = chapter.get('name');
        }
      };

      NamesCollection.prototype.getSectionsNames = function(terms) {
        var i, len, section, sectionName, sectionNames, sectionString, sections, term;
        sections = _.flatten(terms.sections);
        sectionString = '';
        sectionNames = [];
        if (sections) {
          for (i = 0, len = sections.length; i < len; i++) {
            section = sections[i];
            term = this.get(section);
            if (term != null) {
              sectionName = term.get('name');
            }
            sectionNames.push(sectionName);
          }
          return sectionString = sectionNames.join();
        }
      };

      NamesCollection.prototype.getSubSectionsNames = function(terms) {
        var i, len, sub, subSectionString, subsection, subsectionNames, subsections;
        subsections = _.flatten(terms.subsections);
        subSectionString = '';
        subsectionNames = [];
        if (subsections) {
          for (i = 0, len = subsections.length; i < len; i++) {
            sub = subsections[i];
            subsection = this.get(sub);
            if (subsection != null) {
              subsectionNames.push(subsection.get('name'));
            }
          }
          return subSectionString = subsectionNames.join();
        }
      };

      return NamesCollection;

    })(Backbone.Collection);
    API = {
      getTextbooks: function(param) {
        var textbookCollection;
        if (param == null) {
          param = {};
        }
        console.log(param);
        textbookCollection = new Textbooks.ItemCollection;
        textbookCollection.fetch({
          reset: true,
          data: param
        });
        return textbookCollection;
      },
      getTextBookByID: function(id) {
        var textbook;
        if (typeof textbookCollection !== "undefined" && textbookCollection !== null) {
          textbook = textbookCollection.get(id);
        }
        console.log('getTextBookByID');
        console.log(textbook);
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          textbook.fetch();
        }
        return textbook;
      },
      getTextBookNameByID: function(id) {
        var textbook, textbookName;
        if (typeof textbookCollection !== "undefined" && textbookCollection !== null) {
          textbook = textbookCollection.get(id);
        }
        if (!textbook) {
          textbook = new Textbooks.ItemModel({
            term_id: id
          });
          textbook.fetch();
        }
        textbookName = textbook.get('name');
        return textbookName;
      },
      getTextBookNamesByIDs: function(ids) {
        var textbookNamesCollection;
        ids = _.compact(_.flatten(ids));
        textbookNamesCollection = new Textbooks.NamesCollection;
        textbookNamesCollection.fetch({
          reset: true,
          data: {
            term_ids: ids
          }
        });
        return textbookNamesCollection;
      }
    };
    App.reqres.setHandler("get:textbooks", function(opt) {
      return API.getTextbooks(opt);
    });
    App.reqres.setHandler("get:textbook:by:id", function(id) {
      return API.getTextBookByID(id);
    });
    App.reqres.setHandler("get:textbook:name:by:id", function(id) {
      return API.getTextBookNameByID(id);
    });
    return App.reqres.setHandler("get:textbook:names:by:ids", function(ids) {
      return API.getTextBookNamesByIDs(ids);
    });
  });
});
