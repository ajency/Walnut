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
  Template Name: Dashboard
 */
?>
<!DOCTYPE html>
<html>
<head>
    <title>Walnut Learning System</title>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/listnav.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/TimeCircles.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">

    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/datepicker.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bootstrap-timepicker.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/jquery.mmenu.all.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <!-- BEGIN CORE CSS FRAMEWORK -->
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bootstrap-spinedit.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev//css/jquery.resizableColumns.css" rel="stylesheet" media="screen"/>

    <!-- BEGIN BOOK BLOCK -->
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bookBlock/custom.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/bookBlock/bookblock.css" rel="stylesheet" type="text/css">
    <!-- END CORE CSS FRAMEWORK -->

    <!-- BEGIN CSS TEMPLATE -->
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">

    <link href="<?php echo get_template_directory_uri()?>/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript">
    function logout(){
        event.preventDefault();
        $("#logout-modal").modal('hide');
        location.href="<?php echo wp_logout_url(); ?>";
    }
    function close_modal(){
        event.preventDefault();
        $("#logout-modal").modal('hide');
        return false;
    }
    </script>
</head>
<?php 
$current_user = wp_get_current_user();
if( isset($current_user->roles)){
    foreach ($current_user->roles as $key => $value) {
        if($value=='student'){
            require_once('header-student.php');               
            break;
        }
    }
 
}
?>
<body class="">
<div id="site_main_container">
    <div>
        <div id="header-region"></div>
        <div class="page-container row-fluid">
            <div id="left-nav-region"></div>
            <a href="#" class="scrollup">Scroll</a>

            <div class="page-content">
                <div class="content">
                     <?php if(!is_multisite()) :?>
                        <?php if(!school_is_syncd()) : ?>
                    <!-- <p align="center">You may not see any data if you have not synced.</p>  -->
                    <!-- <p align="center">Sync data from the drop down on the top right corner after logging in<p>  -->
                    <iframe style="position:absolute;top:-5000px" src="<?php  site_url() ?>/wp-admin/options-permalink.php"></iframe>    
                        <?php endif; ?>
                    <?php endif;?>
                                          
                    <div id="login-region"></div>
                    <div id="breadcrumb-region"></div>
                    <div id="main-content-region"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="dialog-region">
    </div>
</div>
<?php global $class_ids;
global $chorus_options; 

?>
<script>
    AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
    SITEURL = '<?php echo site_url() ?>';
    THEMEURL = '<?php echo get_template_directory_uri()?>';

    <?php if(is_multisite()){?>
        IS_STANDALONE_SITE = false;
    <?php }
    else { ?>
        IS_STANDALONE_SITE = true;
    <?php }?>

    <?php print_r(getLoggedInUserModel());?>
    MAIN_SITE='<?php echo MAIN_SITE?>';
    CLASS_LABEL = {};
    <?php foreach($class_ids as $class){ ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php } ?>

    CHORUS_OPTIONS = {};
    <?php foreach($chorus_options as $key=>$value){ ?>
    CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
    <?php } ?>

</script>
<script type="text/javascript" src="<?php echo get_template_directory_uri()?>/walnut/dev/js/plugins/pace.js"></script>
 <?php             define("STUDENT_ASSET_PATH", get_template_directory_uri()."/walnut_student_assets/dev/"); ?>

                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/jquery-1.11.3.min.js"></script>
                <!-- Bootstrap Core JavaScript -->
                <!--script src="<?php //echo STUDENT_ASSET_PATH ;?>js/bootstrap.min.js"></script-->
<script>
    Pace.on('hide', function () {
        document.getElementById("site_main_container").setAttribute('class', 'showAll');
    })

    $('#logout').click(function(){
        $('#logout-modal').modal({
        backdrop: 'static',
        keyboard: false
        });
    })    
</script>
<?php

if (ENV == 'dev') {
    ?>
    <script type="text/javascript"
            data-main="<?php echo get_template_directory_uri()?>/walnut/dev/js/school-main.js?ver=<?php echo DEV_VERSION ?>"
            src="<?php echo get_template_directory_uri()?>/walnut/dev/js/plugins/require.js"></script>
<?php
} else {

?>
    <script type="text/javascript"
            src="<?php echo get_template_directory_uri()?>/walnut/production/school-main.js?ver=<?php echo VERSION ?>"></script>
<?php } ?>

                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/script.js"></script>
</body>
</html>