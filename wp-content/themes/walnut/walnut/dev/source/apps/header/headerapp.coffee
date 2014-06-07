define ['app'
        'controllers/region-controller'
        'apps/header/left/leftapp'
        'apps/header/right/rightapp'
        'text!apps/header/templates/header.html'], (App, RegionController, LeftApp, RightApp, headerTpl)->
    
    App.module "HeaderApp.Controller", (Controller, App)->

        class Controller.HeaderController extends RegionController

            initialize: ->
                @layout = layout = @_getHeaderView()

                @school = App.request "get:current:school"

                @listenTo layout, 'show', @_showLeftRightViews

                @show layout, (loading: true)

                @listenTo @layout.rightRegion, "user:logout", @_logoutCurrentUser

                @listenTo layout, 'user:logout', @_logoutCurrentUser

            _logoutCurrentUser:->
                $.post AJAXURL + '?action=logout_user',
                (response) =>
                    if response.error
                        console.log response
                    else
                        usermodel = App.request "get:user:model"
                        usermodel.clear()
                        App.vent.trigger "show:login"

            _showLeftRightViews: =>
                App.execute "show:leftheaderapp", region: @layout.leftRegion
                App.execute "show:rightheaderapp", region: @layout.rightRegion


            _getHeaderView: =>
                console.log '@school2'
                console.log @school
                new HeaderView
                    model: @school


        class HeaderView extends Marionette.Layout

            template: headerTpl

            className: 'header navbar navbar-inverse'

            regions:
                leftRegion: '#header-left'
                rightRegion: '#header-right'

            events:
                'click #logout' : 'onLogout'

            
            serializeData: ->
                data = super()
                data.logourl = SITEURL + '/wp-content/themes/walnut/images/walnutlearn.png'
                data.logourl= SITEURL+ '/images/logo-synapse.png' if _.platform() is 'DEVICE'
                console.log SITEURL
                data

            onShow: ->

                if $( window ).width()<1025
                    $('#walnutProfile').mmenu
                        position: 'right'
                        zposition: 'front'

                # @$el.find('.right-menu').sidr
                #     name : 'walnutProfile'
                #     side: 'right'
                #     renaming: false

                # || ($('.teacher-app').length>0)
                if (($('.creator').length > 0))
                    $('.page-content').addClass('condensed');
                    $(".header-seperation").css("display", "none");

                # changes for mobile
                if _.platform() is 'DEVICE'
                     #display name of logged in user
                    @$el.find('#app_username').text('Hi '+_.getUserName()+',')


            onLogout: ->
                $.sidr 'close', 'walnutProfile'

                if _.platform() is 'BROWSER'
                    @trigger "user:logout"
                
                else
                    console.log 'Synapse App Logout'

                    _.setUserID(null)

                    user = App.request "get:user:model"
                    user.clear()

                    App.leftNavRegion.close()
                    App.headerRegion.close()
                    App.mainContentRegion.close()
                    App.breadcrumbRegion.close()

                    App.navigate('app-login', trigger: true)



        # set handlers
        App.commands.setHandler "show:headerapp", (opt = {})->
            new Controller.HeaderController opt

