define ['app'
        'controllers/region-controller'
],(App,RegionController)->
    App.module 'RestPasswordApp', (RestPasswordApp,App)->

        class RestPasswordApp.Controller extends RegionController

            initialize :->

                @view = @_getRestPasswordView()

                @show @view

                @listenTo @view, 'close:popup:dialog', ->
                    @region.closeDialog()

                @listenTo @view, 'reset:user:password', @resetUserPassword

            resetUserPassword: (email)=>

                console.log email

                connection_resp = $.middle_layer(AJAXURL + '?action=reset-user-password'
                    'email': email
                    (response) =>
                        if response.error
                            @view.triggerMethod 'email:doesnt:exist', response
                        else
                            @view.triggerMethod "reset:mail:sent",email
                );

                if(connection_resp is "connection_error")
                    @view.triggerMethod 'connection:fail'

            _getRestPasswordView :=>
                new RestPasswordView()


        class RestPasswordView extends Marionette.CompositeView

            template : '<div class="row">
                            <div id="reset-password-form">  
                                <form>
                                    <div class="col-md-12"> 
                                        <label for="name">Your Email Address:</label>
                                        <input required="required" id="email" name="email" type="email" class="form-control"> 
                                        <div class="error"></div>
                                        <button id="reset-password" class="btn btn-success btn-cons pull-right m-t-10" type="submit">Reset Password </button>
                                    </div>
                                </form>
                            </div>
                            <div id="success-div" class="none">
                                <div class="col-md-12"> 
                                    <div id="success_msg"></div>
                                    <button data-dismiss="modal" class="btn btn-success btn-cons pull-right m-t-10">OK</button>
                                </div>
                            </div>

                        </div>'

            initialize:->
                @dialogOptions = 
                    modal_title : 'Reset Password'
                    modal_size  : 'small'

            events:->

                'click #reset-password' : 'validateEmail'


            validateEmail:(e)->

                e.preventDefault();

                if not @$el.find('form').valid()
                    @$el.find '.error'
                    .html 'Please enter a valid email address'

                else
                    email = @$el.find('#email').val()
                    @$el.find '.error'
                    .html ''
                    @trigger 'reset:user:password', email

            onResetMailSent:(email)->

                @$el.find '#reset-password-form'
                .remove()

                @$el.find '#success-div'
                .show()

                @$el.find '#success_msg'
                .html 'Successfully sent password reset link to '+ email


                    
        App.commands.setHandler 'show:reset:password:popup',(options)->
            new RestPasswordApp.Controller options
