<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme and one
 * of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query,
 * e.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Walnut
 * @since Walnut 1.0
 */
/*
  Template Name: Site Content Sync
 */
?>

<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
    <title>Synapse</title>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/listnav.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/TimeCircles.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">

    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/datepicker.css" rel="stylesheet" type="text/css"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-timepicker.css" rel="stylesheet" type="text/css"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.mmenu.all.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <!-- BEGIN CORE CSS FRAMEWORK -->
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-spinedit.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/tablesorter.default.css" rel="stylesheet" type="text/css"/>

    <!-- END CORE CSS FRAMEWORK -->

    <!-- BEGIN CSS TEMPLATE -->
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">

    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>

    
</head>
<body class="">
<div id="site_main_container">
    <div>
        <div id="header-region">
            <div class="header navbar navbar-inverse"><div class="header navbar navbar-inverse"> 
                   <!-- BEGIN TOP NAVIGATION BAR -->
                   <div class="navbar-inner">
                           <!-- BEGIN NAVIGATION HEADER -->
                           <div class="header-seperation"> 
                                   <!-- BEGIN MOBILE HEADER -->

                                   <ul class="nav pull-left notifcation-center" id="mobile-menu-toggle-wrapper" style="display:none">	
                                           <li class="dropdown">
                                                   <a id="main-menu-toggle" href="#teachers/dashboard" class="btn btn-small btn-primary"><span class="small-text">Dashboard</span>
                                                   </a>
                                           </li>		 
                                   </ul>


                                   <!-- END MOBILE HEADER -->
                                   <!-- BEGIN LOGO -->	
                                   <a href="#">
                                       <img width="192" height="38" src="<?php echo get_template_directory_uri().'/images/synapse_logo.png'?>" class="logo" alt="" data-src="<?php echo get_template_directory_uri().'/images/synapse_logo.png'?>" data-src-retina="<?php echo get_template_directory_uri().'/images/synapse_logo.png'?>">
                                   </a>
                                   <!-- END LOGO --> 


                                   <!-- END LOGO NAV BUTTONS -->
                           </div>
                           <!-- END NAVIGATION HEADER -->
                           <!-- BEGIN CONTENT HEADER -->
                           <div class="header-quick-nav"> 
                                   <div id="header-left"><div class="pull-left"><!-- BEGIN HEADER LEFT SIDE SECTION -->
                   <!-- BEGIN SLIM NAVIGATION TOGGLE -->
                   <ul class="nav quick-section">
                           <li class="quicklinks">
                                   <a style="cursor:pointer" class="" id="layout-condensed-toggle">
                                           <div class="iconset top-menu-toggle-dark"></div>
                                   </a>
                           </li>
                   </ul>
                   <!-- BEGIN HEADER QUICK LINKS -->
                   <ul class="nav quick-section">

                   </ul>
                   <!-- BEGIN HEADER QUICK LINKS -->

                                   <!-- END HEADER LEFT SIDE SECTION --></div></div>
                                   <div id="header-right"><div class="pull-right"><!-- BEGIN HEADER RIGHT SIDE SECTION -->
                   <!-- BEGIN HEADER NAV BUTTONS -->
                   <ul id="gears-pc" class="nav quick-section2">
                           <!-- BEGIN SETTINGS -->
                           <li class="quicklinks"> 
                                   <a data-toggle="dropdown" class="dropdown-toggle pull-right" href="#" id="user-options">						
                                           <div class="iconset top-settings-dark"></div> 	
                                   </a>
                                   <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="user-options">
                                       <li><a href="<?php echo site_url().'/sync-site-content/' ?>"><span class="fa fa-refresh"></span>&nbsp;&nbsp;Sync</a></li>
                                                <li class="divider"></li>  
                                           <li><a href="javascript://" id="user_logout"><i class="fa fa-power-off"></i>&nbsp;&nbsp;Log Out</a></li>
                                   </ul>
                           </li>
                           <!-- END SETTINGS -->

                   </ul>
                   <!-- END HEADER NAV BUTTONS -->
           <!-- END HEADER RIGHT SIDE SECTION -->

           <ul class="nav pull-right notifcation-center">

               <!-- BEGIN MOBILE CHAT TOGGLER -->
               <li class="dropdown" id="portrait-chat-toggler" style="">
                   <a href="#sidr" class="chat-menu-toggle">
                       <div class="iconset top-chat-white"></div>
                   </a>
               </li>
               <!-- END MOBILE CHAT TOGGLER -->
           </ul></div></div>

                           </div> 
                           <!-- END CONTENT HEADER --> 
                   </div>
                   <!-- END TOP NAVIGATION BAR --> 
           </div></div>           
            
        </div>
        <div class="page-container row-fluid">
            <div id="left-nav-region">
                <div id="main-menu" class="page-sidebar">
                    <div class="slimScrollDiv" style="position: relative; overflow: hidden; width: auto; height: 697.5px;">
                        <div id="main-menu-wrapper" class="page-sidebar-wrapper" style="overflow: hidden; width: auto; height: 697.5px;">

                  <ul class="menu-items">	
                  <?php //print_r(get_menus());
                 $menu_content = get_menus_response();
                 $menu ='';
                 if(!array_key_exists('error', $menu_content)){
                    foreach($menu_content as $content){
                        if ($content['post_title'] === 'Training Module'){
                            $iconclass ='fa fa-pencil-square-o';
                        }
                        if ($content['post_title'] === 'Content Management'){
                            $iconclass ='fa fa-book';
                        }

                      $submenustruct = '<ul class="sub-menu" style="display: none;">';
                      foreach ($content['submenu'] as $submenu){
                        $submenustruct .='<li class=""><a href="'.$submenu['menu_item_link'].'">'.$submenu['post_title'].'</a></li>';  
                      }
                      $submenustruct .='</ul>';

                     $menu .= "<li class=''><a href='javascript:;'> "
                             . "<i class='".$iconclass."'></i> "
                             . "<span class='title'>".$content['post_title']."</span> <"
                             . "span class='arrow'></span> </a>".$submenustruct."</li>";
                    }
                 }
                  
                  echo $menu;
                  ?>
                          <!-- BEGIN ONE LEVEL MENU -->

                          <!-- END ONE LEVEL MENU -->

                  </ul>
                  <!-- END SIDEBAR MENU -->
                  <!-- BEGIN SIDEBAR WIDGETS -->
                  <div class="side-bar-widgets">

                  </div>
                  <div class="clearfix"></div>
                  <!-- END SIDEBAR WIDGETS --> 
                        </div><div class="slimScrollBar ui-draggable" style="background: none repeat scroll 0% 0% rgb(161, 178, 189); width: 4px; position: absolute; top: 0px; opacity: 0.4; display: none; border-radius: 4px; z-index: 99; right: 1px; height: 698px;"></div><div class="slimScrollRail" style="width: 4px; height: 100%; position: absolute; top: 0px; display: none; border-radius: 4px; background: none repeat scroll 0% 0% rgb(51, 51, 51); opacity: 0.2; z-index: 90; right: 1px;"></div>
                            
                    </div>   
                
                </div>

            </div>
            <a href="#" class="scrollup">Scroll</a>

            <div class="page-content">
                <div class="content">
                    <div id="login-region"></div>
                    <div id="breadcrumb-region"></div>
                    <div id="main-content-region">
                        <?php if(is_user_logged_in()):?>
                        <?php 
                                    $blog_id = get_option('blog_id'); 
                                    $sync_user_cookie_name = get_option('sync_user_cookie_name');
                                    $sync_user_cookie_value = get_option('sync_user_cookie_value');
                                    $sync_form_html = get_web_data_sync_html($blog_id); 
                                    //echo $sync_form_html;
                        ?>                    

                        <div class="col-md-12 m-t-25">
                                  <div class="tiles white">
                                          <div class="tiles-body">
                                        <?php if($sync_user_cookie_name && $sync_user_cookie_value) :?>
                                                                                       
                                            <div class="row">

                                              <div class="col-sm-12 b-b b-grey p-b-10 m-b-5">
                                                <!-- <h3 id="userName"class="semi-bold text-center"></h3> -->
                                                <h3 class="semi-bold text-center">Data Sync</h3>

                                                <?php echo $sync_form_html ;?>

                                                </div>

                                              </div>

                                              <div class="row">

                                              <div class="col-sm-12 b-b b-grey p-b-10 m-b-5">
                                                <h3 class="semi-bold text-center">Media Sync</h3>

                                                <div class="row">
                                                  <div class="col-sm-12  m-b-10 m-t-10">
                                                    <div class="">
                                                      <button name="sync-media" id="sync-media" type="button" class="btn btn-success h-align-middle block"><span id="syncMediaButtonText" class="bold">Start</span></button>
                                                      <h5 id="syncSuccess" class="m-t-5 semi-bold text-center text-success status-msg"></h5>
                                                      <h5 id="mediasyncProgress" class="m-t-5 semi-bold text-center text-success status-msg"></h5>
                                                    </div>
                                                  </div>
                                                </div>

                                                </div>

                                              </div>
                                              
                                        <?php if(current_user_can('school-admin') || current_user_can('administrator')) :?> 
                                              <div class="row">

                                              <div class="col-sm-12 b-b b-grey p-b-10 m-b-5">
                                                <!-- <h3 id="userName"class="semi-bold text-center"></h3> -->
                                                <h4 class="semi-bold text-center">Reset Sync Password</h4>
                                                      <input id="validate_blog_id" value="<?php echo $blog_id ?>" type="hidden"> 
                                                      <label class="text-center">Enter Sync Password: </label> 
                                                      <input type="password" id="validate_pwd" value="" class="h-align-middle block"/>  
                                                      <h4>If you have been provided a new sync password by Network Admin, please enter the same in the reset sync box else you can ignore this. For assistance and support contact us at <a href="mailto:support@synapselearning.net">support@synapselearning.net</a></h4>
                                                      <br/>
                                                      <button name="validate-blog-sync-user" id="validate-blog-sync-user" type="button" class="btn btn-success h-align-middle block">
                                                      <span id="syncResetPasswordButtonText" class="bold">Reset</span></button>
                                                      <h5 class="m-t-5 semi-bold text-center text-error status-msg error_msg"></h5>

                                              </div>

                                              </div>    
                                        <?php endif ;?>
                                              
                                        <?php else :?>
                                              <div class="row">

                                              <div class="col-sm-12">
                                                <h3 class="semi-bold text-center">Validate Sync User</h3>

                                                <div class="row">
                                                  <div class="col-sm-12  m-b-10 m-t-10">
                                                    <div class="">
                                                     <form id="validate_sync_school_user"  autocomplete="off">
                                                      <input id="validate_blog_id" value="<?php echo $blog_id ?>" type="hidden">
                                                      <label class="text-center">Enter Sync Password: </label>  
                                                      <input type="password" id="validate_pwd" value="" class="h-align-middle block"/>   
                                                      <h4>This is not the password you use to log in, it is the sync password provided by the Network Admin. If you are unable to use it please contact us at <a href="mailto:support@synapselearning.net">support@synapselearning.net</a> to send you a new sync password</h4>
                                                      <br/>
                                                      <button name="validate-blog-sync-user" id="validate-blog-sync-user" type="button" class="btn btn-success h-align-middle block"><span id="syncValidateButtonText" class="bold">Validate</span></button>
                                                      <h5 class="m-t-5 semi-bold text-center text-error status-msg error_msg"></h5>
                                                      </form>
                                                    </div>
                                                  </div>
                                                </div>

                                                </div>

                                              </div>                                              
                                        <?php endif ;?>     
                                      </div>

                              </div>
                        </div> 
                        
                        <?php endif;?>      
                        
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="dialog-region">
    </div>
