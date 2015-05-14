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
<!DOCTYPE html>
<html>
<head>
    <title>Synapse</title>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    <link href="./wp-content/themes/walnut/walnut/dev/css/listnav.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/TimeCircles.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">

    <link href="./wp-content/themes/walnut/walnut/dev/css/datepicker.css" rel="stylesheet" type="text/css"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap-timepicker.css" rel="stylesheet" type="text/css"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/jquery.mmenu.all.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <!-- BEGIN CORE CSS FRAMEWORK -->
    <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
    <link href="./wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap-spinedit.css" rel="stylesheet" type="text/css">


    <!-- END CORE CSS FRAMEWORK -->

    <!-- BEGIN CSS TEMPLATE -->
    <link href="./wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
    <link href="./wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">

    <link href="./wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>
</head>
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
                        <p>You may not see any data if you have not synced. If you are a school admin then go to your link <a href="<?php echo admin_url().'options-general.php?page=school_data_sync' ?>">School Data Sync</a> <p> 
                        <?php endif; ?>
                    <?php endif;?>
                            
                      <?php global $current_user;?>       
                      <?php if(!is_multisite() && in_array('teacher', $current_user->roles) && school_is_syncd() && is_user_logged_in()) :?>
                            <a href="<?php echo admin_url().'options-general.php?page=school_data_sync' ?>">Data Sync</a>
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
<script type="text/javascript" src="./wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
<script type="text/javascript"  src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/video.js?ver=<?php echo VERSION?>"></script>
<script type="text/javascript"  src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/youtube.js?ver=<?php echo VERSION?>"></script>
<script>
    Pace.on('hide', function () {
        document.getElementById("site_main_container").setAttribute('class', 'showAll');
    })
</script>
<?php

if (ENV == 'dev') {
    ?>
    <script type="text/javascript"
            data-main="./wp-content/themes/walnut/walnut/dev/js/walnut-main.js?ver=<?php echo DEV_VERSION ?>"
            src="./wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>
<?php
} else {

?>
    <script type="text/javascript"
            src="./wp-content/themes/walnut/walnut/production/walnut-main.js?ver=<?php echo VERSION ?>"></script>
<?php } ?>

</body>
</html>