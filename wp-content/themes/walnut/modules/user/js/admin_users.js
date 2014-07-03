jQuery(document).ready(function() {
    jQuery(function(){
        var roleselected = jQuery('#role').val();
        switch(roleselected){
            case 'teacher':
                jQuery('.visible-teacher').show();
                break;
            case 'student':
                 jQuery('.visible-student').show();
                 jQuery('#adduser-noconfirmation').prop('checked', true)
                 jQuery('#adduser-noconfirmation').prop('disabled', true);
                 jQuery('#noconfirmation').prop('checked', true);
                 jQuery('#noconfirmation').prop('disabled', true);
                break;
            default:
                break;
        }      
    });

    jQuery('#adduser-role,#role').on('change',function(){
        var roleselected = jQuery(this).val();
        switch(roleselected){
            case 'teacher':
                jQuery(this).closest('form').find('.visible-student').hide();
                jQuery(this).closest('form').find('.visible-teacher').show();
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('checked', false)
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('disabled', false);
                jQuery(this).closest('form').find('#noconfirmation').prop('checked', false);
                jQuery(this).closest('form').find('#noconfirmation').prop('disabled', false);
                break;
            case 'student':
                jQuery(this).closest('form').find('.visible-student').show();
                jQuery(this).closest('form').find('.visible-teacher').hide();
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('checked', true)
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('disabled', true);
                jQuery(this).closest('form').find('#noconfirmation').prop('checked', true);
                jQuery(this).closest('form').find('#noconfirmation').prop('disabled', true);
                break;
            default:
                jQuery(this).closest('form').find('.visible-student').hide();
                jQuery(this).closest('form').find('.visible-teacher').hide();
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('checked', false)
                jQuery(this).closest('form').find('#adduser-noconfirmation').prop('disabled', false);
                jQuery(this).closest('form').find('#noconfirmation').prop('checked', false);
                jQuery(this).closest('form').find('#noconfirmation').prop('disabled', false);
                break;            
        }
    });
    
    jQuery('#createusersub,#addusersub').on('click',function(){
        if(jQuery(this).attr('id') == 'addusersub'){
            var roleselected = jQuery(this).closest('form').find('#adduser-role').val();
        }else{
            var roleselected = jQuery(this).closest('form').find('#role').val();
        }
        if(roleselected == 'student'){
            var division = jQuery(this).closest('form').find('#student_division').val();
            if(division == ""){
                jQuery(this).closest('form').find('#student_division_row').addClass('form-invalid');
                return false;
            }else{
                jQuery(this).closest('form').find('#student_division_row').removeClass('form-invalid');
                return true;
            }
        }

    })
});