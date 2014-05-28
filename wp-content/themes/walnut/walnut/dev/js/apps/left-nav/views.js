var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['app', 'text!apps/left-nav/templates/leftnav.html'], function(App, navTpl) {
  return App.module("LeftNavApp.Controller.Views", function(Views, App) {
    var MenuItemView;
    MenuItemView = (function(_super) {
      __extends(MenuItemView, _super);

      function MenuItemView() {
        return MenuItemView.__super__.constructor.apply(this, arguments);
      }

      MenuItemView.prototype.tagName = 'li';

      MenuItemView.prototype.template = '<a href="javascript:;"> <i class="{{iconClass}}"></i> <span class="title">{{post_title}}</span> <span class="arrow"></span> </a> <ul class="sub-menu"> {{#submenu}} <li><a href="{{menu_item_link}}">{{post_title}}</a></li> {{/submenu}} </ul>';

      MenuItemView.prototype.serializeData = function() {
        var data, iconClass;
        data = MenuItemView.__super__.serializeData.call(this);
        iconClass = 'icon-custom-ui';
        if (this.model.get('post_title') === 'Training Module') {
          iconClass = 'fa fa-pencil-square-o';
        }
        if (this.model.get('post_title') === 'Content Management') {
          iconClass = 'fa fa-book';
        }
        data.iconClass = iconClass;
        return data;
      };

      return MenuItemView;

    })(Marionette.ItemView);
    return Views.LeftNavView = (function(_super) {
      var handleSidenarAndContentHeight;

      __extends(LeftNavView, _super);

      function LeftNavView() {
        return LeftNavView.__super__.constructor.apply(this, arguments);
      }

      LeftNavView.prototype.template = navTpl;

      LeftNavView.prototype.id = 'main-menu';

      LeftNavView.prototype.className = 'page-sidebar';

      LeftNavView.prototype.itemView = MenuItemView;

      LeftNavView.prototype.itemViewContainer = 'ul.menu-items';

      LeftNavView.prototype.events = {
        'click li': 'clickMenu'
      };

      LeftNavView.prototype.onShow = function() {
        var elem;
        if ($('.creator').length > 0) {
          $("#main-menu").addClass("mini");
          $(".start").removeClass("active open");
          $(".arrow").removeClass("open");
          $('.page-content').addClass('condensed');
          $('.header-seperation').hide();
        } else {
          $('.page-content').removeClass('condensed');
        }
        if ($('.page-sidebar').hasClass('mini')) {
          elem = $('.page-sidebar ul');
          elem.children('li.open').children('a').children('.arrow').removeClass('open');
          elem.children('li.open').children('a').children('.arrow').removeClass('active');
          elem.children('li.open').children('.sub-menu').slideUp(200);
          elem.children('li').removeClass('open');
        }
        $('#main-menu-toggle').sidr({
          name: 'main-menu',
          side: 'left'
        });
        return $('.chat-menu-toggle').sidr({
          name: 'walnutProfile',
          side: 'right',
          renaming: false,
          source: '#walnutProf'
        });
      };

      LeftNavView.prototype.clickMenu = function(e) {
        var li_target, parent, sub;
        li_target = $(e.target).closest('li').find('a');
        if (li_target.next().hasClass('sub-menu') === false) {
          return;
        }
        parent = li_target.parent().parent();
        parent.children('li.open').children('a').children('.arrow').removeClass('open');
        parent.children('li.open').children('a').children('.arrow').removeClass('active');
        parent.children('li.open').children('.sub-menu').slideUp(200);
        parent.children('li').removeClass('open');
        sub = li_target.next();
        if (sub.is(":visible")) {
          $('.arrow', li_target).removeClass("open");
          li_target.parent().removeClass("active");
          sub.slideUp(200, function() {
            return handleSidenarAndContentHeight();
          });
        } else {
          $('.arrow', li_target).addClass("open");
          li_target.parent().addClass("open");
          sub.slideDown(200, function() {
            return handleSidenarAndContentHeight();
          });
        }
        return e.preventDefault();
      };

      handleSidenarAndContentHeight = function() {
        var content, sidebar;
        content = $('.page-content');
        sidebar = $('.page-sidebar');
        if (!content.attr("data-height")) {
          content.attr("data-height", content.height());
        }
        if (sidebar.height() > content.height()) {
          return content.css("min-height", sidebar.height() + 120);
        } else {
          return content.css("min-height", content.attr("data-height"));
        }
      };

      return LeftNavView;

    })(Marionette.CompositeView);
  });
});
