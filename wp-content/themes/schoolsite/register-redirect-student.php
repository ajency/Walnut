<?php
/*
  Template Name: Register Redirect Student
 */
?>
<?php
	get_header('student');
?>

<?php
    $current_user = wp_get_current_user();
    $meta = get_user_meta($current_user->ID);
    
    $user_info = get_userdata($current_user->ID);

    $profile_status = check_if_parent_info_completed($current_user->ID);

    $students = get_parents_students($user_info->user_email);

    if($profile_status == 'pending'){
        $student_panel = 'panel-disabled';
    }else{
        $student_panel = '';
    }

    $divisions = get_all_class_divisions();
    

   if(!$students){     
    $nostudent = '';
    $student = 'hidden';
   }else{
    $nostudent = 'hidden';
    $student = '';
   }

?>
<div class="create-ac-card">



            <div class="create-ac-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        
                            <div class="col-sm-6 col-sm-offset-3 col-lg-6 col-lg-offset-3 wrapped">
                                <h4 class="account-head">
                                    My Profile
                                </h4>
                                <hr/>

                                <?php
                                    //print_r($students);
                                ?>
                                <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

                                    <div class="panel panel-default">
                                    <form id="parent_form" name="parent_form">

                                        <div class="panel-heading" role="tab" id="headingOne">
                                            <h4 class="panel-title">
                                                <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                    Parents Information
                                                </a>
                                            </h4>
                                        </div>

                                        
                                        <div class="alert alert-danger fade in parent_errors" style="display:none">                                        
                                            <ul></ul>
                                        </div>

                                        <div class="alert alert-success fade in parent_message" style="display:none">
                                            <div class="message"></div>
                                        </div>

                                        <div id="collapseOne" class="panel-collapse collapse in parent-panel" role="tabpanel" aria-labelledby="headingOne">
                                            <div class="panel-body">
                                                <!-- Parents info -->
                                                <div class="row parents-info">
                                                    <!--
                                                        <h5>
                                                            Parents Information
                                                        </h5>
                                                    -->
                                                    <input type="hidden" name="parent_id" value="<?php echo $current_user->ID; ?>" />
                                                    <div class="col-sm-6 col-lg-6">
                                                        <div class="info text-center">
                                                            <div class="mat-holder">
                                                                <label for="Parent Name" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    Parent Name
                                                                </label>
                                                                <input  value="<?php echo isset($meta['parent_name'])? $meta['parent_name'][0]:"" ?>" name="parent_name" type="text" class="mat-input" required/>
                                                            </div>
                                                            <div class="sel-mandatory">
                                                                <select name="relation_with_student" id="" required>
                                                                    <option value="">
                                                                        Relationship with student
                                                                    </option>
                                                                    <option <?php echo isset($meta['relation_with_student']) && $meta['relation_with_student'][0]== "father" ? "selected":"" ?> value="father">Father</option>
                                                                    <option <?php echo isset($meta['relation_with_student']) && $meta['relation_with_student'][0]== "mother" ? "selected":"" ?> value="mother">Mother</option>
                                                                </select>
                                                            </div>
                                                            <div class="mat-holder">
                                                                <label for="landline" class="mat-label">
                                                                    Landline Number
                                                                </label>
                                                                <input value="<?php echo isset($meta['landline_no'])? $meta['landline_no'][0]:"" ?>" name="landline_no" type="text" class="mat-input"/>
                                                            </div>
                                                            <div class="mat-holder">
                                                                <label for="zipcode" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    Zipcode
                                                                </label>
                                                                <input value="<?php echo isset($meta['zipcode'])? $meta['zipcode'][0]:"" ?>" name="zipcode" type="text" class="mat-input" required/>
                                                            </div>
                                                            <select name="state" id="">
                                                                <option value="">
                                                                    State
                                                                </option>
                                                                <option <?php echo isset($meta['state']) && $meta['state'][0]== "goa" ? "selected":"" ?> value="goa">
                                                                    Goa
                                                                </option>
                                                                <option <?php echo isset($meta['state']) && $meta['state'][0]== "maharashtra" ? "selected":"" ?> value="maharashtra">
                                                                    Maharashtra
                                                                </option>
                                                                <option <?php echo isset($meta['state']) && $meta['state'][0]== "karnataka" ? "selected":"" ?> value="karnataka">
                                                                    Karnataka
                                                                </option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-6 col-lg-6">
                                                        <div class="info text-center">
                                                            <div class="mat-holder">
                                                                <label for="Parent email" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    Parent Email ID
                                                                </label>
                                                                <input type="text" class="mat-input" value="<?php echo $user_info->user_email; ?>" name="parent_email" required disabled/>
                                                            </div>
                                                            <div class="mat-holder">
                                                                <label for="Mobile" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    Mobile Number
                                                                </label>
                                                                <input value="<?php echo isset($meta['parent_mobile'])? $meta['parent_mobile'][0]:"" ?>" name="parent_mobile" type="text" class="mat-input" required/>
                                                            </div>
                                                            <div class="mat-holder">
                                                                <label for="Address" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    Address
                                                                </label>
                                                                <input value="<?php echo isset($meta['address'])? $meta['address'][0]:"" ?>" name="address" type="text" class="mat-input" required/>
                                                            </div>
                                                            <div class="mat-holder">
                                                                <label for="city" class="mat-label">
                                                                    <span class="mandatory">
                                                                        *
                                                                    </span>
                                                                    City
                                                                </label>
                                                                <input value="<?php echo isset($meta['parent_city'])? $meta['parent_city'][0]:"" ?>" name="parent_city" type="text" class="mat-input" required/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                  <div class="row create-ac text-center">
                                                    <div class="col-md-12">
                                                        <button type="submit" class="btn parent_info">
                                                            Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </form>
                                    </div>


                                    <div class="panel <?php echo $student_panel; ?>">                                    
                                        <div class="panel-heading" role="tab" id="headingTwo">
                                            <h4 class="panel-title">
                                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                    Student Information
                                                </a>
                                            </h4>
                                        </div>
                                        <div id="collapseTwo" class="panel-collapse collapse student-panel" role="tabpanel" aria-labelledby="headingTwo">
                                            <div class="panel-body">

                                                <h5 class="student-alert <?php echo $nostudent; ?>">
                                                    You dont have any student data currently added please add students datato continue
                                                </h5>                                                                                                
                                                    <div class="row">
                                                        <div class="col-md-12">
                                                            <div class="added_students <?php echo $student; ?>">

                                                            <?php if($students){ 
                                                                foreach($students as $student){
                                                                    $student_info = get_userdata($student->user_id);
                                                                ?>

                                                                <div class="students">
                                                                    <button class="btn even" type="button" data-student-id="<?php echo $student->user_id; ?>">
                                                                        <?php echo $student_info->display_name; ?>
                                                                    </button>
                                                                </div>
                                                            <?php } 
                                                                }
                                                            ?>
                                                            </div>
                                                        </div>
                                                    </div>

                                                <div class="row create-ac text-center">
                                                    <div class="col-md-12">
                                                        <button type="submit" class="btn" data-toggle="modal" data-target="#add_student">
                                                            Add Student
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>                                                   
                    </div>
                </div>
            </div>
        </div>


        <!-- Modal -->
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="add-student">
                        <div class="modal fade" id="add_student" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h4>
                                            Student Information
                                        </h4>
                                    </div>

                                    <div class="modal-body">

                                        <div class="alert alert-danger fade in student_errors" style="display:none">                                        
                                            <ul></ul>
                                        </div>

                                        <div class="alert alert-success fade in student_message" style="display:none">
                                            <div class="message"></div>
                                        </div>

                                    <form id="student_form" name="student_form">
                                    <input type="hidden" name="parent_id" value="<?php echo $current_user->ID; ?>" />
                                    <input type="hidden" name="parent_email1" value="<?php echo $user_info->user_email; ?>" />
                                        <div class="row student-info">
                                            <div class="col-sm-6 col-lg-6">
                                                <div class="info text-center">
                                                    <div class="mat-holder">
                                                        <label for="First Name" class="mat-label">
                                                            <span class="mandatory">
                                                                *
                                                            </span>
                                                            First Name
                                                        </label>
                                                        <input value="" name="first_name" type="text" class="mat-input" required/>
                                                    </div>
                                                    <div class="mat-holder">
                                                        <label for="date" class="mat-label">
                                                            <span class="mandatory">
                                                                *
                                                            </span>
                                                            Date of Birth
                                                        </label>
                                                        <input value="" name="dob" type="date" class="mat-input" required/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-sm-6 col-lg-6">
                                                <div class="info text-center">
                                                    <div class="mat-holder">
                                                        <label for="Last Name" class="mat-label">
                                                            <span class="mandatory">
                                                                *
                                                            </span>
                                                            Last Name
                                                        </label>
                                                        <input value="" name="last_name" type="text" class="mat-input" required/>
                                                    </div>
                                                    <div class="mat-holder">
                                                        <label for="text" class="mat-label">
                                                            <span class="mandatory">
                                                                *
                                                            </span>
                                                            School Name
                                                        </label>
                                                        <input value="" name="last_school_attended" type="text" class="mat-input" required/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row student-info">
                                           <div class="col-sm-6 col-lg-6">
                                                <div class="info text-center">
                                                <div class="sel-mandatory">
                                                    <select name="student_division" id="" required>
                                                      <option value="">
                                                          Class
                                                      </option>
                                                      <?php foreach($divisions as $division){ ?>
                                                        <option value="<?php echo $division['id']; ?>"><?php echo $division['division']; ?></option>
                                                      <?php } ?>                                                      
                                                  </select>
                                                  </div>
                                                </div>
                                            </div>
                                        </div>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn cancel" data-dismiss="modal">
                                            Cancel
                                        </button>
                                        <button type="button" class="btn add_parent_student">
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

     


        <?php

	get_footer('student');
