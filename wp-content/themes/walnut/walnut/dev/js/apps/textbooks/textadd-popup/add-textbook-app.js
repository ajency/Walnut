var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller', 'apps/textbooks/textbook-single/textbookcontroller'], function(App, RegionController) {
  return App.module('AddTextbookPopup', function(AddTextbookPopup, App) {
    var AddTextbookView;
    AddTextbookPopup.Controller = (function(superClass) {
      extend(Controller, superClass);

      function Controller() {
        this._addTextbookView = bind(this._addTextbookView, this);
        return Controller.__super__.constructor.apply(this, arguments);
      }

      Controller.prototype.initialize = function(options) {
        this.view = this._addTextbookView(options.collection);
        this.show(this.view);
        this.listenTo(this.view, 'close:popup:dialog', function(collection) {
          this.region.reloadCollection(collection);
          return this.region.closeDialog();
        });

        /*@listenTo @view, 'reload:collection', (collection)->
            chaptersListView= new Single.Views.ChapterListView
                collection: collection
         */
        return this.listenTo(this.view, 'save:textbook:data', function(data) {
          var url;
          console.log(AJAXURL);
          console.log(data);
          url = AJAXURL + '?action=add-textbook';
          data = $.ajax({
            type: 'POST',
            url: url,
            data: data,
            dataType: 'json',
            async: true,
            success: (function(_this) {
              return function(response) {
                return response;
              };
            })(this)
          });
          return console.log(data);
        });
      };

      Controller.prototype._addTextbookView = function(collection) {
        return new AddTextbookView({
          collection: collection
        });
      };

      return Controller;

    })(RegionController);
    AddTextbookView = (function(superClass) {
      extend(AddTextbookView, superClass);

      function AddTextbookView() {
        this.addTextbook = bind(this.addTextbook, this);
        return AddTextbookView.__super__.constructor.apply(this, arguments);
      }

      AddTextbookView.prototype.template = '<form id="addTerm"> <div class="row"> <div class="col-md-12"> Name:<br> <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12"> <input id="parent" name="parent" type="hidden" value="{{parent}}" class="input-small span12"> </div><br> {{#noClasses}} <div class="col-md-12"> Classes suitable for:<br/> {{#class_data}} <input style="width:20px" type="checkbox" name="textClass" value="{{id}}" class="class_checkbox">{{name}}<br> {{/class_data}} </div><br> {{/noClasses}} <div class="col-md-12"> Description:<br> <textarea id="textdesc" name="textdesc" type="text" class="input-small span12"></textarea> </div><br> <!--div class="col-md-12"> Textbook Image Url<br> <input id="texturl" name="texturl" type="file" class="input-small span12"><br> <div id="progress" class="progress none"> <img src="<?= site_url() ?>/wp-content/themes/walnut/images/loader.gif"> </div> <img id="textImage" src="" height="200" alt="Image preview..."> </div><br--> {{#noClasses}} <div class="col-md-12"> Author Name:<br> <input id="authname" name="authname" type="text" placeholder="Author Name" class="input-small span12"> </div><br> {{/noClasses}} <div class="row"> <div class="col-md-12"> <button type="button" class="clear btn btn-success m-t-20 pull-left" style="margin-left: 3%;">&nbsp;&nbsp;{{AddButton}}</button> <div class=" p-l-10 p-t-30 pull-left success-msg"></div> </div> </div> </div> </form>';

      AddTextbookView.prototype.regions = {
        addTerm: "#addTerm"
      };

      AddTextbookView.prototype.events = {
        'click .btn-success': 'addTextbook',
        'change #texturl': 'showImage'
      };

      AddTextbookView.prototype.initialize = function() {
        console.log(this.collection);
        if (this.collection.toAddText) {
          if (this.collection.chapter_id && this.collection.textbook_id) {
            return this.dialogOptions = {
              modal_title: 'Add Sub Section',
              modal_size: 'small'
            };
          } else if (this.collection.textbook_id) {
            return this.dialogOptions = {
              modal_title: 'Add Section',
              modal_size: 'small'
            };
          } else {
            return this.dialogOptions = {
              modal_title: 'Add Chapter',
              modal_size: 'small'
            };
          }
        } else {
          return this.dialogOptions = {
            modal_title: 'Add Textbook',
            modal_size: 'small'
          };
        }
      };

      AddTextbookView.prototype.serializeData = function() {
        var classes, collection_classes, data, parent;
        console.log(this.collection);
        if (this.collection.toAddText === 'true') {
          data = AddTextbookView.__super__.serializeData.call(this);
          this.model = this.collection.models;
          parent = this.collection.parent;
          if (parent === null || parent === '' || parent === void 0) {
            parent = this.model[0].get('parent');
          }
          console.log(parent);
          data.parent = parent;
          if (this.collection.chapter_id && this.collection.textbook_id) {
            data.AddButton = 'Add Sub Section';
          } else if (this.collection.textbook_id) {
            data.AddButton = 'Add Section';
          } else {
            data.AddButton = 'Add Chapter';
          }
          return data;
        } else {
          data = AddTextbookView.__super__.serializeData.call(this);
          console.log('collection');
          console.log(this.collection.class_ids);
          classes = this.collection.class_ids;
          data.class_data = classes.map(function(item, i) {
            var classes_data, val;
            classes_data = [];
            classes_data.id = item;
            if (item === '1') {
              classes_data.name = 'Nursery';
            } else if (item === '2') {
              classes_data.name = 'Junior KG';
            } else if (item === '3') {
              classes_data.name = 'Senior KG';
            } else {
              val = item - 3;
              classes_data.name = 'Class ' + val;
            }
            return classes_data;
          });
          this.model = this.collection.models;
          collection_classes = this.collection.pluck('classes');

          /*data.classes=   _.chain collection_classes
                          .flatten()
                          .union()
                          .compact()
                          .sortBy (num)-> parseInt num
                          .map (m)->
                              classes=[]
                              classes.slug = _.slugify CLASS_LABEL[m]
                              classes.label = CLASS_LABEL[m]
                              classes.id = m
                              classes
                          .value()
          console.log data.classes
           */
          data.noClasses = true;
          data.parent = '-1';
          data.AddButton = 'Add Textbook';
          console.log(data);
          return data;
        }
      };

      AddTextbookView.prototype.onShow = function() {
        return console.log('onshow');
      };

      AddTextbookView.prototype.showImage = function() {
        var data, defer, image, picture, textUrl, url;
        defer = $.Deferred();
        console.log('image urlchnaged');
        textUrl = $('#texturl').val();
        console.log(textUrl);
        picture = $('input[name="texturl"]')[0].files[0];
        data = picture['name'];
        console.log(data);
        url = AJAXURL + '?action=upload-text-image';
        console.log(url);
        $.ajax({
          type: 'POST',
          url: url,
          data: data,
          dataType: 'json',
          async: true,
          success: (function(_this) {
            return function(response, textStatus, jqXHR) {
              return console.log(response);
            };
          })(this)
        });
        image = document.getElementById("textImage");
        return image.src = textUrl;

        /*if textUrl.files[0]
            console.log 'inside'
            reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(textUrl.files[0]);
         */
      };

      AddTextbookView.prototype.addTextbook = function(e) {
        var authname, checkedBoxes, class_ids, data, desc, models, name, parent, slug, textbookName;
        console.log(this.collection);
        models = this.collection.models;
        class_ids = [];
        textbookName = $('#textname').val();
        if (textbookName.trim() !== '') {
          name = $('#textname').val();
          slug = $('#textname').val();
          parent = $('#parent').val();
          console.log(parent);
          checkedBoxes = this.$el.find('input:checked');
          class_ids = _.chain(checkedBoxes).flatten(true).pluck('value').value();
          desc = $('#textdesc').val();
          authname = $('#authname').val();
          data = {
            action: 'add-tag',
            taxonomy: 'textbook',
            post_type: 'content-piece',
            'tag-name': name,
            slug: slug,
            parent: parent,
            description: desc,
            term_meta: {
              author: authname
            },
            classes: class_ids
          };
          this.trigger("save:textbook:data", data);
          this.$el.find('.success-msg').html('').removeClass('text-success, text-error');
          this.$el.find('.success-msg').html('Saved Successfully').addClass('text-success');
          this.collection.reset(models);
          console.log(this.collection);
          return setTimeout((function(_this) {
            return function() {
              return _this.trigger('close:popup:dialog', _this.collection);
            };
          })(this), 500);
        } else {
          return this.$el.find('#textname').addClass('error');
        }
      };

      return AddTextbookView;

    })(Marionette.ItemView);
    return App.commands.setHandler('add:textbook:popup', function(options) {
      return new AddTextbookPopup.Controller(options);
    });
  });
});
