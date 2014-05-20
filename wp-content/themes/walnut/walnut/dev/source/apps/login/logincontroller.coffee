define ['app'
    'controllers/region-controller'
    'text!apps/login/templates/login.html'], (App, RegionController, loginTpl)->

    App.module "LoginApp.Controller", (Controller, App)->
        class Controller.LoginController extends RegionController

            initialize: ->
                @view = view = @_getLoginView()

                # listen to authenticate:user event from the view.
                @listenTo view, 'authenticate:user', @authenticateUser

                # listen to the close event of the view
                @listenTo view, 'close', ->
                    App.vent.trigger 'show:dashboard'

                @show view, (loading: true)

            _getLoginView: ->
                new LoginView


            authenticateUser: (data)=>
                connection_resp = $.middle_layer(AJAXURL + '?action=get-user-profile'
                    data: data
                    (response) =>
                        if response.error
                            @view.triggerMethod 'login:fail', response
                        else
                            user = App.request "get:user:model"
                            user.set response
                            @view.close()
                );

                if(connection_resp is "connection_error")
                    @view.triggerMethod 'connection:fail'


        class LoginView extends Marionette.ItemView

            template: loginTpl

            className: ''

            events:
                'click #login-submit': 'submitLogin'

            onShow: ->
                $('body').addClass 'error-body no-top'
                $('.page-content').addClass 'condensed'

            submitLogin: (e)->
                e.preventDefault()
                if @$el.find('form').valid()
                    @$el.find('#checking_login').remove();

                    @$el.find '#login-submit'
                    .append '<i id="checking_login" class="fa fa-spinner fa fa-1x fa-spin"></i>'

                    data = Backbone.Syphon.serialize (@)
                    @trigger "authenticate:user", data

            onLoginFail: (resp) ->
                @$el.find('#checking_login, #invalid_login').remove();

                @$el.find('#login-form')
                .before '<span id="invalid_login" class="btn btn-danger btn-cons">' + resp.error + '</span>';


            onConnectionFail: ->
                error_msg = 'Connection could not be established. Please try again.'
                @$el.find('#checking_login, #invalid_login').remove();

                @$el.find('#login-form')
                .before '<span id="invalid_login" class="btn btn-danger btn-cons">' + error_msg + '</span>';




