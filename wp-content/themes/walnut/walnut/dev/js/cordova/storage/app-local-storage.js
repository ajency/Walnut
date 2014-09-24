define(['underscore'], function(_) {
  return _.mixin({
    cordovaLocalStorage: function() {
      return _.localStorage = window.localStorage;
    },
    setCookiesValue: function(cookiesValue) {
      return _.localStorage.setItem("CookiesVal", cookiesValue);
    },
    getCookiesValue: function() {
      return _.localStorage.getItem("CookiesVal");
    },
    setUserEmail: function(u_email) {
      return _.localStorage.setItem("user_email", u_email);
    },
    getUserEmail: function() {
      return _.localStorage.getItem("user_email");
    },
    setUserID: function(id) {
      return _.localStorage.setItem("user_id", id);
    },
    getUserID: function() {
      return _.localStorage.getItem("user_id");
    },
    setUserName: function(name) {
      return _.localStorage.setItem("user_name", name);
    },
    getUserName: function() {
      return _.localStorage.getItem("user_name");
    },
    setBlogID: function(id) {
      return _.localStorage.setItem("blog_id", id);
    },
    getBlogID: function() {
      return _.localStorage.getItem("blog_id");
    },
    setBlogName: function(name) {
      return _.localStorage.setItem("blog_name", name);
    },
    getBlogName: function() {
      return _.localStorage.getItem("blog_name");
    },
    setSiteUrl: function(url) {
      return _.localStorage.setItem("site_url", url);
    },
    getSiteUrl: function() {
      return _.localStorage.getItem("site_url");
    },
    setStudentDivision: function(division) {
      return _.localStorage.setItem("student_division", division);
    },
    getStudentDivision: function() {
      return _.localStorage.getItem("student_division");
    },
    setUserCapabilities: function(allcaps) {
      return _.localStorage.setItem("user_capabilities", JSON.stringify(allcaps));
    },
    getUserCapabilities: function() {
      return JSON.parse(_.localStorage.getItem("user_capabilities"));
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
