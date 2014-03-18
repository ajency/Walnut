<?php
/*
 * File name : custom-setup.php
 * Description : Contains a list of function to run at setup as follows:
 * 1) add_menu_to_blog - Function to create menu for chapter.
 * 2) agc_wmpu_university_table - Function to create table to add universities. 
 * 3) agc_wmpu_defaults_table - Function to create table to add default data.
 * 
 */

require_once( '../../../wp-load.php');
require_once('../../../wp-admin/includes/plugin.php');

/**
 * 
 */

function create_custom_tables(){
    global $wpdb;
   $textbook_class_relations_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}textbook_relationships 
            (`id` INT NOT NULL AUTO_INCREMENT, `textbook_id` INT NOT NULL, 
            `class_id` INT NOT NULL, PRIMARY KEY (`id`))";
   
   $wpdb->query($textbook_class_relations_table);
}
create_custom_tables();
/**
*
* add_new_roles
* Function to add custom roles.
*/
function add_new_roles_main_site()
{
    global $wp_roles;
    if(get_role('subscriber')!=NULL)remove_role( 'subscriber' );//removes the subscriber role
    if(get_role('contributor')!=NULL)remove_role( 'contributor' );//removes the contributor role
    if(get_role('author')!=NULL)remove_role( 'author' );//removes the author role
    if(get_role('editor')!=NULL)remove_role( 'editor' );//removes the editor role

       if(get_role('school-admin')==NULL)
         {
            $role_clone='administrator';
            $role_cloned = $wp_roles->get_role($role_clone);
            $role='school-admin';
            $role_name='School Admin';
            $wp_roles->add_role($role, $role_name, $role_cloned->capabilities);
         }
    add_role( 'content-creator','Content Creator');
    add_role( 'content-approver','Content Approver');
    add_role( 'student','Student');
    add_role( 'parent','Parent');
}
add_new_roles_main_site();

