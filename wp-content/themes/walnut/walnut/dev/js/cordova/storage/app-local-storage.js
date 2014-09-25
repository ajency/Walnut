define(['underscore'], function(_) {
  return _.mixin({
    cordovaLocalStorage: function() {
      return _.localStorage = window.localStorage;
    },
    setUserID: function(id) {
      return _.localStorage.setItem("user_id", id);
    },
    getUserID: function() {
      return _.localStorage.getItem("user_id");
    },
    setTblPrefix: function(blog_id) {
      return _.localStorage.setItem("table_prefix", 'wp_' + blog_id + '_');
    },
    getTblPrefix: function() {
      return _.localStorage.getItem("table_prefix");
    },
    setSchoolLogoSrc: function(src) {
      return _.localStorage.setItem("school_logo_src", src);
    },
    getSchoolLogoSrc: function() {
      return _.localStorage.getItem("school_logo_src");
    },
    setGeneratedZipFilePath: function(path) {
      return _.localStorage.setItem("gererated_zip_file_path", path);
    },
    getGeneratedZipFilePath: function() {
      return _.localStorage.getItem("gererated_zip_file_path");
    },
    setSynapseMediaDirectoryPath: function(path) {
      return _.localStorage.setItem("synapse_media_directory_path", path);
    },
    getSynapseMediaDirectoryPath: function() {
      return _.localStorage.getItem("synapse_media_directory_path");
    },
    setSyncRequestId: function(id) {
      return _.localStorage.setItem("sync_request_id", id);
    },
    getSyncRequestId: function() {
      return _.localStorage.getItem("sync_request_id");
    },
    setAudioCues: function(Value) {
      return _.localStorage.setItem("check_uncheck_value", Value);
    },
    getAudioCues: function() {
      return _.localStorage.getItem("check_uncheck_value");
    }
  });
});