</div>
<?php global $class_ids;
global $chorus_options; ?>
<script>
    AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
    SITEURL = '<?php echo site_url() ?>';
    THEMEURL = '<?php echo get_template_directory_uri()?>';

    <?=getLoggedInUserModel()?>

    CLASS_LABEL = {};
    <?php foreach($class_ids as $class){ ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php } ?>

    CHORUS_OPTIONS = {};
    <?php foreach($chorus_options as $key=>$value){ ?>
    CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
    <?php } ?>

</script>
<script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
<script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/jquery.js"></script>
<script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/jquery.tablesorter.js"></script>
<script>
    Pace.on('hide', function () {
        document.getElementById("site_main_container").setAttribute('class', 'showAll');
    })
</script>


<script type="text/javascript">  
jQuery(document).ready(function() {

    jQuery("#validate-blog-sync-user").on('click',function(){
        data ={}
        data['txt_blog_id'] = jQuery.trim(jQuery('#validate_blog_id').val())
        data['txtpassword'] = jQuery('#validate_pwd').val()

        if(data['txtpassword']==''){
          jQuery('.error_msg').html('Invalid password');
          return false
        }


        formData= {}
        formData['data'] = data

        jQuery.ajax({
            type: 'POST',
            url: AJAXURL+'?action=sds-auth-sync-user',
            data: formData,
            success: function(data, textStatus, XMLHttpRequest){
                data = jQuery.parseJSON(data);
              if(! data.status){
                jQuery('.error_msg').html('Invalid password');
              }
              else{
                insert_sync_cookies_in_options_table(data);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){

            }
        });

    });

    function insert_sync_cookies_in_options_table(response_data){

      jQuery.post( AJAXURL,
        {
            action          : 'save_standalone_school_sync_cookies',
            cookie_name     : response_data.logged_in_cookie_key,
            cookie_value    : response_data.logged_in_cookie_value,
        },
        function(data) {           
            if(data.success){
                jQuery('.error_msg').removeClass('text-error');
                jQuery('.error_msg').addClass('text-success');
                jQuery('.error_msg').html('Password validated');
                location.reload();
            }
            else 
              console.log('error saving cookie data in database');
                        
        },'json');

    }
    
    jQuery("#sync-data").on('click',function(){
        var lastsync = jQuery(this).attr('data-lastsync');
        var lastsync_id = jQuery(this).attr('data-lastsync-id');
        var syncstatus = jQuery(this).attr('data-syncstatus');
        var filepath = jQuery(this).attr('data-file-path');
        var blog_id = jQuery(this).attr('data-blog-id');
        var syncreference = jQuery(this);
	//alert(SERVER_AJAXURL);
        if(syncstatus == ''){
            init_school_data_sync(syncreference,lastsync_id,syncstatus,blog_id);
        }
        else{
            resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id,blog_id);
        }
 
    });
    
    function init_school_data_sync(referer,lastsync_id,syncstatus,blog_id,last_sync){
      console.log(referer);
      var login_cookie_name = jQuery('#login_cookie_name').val();
      var login_cookie_value = jQuery('#login_cookie_value').val();      
       jQuery('#sync-media').prop('disabled', true);
       jQuery(referer).next().next().html('This will take a few minutes. Please contact <a href="mailto:support@synapselearning.net">support@synapselearning.net</a> if the problem persists');
       jQuery.ajax({  
                type: 'POST',  
                url: AJAXURL,  
                data: {  
                    action: 'sync-local-database',
                    blog_id: blog_id,
                    last_sync: last_sync,
                    device_type: 'standalone',
                    login_cookie_name: login_cookie_name,
                    login_cookie_value: login_cookie_value
                },  
                success: function(data, textStatus, XMLHttpRequest){  
                    //alert('Success: ' + data);
                    var data = jQuery.parseJSON( data ); 
                    jQuery(referer).next().text('Local Sync started...'); 
                    //jQuery("#test-div1").append(data);  
                    school_data_sync_start(referer,lastsync_id,syncstatus,data)
                },  
                error: function(XMLHttpRequest, textStatus, errorThrown){  
                    console.log(errorThrown);  
                    jQuery('#sync-media').prop('disabled', false);
                    jQuery(referer).prop('disabled', false); 
                    jQuery(referer).next().next().hide();
                }  
	    }); 
    }
    
    function school_data_sync_start(referer,lastsync_id,syncstatus,respdata){
        //console.log(respdata)
        if(respdata.blog_expired){
            /// code logic to delete site content
            jQuery.post( AJAXURL,
            {
                action    : 'sds_delete_blog_content'
            },
            function(data) {           
                       if(data.code === 'OK'){ 
                                   jQuery(referer).next().text('Blog Validity Expired'); 
                                   jQuery(referer).prop('disabled', false);
                                   jQuery('#sync-media').prop('disabled', false);
                                   jQuery(referer).next().next().hide();
                       }       
            },'json');    
        }
        else{
            jQuery.post( AJAXURL,
            {
                action    : 'sds_data_sync_start',
                filepath  : respdata.exported_csv_url,
                last_sync : respdata.last_sync,
                lastsync_id : lastsync_id,
                syncstatus : syncstatus
            },
            function(data) {           
                       if(data.code === 'OK'){ 
                                   jQuery(referer).next().text('File downloaded...');
                                   jQuery(referer).attr('data-syncstatus',data.status);
                                   jQuery(referer).attr('data-lastsync-id',data.sync_request_id);
                                   school_data_sync_import(referer,data.sync_request_id)


                       } else if(data.code === 'ERROR') {
                                   //alert('error');
                                   jQuery(referer).next().text('File download failed'); 
                                   jQuery(referer).prop('disabled', false);
                                   jQuery('#sync-media').prop('disabled', false);
                                   jQuery(referer).next().next().hide();
                       }          
            },'json');            
        }
        
    }
    
     function data_sync_resume_download(referer,lastsync,syncstatus,filepath,lastsync_id){
        referer.next().text('Downloading Data...');
        jQuery.post( AJAXURL,
        {
            action    : 'sds_data_sync_start',
            filepath  : filepath,
            last_sync : lastsync,
            lastsync_id : lastsync_id,
            syncstatus : syncstatus
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('File downloaded...');
                               jQuery(referer).attr('data-syncstatus',data.status);
                               jQuery(referer).attr('data-lastsync-id',data.sync_request_id);
                               school_data_sync_import(referer,data.sync_request_id)
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text('File download failed'); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).next().next().hide();
                   }          
        },'json');
        
    }
    
    function school_data_sync_import(referer,sync_request_id){
        referer.next().text('Importing Data...');
        jQuery.post( AJAXURL,
        {
            action    : 'sds_data_sync_import',
            sync_id   : sync_request_id,
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Sync completed! You now have all the recent updates');
                               jQuery(referer).attr('data-syncstatus','imported');
                               jQuery('#totalRecordsToBeSynced').text('Records to be synced: '+data.to_be_synccount);
                               jQuery('#lastDownloadTimeStamp').text('Last downloaded: '+data.sync_date);
                               jQuery(referer).attr('data-syncstatus','imported');
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).val('Start');
                               jQuery(referer).next().next().hide();
                               //window.location.reload();
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text('Data Import failed'); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).next().next().hide();
                               //window.location.reload();
                   }          
        },'json');
        
    }
    
    function resync_school_data_sync(syncreference,lastsync,syncstatus,filepath,lastsync_id,blog_id){
        jQuery(syncreference).prop('disabled', true);
        jQuery('#sync-media').prop('disabled', true);
        jQuery(syncreference).next().next().html('This will take a few minutes. Please contact <a href="mailto:support@synapselearning.net">support@synapselearning.net</a> if the problem persists');
        jQuery(syncreference).next().next().show();
        if(syncstatus == 'downloaded'){
            school_data_sync_import(syncreference,lastsync_id);
        }
        else if(syncstatus == 'download-start'){
            data_sync_resume_download(syncreference,lastsync,syncstatus,filepath,lastsync_id);
        }
        else if(syncstatus == 'imported'){
            school_data_local_export(syncreference,lastsync,lastsync_id,blog_id);
        }
        else if(syncstatus == 'export-local'){
            school_data_local_upload(syncreference,lastsync_id);
        }
        else if(syncstatus == 'transfered-server'){
            check_server_data_sync(syncreference,lastsync_id,blog_id);
        }
        
        
    }
    
    function school_data_local_export(referer,lastsync,lastsync_id,blog_id){
        referer.next().text('Exporting local data...');
        jQuery.post( AJAXURL,
        {
            action    : 'sds_data_sync_local_export',
            last_sync : lastsync
            
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Local Data exported...');
                               jQuery(referer).attr('data-lastsync-id',data.sync_request_id);
                               jQuery(referer).attr('data-syncstatus',data.status);
                               if(data.status == 'export-not-required'){
                                    //school_data_local_upload(referer,data.sync_request_id,blog_id,lastsync);
                                    init_school_data_sync(referer,data.sync_request_id,data.status,blog_id,lastsync);

                               }
                               else{
                                   school_data_local_upload(referer,data.sync_request_id,blog_id,lastsync);
                               }
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.status); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).next().next().hide();
                   }          
        },'json');
    }
    
    function school_data_local_upload(referer,sync_request_id,blog_id,last_sync){

      var login_cookie_name = jQuery('#login_cookie_name').val();
      var login_cookie_value = jQuery('#login_cookie_value').val();
        jQuery.post( AJAXURL,
        {
            action    : 'sds_data_sync_local_upload',
            sync_request_id : sync_request_id,
            blog_id         : blog_id,
            login_cookie_name : login_cookie_name,
            login_cookie_value : login_cookie_value
        },
        function(data) {           
                   if(data.code === 'OK'){ 
                               jQuery(referer).next().text('Local Data uploaded...').delay(250).text('Waiting For Server Sync..');
                               //school_data_local_upload(referer,data.sync_request_id);
                               jQuery(referer).attr( 'data-server-sync-id', data.sync_request_id );
                               jQuery(referer).attr( 'data-syncstatus', data.status );
                               check_server_data_sync(referer,sync_request_id,blog_id,last_sync);
                               
                  
                   } else if(data.code === 'ERROR') {
                               //alert('error');
                               jQuery(referer).next().text(data.message); 
                               jQuery(referer).prop('disabled', false);
                               jQuery('#sync-media').prop('disabled', false);
                               jQuery(referer).next().next().hide();
                   }          
        },'json');
    }
    
    function check_server_data_sync(referer,sync_request_id,blog_id,last_sync){
        referer.next().html('Checking Server..');
        var syncstatus = referer.attr('data-syncstatus');
        var server_sync_id = referer.attr('data-server-sync-id');
        var login_cookie_name = jQuery('#login_cookie_name').val();
        var login_cookie_value = jQuery('#login_cookie_value').val();
        
        check_server_sync = setInterval(function()
                                {
                                  jQuery.post( AJAXURL,
                                  {
                                    action    : 'check-server-app-data-sync-completion',
                                    blog_id :blog_id,
                                    sync_request_id:server_sync_id,
                                    login_cookie_name : login_cookie_name,
                                    login_cookie_value : login_cookie_value
                                  },
                                    function(data) { 
                                        var data = jQuery.parseJSON( data );
                                        console.log(data);
                                        if(data === true){ 
                                        jQuery(referer).next().text('Server Syncd...').delay(250).text('Initializing download..');
                                        init_school_data_sync(referer,sync_request_id,syncstatus,blog_id,last_sync);
                                        clearInterval(check_server_sync);
                                        }         
                                    },'json');  
                                
                                }, 10000);
    }
    
    
    
    //MEDIA SYNC FUNCTIONS
        jQuery("#sync-media").on('click',function(){

                jQuery(this).prop('disabled', true); 
                jQuery('#sync-data').prop('disabled', true);
                jQuery(this).next().text('Downloading images...');   
                jQuery(this).next().next().html('This will take a few minutes. Please contact <a href="mailto:support@synapselearning.net">support@synapselearning.net</a> if the problem persists');
                jQuery(this).next().next().show();               
                var referer = jQuery(this);
                var login_cookie_name = jQuery('#login_cookie_name').val();
                var login_cookie_value = jQuery('#login_cookie_value').val();
                jQuery.post( AJAXURL,
                {
                    action    : 'sds_media_sync',
                    type : 'images',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       referer.next().text('Image files downloaded...');
                                       //school_data_local_upload(referer,data.sync_request_id);
                                       setTimeout(function() {
                                            sync_media_audios(referer);
                                        }, 2000);
                                       //sync_media_audios(referer);


                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       referer.next().text(data.message); 
                                       referer.prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                                       jQuery(this).next().next().hide();
                           }          
                },'json');
         
        });
        
        function sync_media_audios(referer){
            referer.next().text('Downloading Audio files...');
                var login_cookie_name = jQuery('#login_cookie_name').val();
                var login_cookie_value = jQuery('#login_cookie_value').val();
                jQuery.post( AJAXURL,
                {
                    action    : 'sds_media_sync',
                    type : 'audios',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       jQuery(referer).next().text('Audio files downloaded...');
                                       //school_data_local_upload(referer,data.sync_request_id);
                                       setTimeout(function() {
                                            sync_media_videos(referer);
                                        }, 2000);
                                       //sync_media_videos(referer);


                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       jQuery(referer).next().text(data.message); 
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                                       jQuery(referer).next().next().hide();
                           }          
                },'json');
        }
        
        function sync_media_videos(referer){
            referer.next().text('Downloading Video files...');
                var login_cookie_name = jQuery('#login_cookie_name').val();
                var login_cookie_value = jQuery('#login_cookie_value').val();
                jQuery.post( AJAXURL,
                {
                    action : 'sds_media_sync',
                    type : 'videos',
                    login_cookie_name : login_cookie_name,
                    login_cookie_value : login_cookie_value
                },
                function(data) {           
                           if(data.code === 'OK'){ 
                                       jQuery(referer).next().text('Video files downloaded...').fadeOut(1000,function(){
                                           jQuery(referer).next().text('Media Sync Completed!').fadeIn(1000);
                                       });
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                                       jQuery(referer).next().next().hide();

                           } else if(data.code === 'ERROR') {
                                       //alert('error');
                                       jQuery(referer).next().text(data.message).fadeOut(5000); 
                                       jQuery(referer).prop('disabled', false);
                                       jQuery('#sync-data').prop('disabled', false);
                                       jQuery(referer).next().next().hide();
                           }          
                },'json');
        }    
  
    jQuery(".menu-items li").click(function(){
        jQuery(this).siblings().find(".sub-menu").slideUp(function (){
            jQuery(this).siblings().find(".arrow").removeClass('open');
        });

        if(jQuery(this).siblings().hasClass('open')){
           jQuery(this).siblings().removeClass('open')
        }
        
        if(jQuery(this).hasClass('open')){
           jQuery(this).removeClass('open')
        }else{
          jQuery(this).addClass('open')
        }
        
        jQuery(this).find(".sub-menu").slideToggle();
        jQuery(this).find(".arrow").toggleClass('open');

    }); 
    
     jQuery("#user-options").click(function(e){
         e.preventDefault();
         jQuery(this).parent(".quicklinks").toggleClass('open');
     }); 
    
    //logout user 
     jQuery("#user_logout").click(function(e){
         e.preventDefault();
            jQuery.post( AJAXURL,
                {
                    action    : 'logout_user'
                },
                function(data) {           
                           if(data.success === 'User logged out.'){ 
                             window.location.href = data.redirect_url;
                           }         
                },'json');
     }); 
     
});
</script>
</body>
</html>