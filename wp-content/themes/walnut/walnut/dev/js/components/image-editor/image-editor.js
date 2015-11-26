var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

define(['app', 'marionette'], function(App, Marionette) {
  var ImageEditorView, InvalidMediaView, imageCropView;
  window.imageEdit.initCrop = function(postid, image, parent) {
    var $img, selH, selW, t;
    t = this;
    selW = $("#imgedit-sel-width-" + postid);
    selH = $("#imgedit-sel-height-" + postid);
    $img = void 0;
    return t.iasapi = $(image).imgAreaSelect({
      aspectRatio: App.currentImageRatio,
      parent: parent,
      instance: true,
      handles: true,
      keys: true,
      minWidth: 3,
      minHeight: 3,
      onInit: function(img) {
        $img = $(img);
        $img.next().css("position", "absolute").nextAll(".imgareaselect-outer").css("position", "absolute");
        t._view.$el.find("#imgedit-crop-sel-" + postid).prev().hide();
        return t._view._informUser();
      },
      onSelectStart: function() {
        imageEdit.setDisabled($("#imgedit-crop-sel-" + postid), 1);
      },
      onSelectEnd: function(img, c) {
        imageEdit.setCropSelection(postid, c);
      },
      onSelectChange: function(img, c) {
        var sizer;
        sizer = imageEdit.hold.sizer;
        selW.val(imageEdit.round(c.width / sizer));
        selH.val(imageEdit.round(c.height / sizer));
      }
    });
  };
  InvalidMediaView = (function(_super) {
    __extends(InvalidMediaView, _super);

    function InvalidMediaView() {
      return InvalidMediaView.__super__.constructor.apply(this, arguments);
    }

    InvalidMediaView.prototype.template = 'Invalid media argument passed';

    return InvalidMediaView;

  })(Marionette.ItemView);
  ImageEditorView = (function(_super) {
    __extends(ImageEditorView, _super);

    function ImageEditorView() {
      this._iasInit = __bind(this._iasInit, this);
      this.showImageEditor = __bind(this.showImageEditor, this);
      return ImageEditorView.__super__.constructor.apply(this, arguments);
    }

    ImageEditorView.prototype.className = 'wp_attachment_holder';

    ImageEditorView.prototype.template = '<p class="loading t-a-c">Loading... Please wait...</p>';

    ImageEditorView.prototype.initialize = function(options) {
      ImageEditorView.__super__.initialize.call(this, options);
      if (this.model._fetch) {
        return App.execute("when:fetched", [this.model], this.showImageEditor);
      } else {
        return this.listenTo(this, 'show', this.showImageEditor);
      }
    };

    ImageEditorView.prototype.back = function() {
      this.trigger("image:editing:cancelled");
      return this.close();
    };

    ImageEditorView.prototype.save = function() {
      return this.model.fetch({
        success: (function(_this) {
          return function(model) {
            return _this.back();
          };
        })(this)
      });
    };

    ImageEditorView.prototype.refresh = function() {
      return this.model.fetch();
    };

    ImageEditorView.prototype.showImageEditor = function() {
      this.render();
      this.$el.attr('id', "image-editor-" + (this.model.get('id')));
      return _.delay((function(_this) {
        return function() {
          return window.imageEdit.open(_this.model.get('id'), _this.model.get('nonces').edit, _this);
        };
      })(this), 400);
    };

    ImageEditorView.prototype._informUser = function() {
      var aspectRatio, assumedMaxWidth, builderBrowserWidth, ele, expectedImageHeight, expectedImageWidth, note, sliderHeight, sliderWidth;
      builderBrowserWidth = $('#aj-imp-builder-drag-drop').width();
      assumedMaxWidth = 1600;
      aspectRatio = window.imageEdit.iasapi.getOptions().aspectRatio;
      if (!_.isString(aspectRatio)) {
        return false;
      }
      aspectRatio = aspectRatio.split(':');
      sliderWidth = parseFloat(aspectRatio.shift());
      sliderHeight = parseFloat(aspectRatio.pop());
      expectedImageWidth = (assumedMaxWidth * sliderWidth) / builderBrowserWidth;
      expectedImageHeight = (sliderHeight * expectedImageWidth) / sliderWidth;
      note = "<p class='note'><b>Expected image width to scale up on all screen sizes is <br /> " + (parseInt(expectedImageWidth)) + " x " + (parseInt(expectedImageHeight)) + "</b></p>";
      ele = this.$el.find("#imgedit-crop-sel-" + (this.model.get('id')));
      ele.next('.note').remove();
      return ele.after(note);
    };

    ImageEditorView.prototype._iasInit = function(img) {
      var $img;
      $img = $(img);
      $img.next().css('position', 'absolute').nextAll('.imgareaselect-outer').css('position', 'absolute');
      return this.$el.find("#imgedit-crop-sel-" + (this.model.get('id'))).prev().hide();
    };

    return ImageEditorView;

  })(Marionette.ItemView);
  imageCropView = function(mediaId, options) {
    var imageEditorView, media;
    if (mediaId == null) {
      mediaId = 0;
    }
    if (options == null) {
      options = {};
    }
    if (mediaId === 0) {
      return new InvalidMediaView;
    }
    if (_.isObject(mediaId)) {
      media = mediaId;
    } else if (_.isNumber(parseInt(mediaId))) {
      media = App.request("get:media:by:id", mediaId);
    }
    imageEditorView = new ImageEditorView({
      model: media,
      options: options
    });
    return imageEditorView;
  };
  return App.reqres.setHandler("get:image:editor:view", imageCropView);
});
