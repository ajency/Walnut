<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 26/06/14
 * Time: 5:15 PM
 */

function send_modules_completed_mail($comm_id, $recipients, $blog_id){
    $modules_data = get_data_required_for_modules_completed_mail($comm_id, $blog_id);

    foreach($recipients as $user){

        $userdata= get_userdata($user);

        if(in_array('student',$userdata->roles))
            send_modules_completed_student_mail($comm_id, $userdata, $blog_id, $modules_data);

        elseif(in_array('parent',$userdata->roles))
            send_modules_completed_parent_mail($comm_id, $userdata, $blog_id, $modules_data);
    }
}

function send_modules_completed_parent_mail($comm_id, $parentdata, $blog_id, $modules){

    $blog_name = get_blog_option($blog_id, 'blogname');

    $student_id = get_user_meta($parentdata->ID, 'parent_of', true);

    $student = get_userdata($student_id);

    $division_id = get_user_meta($student_id, 'student_division', true);
    $division_data = fetch_single_division($division_id);
    $division  = $division_data['division'];

    foreach($modules as $module){

        $to = $parentdata->user_email;

        $subject = $blog_name ." Training module completed";

        $text = "{$student->display_name} has successfully completed the following training modules<br><br><br><br>";

        $text .= "Name: {$module['module_name']}<br><br>
                    Class: $division<br><br>
                    Subject: {$module['subject_name']}<br><br>
                    Textbook: {$module['textbook_name']}<br><br>
                    Date completed:  {$module['end_date']}<br><br>
                    Taken by: {$module['taken_by']}<br><br><br><br>
                ";

        $text .= get_communications_footer($blog_id);

        send_mail($subject, $text, $to, $comm_id);
    }


}

function send_modules_completed_student_mail($comm_id, $studentdata, $blog_id, $modules){

    $blog_name = get_blog_option($blog_id, 'blogname');

    foreach($modules as $module){

        $to = $studentdata->user_email;

        $subject = $blog_name ." Training module completed";

        $text = "You have successfully completed the following training modules<br><br><br><br>";

        $text .= "Name: {$module['module_name']}<br><br>
                    Subject: {$module['subject_name']}<br><br>
                    Textbook: {$module['textbook_name']}<br><br>
                    Date completed:  {$module['end_date']}<br><br>
                    Taken by: {$module['taken_by']}<br><br><br><br>";

        $text .= get_communications_footer($blog_id);

        send_mail($subject, $text, $to, $comm_id);
    }


}


/**
 * @param $comm_id
 * @param $blog_id
 * @return array having
 * blog_name, modules_array having module_name, subject_name, textbook_name, end_date, taken_by,
 *
 */
function get_data_required_for_modules_completed_mail($comm_id, $blog_id){

    $modules = array();

    $module_ids =get_communications_meta($comm_id, 'module_ids');

    foreach($module_ids as $module_id){

        $module_data = array();

        $module_data['id']  = $module_id;

        $module_data['module_name'] = get_module_name($module_id);

        $module_data['end_date'] = get_module_end_date($module_id, $blog_id);

        $textbook_id = get_module_textbook($module_id);

        $module_data['textbook_name'] = get_term_field('name', $textbook_id, 'textbook');

        $module_data['taken_by'] = get_module_taken_by($module_id, $blog_id);

        $module_data['subject_name'] = get_textbook_subject($textbook_id);

        $modules[]= $module_data;
    }

    return $modules;

}