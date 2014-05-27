define(['underscore', 'jquery'], function(_, $) {
  _.setUserID = function(id) {
    return window.localStorage.setItem("user_id", "" + id);
  };
  _.getUserID = function() {
    return window.localStorage.getItem("user_id");
  };
  _.setBlogID = function(id) {
    return window.localStorage.setItem("blog_id", "" + id);
  };
  _.getBlogID = function() {
    return window.localStorage.getItem("blog_id");
  };
  _.setBlogName = function(name) {
    return window.localStorage.setItem("blog_name", "" + name);
  };
  _.getBlogName = function() {
    return window.localStorage.getItem("blog_name");
  };
  _.setSchoolLogoSrc = function(src) {
    return window.localStorage.setItem("school_logo_src", "" + src);
  };
  _.getSchoolLogoSrc = function() {
    return window.localStorage.getItem("school_logo_src");
  };
  _.setSynapseAssetsDirectoryPath = function(path) {
    return window.localStorage.setItem("synapse_directory_path", "" + path);
  };
  return _.getSynapseAssetsDirectoryPath = function() {
    return window.localStorage.getItem("synapse_directory_path");
  };
});
