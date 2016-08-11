define ['app'
        'controllers/region-controller'
        'apps/header/left/leftapp'
        'apps/header/right/rightapp'
        'text!apps/header/templates/header.html'], (App, RegionController, LeftApp, RightApp, headerTpl)->
    App.module "HeaderApp.Controller", (Controller, App)->
        class Controller.HeaderController extends RegionController

            initialize: ->
                @layout = layout = @_getHeaderView()

                @listenTo layout, 'show', @_showLeftRightViews

                @show layout

                @listenTo @layout.rightRegion, "user:logout", @_logoutCurrentUser

                @listenTo layout, 'user:logout', @_logoutCurrentUser

            _logoutCurrentUser:->
                $.post AJAXURL + '?action=logout_user',
                (response) =>
                    if response.error
                        console.log response
                    else
                        console.log response
                        console.log response.redirect_url
                        usermodel = App.request "get:user:model"
                        usermodel.clear()
                        #location.href=response.redirect_url
                        location.href=MAIN_SITE+"/#login"

            _showLeftRightViews: =>
                App.execute "show:leftheaderapp", region: @layout.leftRegion
                App.execute "show:rightheaderapp", region: @layout.rightRegion


            _getHeaderView: =>
                new HeaderView
                    templateHelpers:
                        show_user_name:->
                            user_model= App.request "get:user:model"
                            user_name= user_model.get 'display_name'


        class HeaderView extends Marionette.Layout

            template: headerTpl

            className: 'header navbar navbar-inverse'

            regions:
                leftRegion: '#header-left'
                rightRegion: '#header-right'

            events:
                    'click #logout'   :->
                        $.sidr 'close', 'walnutProfile'
                        @trigger "user:logout"

            serializeData: ->
                data = super()
                data.logourl = SITEURL + '/wp-content/themes/walnut/images/synapse_logo.png'
                data

            onShow: ->
                if $( window ).width()>1024
                    $( "#gears-mob" ).remove();

                if $( window ).width()<1025
                    $( "#gears-pc" ).remove();
                    # $('#walnutProfile').mmenu
                    #     position: 'right'
                    #     zposition: 'front'

                # @$el.find('.right-menu').sidr
                #     name : 'walnutProfile'
                #     side: 'right'
                #     renaming: false

                # || ($('.teacher-app').length>0)
                if (($('.creator').length > 0))
                    $('.page-content').addClass('condensed');
                    $(".header-seperation").css("display", "none");


        # set handlers
        App.commands.setHandler "show:headerapp", (opt = {})->
            new Controller.HeaderController opt

