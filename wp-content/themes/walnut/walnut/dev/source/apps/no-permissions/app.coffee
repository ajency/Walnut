define ['app'
        'controllers/region-controller'], (App, RegionController)->
    App.module "NoPermissions.Controller", (Controller, App)->
        class Controller.NoPermissionsController extends RegionController

            initialize : ->

                @view = view = @_getNoPermissionsView()
                @show view

            _getNoPermissionsView : (items)->
                new NoPermissionsView()

        class NoPermissionsView extends Marionette.ItemView

            template : '<div class="tiles white grid simple vertical green animated slideInRight">
                            <div class="grid-title no-border">
                                FORBIDDEN ACCESS
                            </div>
                            <div style="overflow: hidden; display: block;" class="grid-body no-border">
                                <div class="row ">
                                  <div class="col-md-4">
                                        You do not have access to this section
                                    </div>
                                </div>
                            </div>
                      </div>'

        # set handlers
        App.commands.setHandler "show:no:permissions:app", (opt = {})->
            new Controller.NoPermissionsController opt