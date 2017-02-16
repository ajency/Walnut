##
## The main dashboard App
##
define ['marionette'], (Marionette)->
    window.App = new Marionette.Application

# Main app regions
    App.addRegions
        leftNavRegion: '#left-nav-region'
        headerRegion: '#header-region'
        mainContentRegion: '#main-content-region'
        popupRegion:  '#dialog-region'
        dialogRegion: Marionette.Region.Dialog.extend el: '#dialog-region'
        loginRegion: '#login-region'
        breadcrumbRegion: '#breadcrumb-region'

    # The default route for app
    App.rootRoute = ""

    # loginRoute in case session expires
    App.loginRoute = "login"

    # Reqres handler to return a default region. If a controller is not explicitly specified a
    # region it will trigger default region handler
    App.reqres.setHandler "default:region", ->
        App.mainContentRegion

    # App command to handle async request and action to be performed after that
    # entities are the the dependencies which trigger a fetch to server.
    App.commands.setHandler "when:fetched", (entities, callback) ->
        xhrs = _.chain([entities]).flatten().pluck("_fetch").value()
        $.when(xhrs...).done ->
            callback()

    # Registers a controller instance
    App.commands.setHandler "register:instance", (instance, id) ->
        App.register instance, id

    # Unregisters a controller instance
    App.commands.setHandler "unregister:instance", (instance, id) ->
        App.unregister instance, id

    App.on "initialize:after", (options) ->

        App.startHistory()
        
        if USER? and USER.ID
            user = App.request "get:user:model" 
            App.execute "show:headerapp", region: App.headerRegion
            App.execute "show:leftnavapp", region: App.leftNavRegion
            App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
            App.vent.trigger "show:dashboard" if @getCurrentRoute() is 'login'
            App.loginRegion.close()

        else
            App.vent.trigger "show:login"


    App.vent.on "show:dashboard", (user_role) =>

        if App.request('current:user:can','administrator') or App.request('current:user:can','school-admin') or App.request('current:user:can','content-creator')
            window.location.replace(SITEURL+"#textbooks")
            window.location.reload()
            #App.navigate('textbooks', trigger: true)

        if App.request 'current:user:can','teacher'
            App.navigate('teachers/dashboard', trigger: true)     

        if App.request 'current:user:can','student'
            $("body").hide()
            window.location.href = SITEURL+'/dashboard-student'          
            return false
        App.execute "show:breadcrumbapp", region: App.breadcrumbRegion
        App.execute "show:headerapp", region: App.headerRegion
        App.execute "show:leftnavapp", region: App.leftNavRegion

        Pace.on 'hide', ()->
            $("#site_main_container").addClass("showAll");

    App.vent.on "show:login", ->
        App.leftNavRegion.close()
        App.headerRegion.close()
        App.mainContentRegion.close()
        App.breadcrumbRegion.close()
        @rootRoute = 'login'
        # if not logged in change rootRoute to login
        App.navigate(@rootRoute, trigger: true)

    App

