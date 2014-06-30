jQuery(document).ready(function() {
    jQuery(function(){
        var roleselected = jQuery('#role').val();
        switch(roleselected){
            case 'teacher':
                jQuery('.visible-teacher').show();
                break;
            case 'student':
                 jQuery('.visible-student').show();
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
                break;
            case 'student':
                jQuery(this).closest('form').find('.visible-student').show();
                jQuery(this).closest('form').find('.visible-teacher').hide();
                break;
            default:
                jQuery(this).closest('form').find('.visible-student').hide();
                jQuery(this).closest('form').find('.visible-teacher').hide();
                break;            
        }
    });
});