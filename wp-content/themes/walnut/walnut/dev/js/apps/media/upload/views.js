var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['app', 'plupload', 'text!apps/media/upload/templates/upload.html'], function(App, plupload, uploadTpl) {
  return App.module('Media.Upload.Views', function(Views, App) {
    return Views.UploadView = (function(superClass) {
      extend(UploadView, superClass);

      function UploadView() {
        return UploadView.__super__.constructor.apply(this, arguments);
      }

      UploadView.prototype.template = uploadTpl;

      UploadView.prototype.onShow = function() {
        this.uploader = new plupload.Uploader({
          runtimes: "gears,html5,flash,silverlight,browserplus",
          file_data_name: "async-upload",
          multiple_queues: true,
          browse_button: "choosefiles",
          multipart: true,
          urlstream_upload: true,
          max_file_size: "10mb",
          url: UPLOADURL,
          flash_swf_url: SITEURL + "/wp-includes/js/plupload/plupload.flash.swf",
          silverlight_xap_url: SITEURL + "/wp-includes/js/plupload/plupload.silverlight.xap",
          filters: [
            {
              title: "Image files",
              extensions: "jpg,gif,png"
            }
          ],
          multipart_params: {
            action: "upload-attachment",
            _wpnonce: _WPNONCE
          }
        });
        this.uploader.init();
        this.uploader.bind("FilesAdded", (function(_this) {
          return function(up, files) {
            _this.uploader.start();
            return _this.$el.find("#progress").show();
          };
        })(this));
        this.uploader.bind("UploadProgress", (function(_this) {
          return function(up, file) {
            console.log(file);
            return _this.$el.find(".progress-bar").css("width", file.percent + "%");
          };
        })(this));
        this.uploader.bind("Error", (function(_this) {
          return function(up, err) {
            return up.refresh();
          };
        })(this));
        return this.uploader.bind("FileUploaded", (function(_this) {
          return function(up, file, response) {
            _this.$el.find(".progress-bar").css("width", "0%");
            _this.$el.find("#progress").hide();
            response = JSON.parse(response.response);
            if (response.success) {
              return App.execute("new:media:added", response.data);
            }
          };
        })(this));
      };

      UploadView.prototype.onClose = function() {
        return this.uploader.destroy();
      };

      return UploadView;

    })(Marionette.ItemView);
  });
});
