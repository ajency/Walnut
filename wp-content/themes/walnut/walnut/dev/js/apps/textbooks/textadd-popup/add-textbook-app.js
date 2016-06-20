var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'controllers/region-controller'], function(App, RegionController) {
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
        this.listenTo(this.view, 'close:popup:dialog', function() {
          return this.region.closeDialog();
        });
        return this.listenTo(this.view, 'save:textbook:data', function(data) {
          var url;
          console.log(AJAXURL);
          console.log(data);
          url = AJAXURL + '?action=add-textbook';
          return $.ajax({
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

      AddTextbookView.prototype.template = '<form> <div class="row"> <div class="col-md-12"> Name:<br> <input id="textname" name="textname" type="text" placeholder="Name" class="input-small span12"> </div><br> <div class="col-md-12"> Classes suitable for:<br/> {{#classes}} <input style="width:20px" type="checkbox" name="textClass" value="{{id}}" class="class_checkbox">{{label}}<br> {{/classes}} </div><br> <div class="col-md-12"> Description:<br> <textarea id="textdesc" name="textdesc" type="text" class="input-small span12"></textarea> </div><br> <!--div class="col-md-12"> Textbook Image Url<br> <input id="texturl" name="texturl" type="file" class="input-small span12"><br> <div id="progress" class="progress none"> <img src="<?= site_url() ?>/wp-content/themes/walnut/images/loader.gif"> </div> <img id="textImage" src="" height="200" alt="Image preview..."> </div><br--> <div class="col-md-12"> Author Name:<br> <input id="authname" name="authname" type="text" placeholder="Author Name" class="input-small span12"> </div><br> <div class="row"> <div class="col-md-12"> <button type="button" class="clear btn btn-success m-t-20 pull-left">Add Textbook</button> <div class=" p-l-10 p-t-30 pull-left success-msg"></div> </div> </div> </div> </form>';

      AddTextbookView.prototype.events = {
        'click .btn-success': 'addTextbook',
        'change #texturl': 'showImage'
      };

      AddTextbookView.prototype.initialize = function() {
        return this.dialogOptions = {
          modal_title: 'Add Textbook',
          modal_size: 'small'
        };
      };

      AddTextbookView.prototype.serializeData = function() {
        var collection_classes, data;
        data = AddTextbookView.__super__.serializeData.call(this);
        this.model = this.collection.models;
        collection_classes = this.collection.pluck('classes');
        data.classes = _.chain(collection_classes).flatten().union().compact().sortBy(function(num) {
          return parseInt(num);
        }).map(function(m) {
          var classes;
          classes = [];
          classes.slug = _.slugify(CLASS_LABEL[m]);
          classes.label = CLASS_LABEL[m];
          classes.id = m;
          return classes;
        }).value();
        return data;
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
        var authname, checkedBoxes, class_ids, data, desc, name, slug, textbookName;
        class_ids = [];
        textbookName = $('#textname').val();
        if (textbookName.trim() !== '') {
          name = $('#textname').val();
          slug = $('#textname').val();
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
            parent: '-1',
            description: desc,
            term_meta: {
              author: authname
            },
            classes: class_ids
          };
          return this.trigger("save:textbook:data", data);
        } else {
          return this.$el.find('#textname').addClass('error');
        }
      };

      AddTextbookView.prototype.onAddTextbook = function(response) {
        this.$el.find('.success-msg').html('').removeClass('text-success, text-error');
        if (response.code === 'ERROR') {
          return this.$el.find('.success-msg').html('Failed to save schedule').addClass('text-error');
        } else {
          this.$el.find('.success-msg').html('Saved Successfully').addClass('text-success');
          return setTimeout((function(_this) {
            return function() {
              return _this.trigger('close:popup:dialog');
            };
          })(this), 500);
        }
      };

      return AddTextbookView;

    })(Marionette.ItemView);
    return App.commands.setHandler('add:textbook:popup', function(options) {
      return new AddTextbookPopup.Controller(options);
    });
  });
});
