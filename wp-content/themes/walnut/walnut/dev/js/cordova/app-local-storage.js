define(['underscore', 'jquery'], function(_, $) {
  _.setUserID = function(id) {
    return window.localStorage.setItem("user_id", id);
  };
  _.getUserID = function() {
    return window.localStorage.getItem("user_id");
  };
  _.setUserName = function(name) {
    return window.localStorage.setItem("user_name", name);
  };
  _.getUserName = function() {
    return window.localStorage.getItem("user_name");
  };
  _.setBlogID = function(id) {
    return window.localStorage.setItem("blog_id", id);
  };
  _.getBlogID = function() {
    return window.localStorage.getItem("blog_id");
  };
  _.setBlogName = function(name) {
    return window.localStorage.setItem("blog_name", name);
  };
  _.getBlogName = function() {
    return window.localStorage.getItem("blog_name");
  };
  _.setSchoolLogoSrc = function(src) {
    return window.localStorage.setItem("school_logo_src", src);
  };
  _.getSchoolLogoSrc = function() {
    return window.localStorage.getItem("school_logo_src");
  };
  _.setSynapseAssetsDirectoryPath = function(path) {
    return window.localStorage.setItem("synapse_directory_path", path);
  };
  _.getSynapseAssetsDirectoryPath = function() {
    return window.localStorage.getItem("synapse_directory_path");
  };
  _.setFilePath = function(path) {
    return window.localStorage.setItem("filepath", "" + path);
  };
  return _.getFilePath = function() {
    return window.localStorage.getItem("filepath");
  };
});
