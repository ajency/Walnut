<?php
/*
  Template Name: Register Redirect Student Backup
 */
?>
<?php
	get_header('student');
?>

<?php
    $current_user = wp_get_current_user();
    $meta = get_user_meta($current_user->ID);
    if(!isset($meta['parent_name'])){
        $meta['parent_name'][0] = $meta['first_name'][0].' '.$meta['last_name'][0];
        $meta['first_name'][0]="";
        $meta['last_name'][0]="";
    }


?>
<div class="create-ac-card">
    <div class="create-ac-wrapper">
        <div class="container-fluid">
            <div class="row">
                <form id="my_profile" method="POST" action="<?php echo $current_url; ?>">
                    <div class="col-sm-6 col-sm-offset-3 col-lg-6 col-lg-offset-3 wrapped">
                        <h4 class="account-head">My Profile</h4>
                        <hr>
                        <!-- Students info -->
                        <div class="row student-info">
                            <h5>Student Information</h5>
                            <div class="col-sm-6 col-lg-6">
                                <div class="info text-center">
                        <div class="mat-holder">
                            <label for="First Name" class="mat-label"> <span class="mandatory">*</span> First Name</label>
                            <input value="<?php echo isset($meta['first_name'])? $meta['first_name'][0]:"" ?>" name="first_name" type="text" class="mat-input" required>
                        </div>
                        <div class="mat-holder">
                            <label for="date" class="mat-label"> <span class="mandatory">*</span> Date of Birth</label>
                            <input value="<?php echo isset($meta['dob'])? $meta['dob'][0]:"" ?>" name="dob" type="date" class="mat-input" required>
                        </div>                                                                                            
                                </div>      
                            </div>
                            <div class="col-sm-6 col-lg-6">
                                <div class="info text-center">
                        <div class="mat-holder">
                            <label for="Last Name" class="mat-label"> <span class="mandatory">*</span> Last Name</label>
                            <input value="<?php echo isset($meta['last_name'])? $meta['last_name'][0]:"" ?>" name="last_name" type="text" class="mat-input" required>
                        </div>
                        <div class="mat-holder">
                            <label for="text" class="mat-label"> <span class="mandatory">*</span> School Name</label>
                            <input value="<?php echo isset($meta['last_school_attended'])? $meta['last_school_attended'][0]:"" ?>" name="last_school_attended" type="text" class="mat-input" required>
                        </div>                                                       
                                </div>
                            </div>
                        </div>
                        <!-- Parents info -->
                        <div class="row parents-info">
                            <h5>Parents Information</h5>
                            <div class="col-sm-6 col-lg-6">
                                <div class="info text-center">
                        <div class="mat-holder">
                            <label for="Parent Name" class="mat-label"> <span class="mandatory">*</span> Parent Name</label>
                            <input  value="<?php echo isset($meta['parent_name'])? $meta['parent_name'][0]:"" ?>" name="parent_name" type="text" class="mat-input" required>
                        </div>
                        <div class="sel-mandatory">   
                            <select name="relation_with_student" id="" required>
                                            <option value="">Relationship with student</option>
                                            <option <?php echo isset($meta['relation_with_student']) && $meta['relation_with_student'][0]== "father" ? "selected":"" ?> value="father">Father</option>
                                            <option <?php echo isset($meta['relation_with_student']) && $meta['relation_with_student'][0]== "mother" ? "selected":"" ?> value="mother">Mother</option>
                            </select>
                        </div>
                        <div class="mat-holder">
                            <label for="landline" class="mat-label">Landline Number</label>
                            <input value="<?php echo isset($meta['landline_no'])? $meta['landline_no'][0]:"" ?>" name="landline_no" type="text" class="mat-input">
                        </div>


                        <div class="mat-holder">
                            <label for="zipcode" class="mat-label"> <span class="mandatory">*</span> Zipcode</label>
                            <input value="<?php echo isset($meta['zipcode'])? $meta['zipcode'][0]:"" ?>" name="zipcode" type="text" class="mat-input" required>
                        </div>                                        

                                    <select name="state" id="">
                                        <option value="">State</option>
                                        <option <?php echo isset($meta['state']) && $meta['state'][0]== "goa" ? "selected":"" ?> value="goa">Goa</option>
                                        <option <?php echo isset($meta['state']) && $meta['state'][0]== "maharashtra" ? "selected":"" ?> value="maharashtra">Maharashtra</option>
                                        <option <?php echo isset($meta['state']) && $meta['state'][0]== "karnataka" ? "selected":"" ?> value="karnataka">Karnataka</option>
                                     </select>   
                                </div>
                            </div>
                            <div class="col-sm-6 col-lg-6">
                                <div class="info text-center">
                        <div class="mat-holder">
                            <label for="Parent email" class="mat-label"> <span class="mandatory">*</span> Parent Email ID</label>
                            <input type="text" class="mat-input" required>
                        </div>
                        <div class="mat-holder">
                            <label for="Mobile" class="mat-label"> <span class="mandatory">*</span> Mobile Number</label>
                            <input value="<?php echo isset($meta['parent_phone1'])? $meta['parent_phone1'][0]:"" ?>" name="parent_phone1" type="text" class="mat-input" required>
                        </div>

                        <div class="mat-holder">
                            <label for="Address" class="mat-label"> <span class="mandatory">*</span> Address</label>
                            <input value="<?php echo isset($meta['address'])? $meta['address'][0]:"" ?>" name="address" type="text" class="mat-input" required>
                        </div>

 
                                    <select name="student_division" id="" required>
                                        <option value="">Class</option>
                                        <?php foreach (fetch_all_divisions() as $key => $value):?>
                                            <option <?php echo isset($meta['student_division']) && $meta['student_division'][0]== $value->id? "selected":"" ?>  value="<?php echo $value->id ?>"><?php echo $value->division ?></option>
                                        <?php endforeach;?>    
                                     </select> 
                            
                        <div class="mat-holder">
                            <label for="city" class="mat-label"> <span class="mandatory">*</span> City</label>
                            <input value="<?php echo isset($meta['city'])? $meta['city'][0]:"" ?>" name="city" type="text" class="mat-input" required>
                        </div>


                                </div>
                            </div>
                        </div>   
                        <!-- Create Account-->
                        <div class="row create-ac text-center">
                            <div class="col-md-12">
                                <button type="submit" class="btn">
                                    Save
                                </button>
                            </div>
                        </div>          
                    </div>
                    <input type="hidden" name="student_action" value="update-my-profile">
                </form>
            </div>                           
        </div>
    </div>
</div>




<?php
	get_footer('student');
?>