?>



<script type="text/javascript">
$(document).ready(function() {
        var ajaxurl = '<?php echo admin_url('admin-ajax.php'); ?>';
        var siteurl = '<?php echo get_site_url(); ?>';
        var profile_status = '<?php echo $profile_status; ?>';

        if(profile_status === 'completed'){
            $(".student-panel").collapse('toggle');
            $(".parent-panel").collapse('hide');
        }
        


        $( ".parent_info" ).click(function( event ) {
            event.preventDefault();
            var form_data = $('#parent_form').serialize();

            $(".parent_errors").hide();
            $(".parent_message").hide();

            jQuery.ajax({
            dataType: 'json',
            type: 'POST',
            url: ajaxurl,
            data: {'action':'update_parent_info','data':form_data},
            success: function(response) {
                console.log(response);
                if(response.status === 'failed'){
                    showParentErrors(response.errors);
                }else{
                    showSuccessMessageParentInfo(response.message);
                    $(".student-panel").collapse('toggle');
                    $(".parent-panel").collapse('hide');
                }                
            }
        });
        });



        $( ".add_parent_student" ).click(function( event ) {
            event.preventDefault();
            var form_data = $('#student_form').serialize();

            $(".student_errors").hide();
            $(".student_message").hide();

            jQuery.ajax({
            dataType: 'json',
            type: 'POST',
            url: ajaxurl,
            data: {'action':'add_parent_student','data':form_data},
            success: function(response) {
                console.log(response);
                if(response.status === 'failed'){
                    showStudentErrors(response.errors);
                }else{
                    showSuccessMessageStudentInfo(response.message);                    
                    updateStudentList(response.student);
                    window.setTimeout( hide_student_popup, 1000 );                    
                }                
            }
        });
        });



        $( ".students button" ).click(function( event ) {
            console.log('universal student');
            event.preventDefault();
            var student_id = $(this).attr('data-student-id');
            jQuery.ajax({
            dataType: 'json',
            type: 'POST',
            url: ajaxurl,
            data: {'action':'login_universal_student','student_id':student_id},
            success: function(response) {
                console.log(response);
                if(response.status === 'success'){
                    window.location.href = response.login_redirect;
                }                                          
            }
        });
        });
        
        



        function showParentErrors(errors){
            var html;
            $(".parent_errors ul").empty();            
            $.each(errors, function(key, error) {    
                html = '<li>'+error+'</li>';
                $(".parent_errors ul").append(html);
            });
            $(".parent_errors").show();
        }

        function showStudentErrors(errors){
            var html;
            $(".student_errors ul").empty();            
            $.each(errors, function(key, error) {    
                html = '<li>'+error+'</li>';
                $(".student_errors ul").append(html);
            });
            $(".student_errors").show();
        }


        function showSuccessMessageParentInfo(message){
            var html;
            $(".parent_message .message").html(message); 
            $(".parent_message").show();
        }

        function showSuccessMessageStudentInfo(message){
            var html;
            $(".student_message .message").html(message);
            $(".student_message").show();
        }

        function updateStudentList(student){
            $('.student-alert').hide();
            $('.added_students').removeClass('hidden');
            var html = '<div class="students"><button class="btn even" type="button" data-student-id="'+student.id+'">'+student.name+'</button></div>';
            $('.added_students').append(html);
        }

        function hide_student_popup(){
            $('#add_student').modal('toggle');
        }


    });
</script>