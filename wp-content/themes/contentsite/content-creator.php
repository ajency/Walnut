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
Template Name: Content Creator
*/
?>

<!DOCTYPE html>
<html>
<head>
	<title>Synapse</title>
	<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta content="" name="description" />
	<meta content="" name="author" />

	<!-- NEED TO WORK ON -->

	<!-- BEGIN CORE CSS FRAMEWORK -->
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css" media="screen"/>
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery-ui.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/slider.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css" media="screen"/>
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-tagsinput.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/mashmenu.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.minicolors.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev//css/jquery.resizableColumns.css" rel="stylesheet" media="screen"/>

    <!-- END CORE CSS FRAMEWORK -->

    <!--wordpress image edit css -->
    <link href="<?=get_site_url()?>/wp-includes/css/dashicons.min.css" rel="stylesheet" media="screen">
    <link href="<?=get_site_url()?>/wp-includes/js/imgareaselect/imgareaselect.css" rel="stylesheet"
          media="screen">
    <link href="<?=get_site_url()?>/wp-admin/css/media-rtl.css" rel="stylesheet" media="screen">
    <link href="<?=get_site_url()?>/wp-admin/css/media.css" rel="stylesheet" media="screen">

	<!-- BEGIN CSS TEMPLATE -->
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css">
	<!-- END CSS TEMPLATE -->


</head>
<body class="">


<div id="site_main_container">
    <div>
        <div id="header-region"></div>
        <div class="page-container row-fluid">
                <div id="left-nav-region"></div>
                <a href="#" class="scrollup">Scroll</a>
                <div class="page-content condensed">
                    <div class="content">
                    <?php if(!is_multisite()) :?>
                        <?php if(!school_is_syncd()) : ?>
                        <p>You may not see any data if you have not synced. If you are a school admin then go to your link <a href="<?php echo admin_url().'options-general.php?page=school_data_sync' ?>">School Data Sync</a> <p> 
                        <?php endif; ?>
                    <?php endif;?>  
                            
                        <div id="login-region"></div>
                        <div id="breadcrumb-region"></div>
                        <div id="main-content-region" data-height="1006"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="dialog-region" class="modal"></div>
    <div id="settings-region"></div>
</div>
<script type="text/javascript">

var SITEURL = '<?php echo site_url();?>'
THEMEURL = '<?php echo get_template_directory_uri()?>';
AJAXURL=ajaxurl = '<?php echo admin_url('admin-ajax.php') ?>';
var UPLOADURL = '<?php echo admin_url('async-upload.php') ?>';
var _WPNONCE    = '<?php echo wp_create_nonce('media-form');?>';
<?php global $chorus_options; ?>
CHORUS_OPTIONS= {};
<?php foreach($chorus_options as $key=>$value){ ?>
CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
<?php } ?>

</script>

<script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
<script>
     Pace.on( 'hide', function(){
         document.getElementById("site_main_container").setAttribute('class','showAll');
     })
</script>
 <script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/ckeditor/ckeditor.js"></script> 
<?php if(ENV=='dev') { ?>
<script type="text/javascript" data-main="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/content-creator-main.js?ver=<?php echo DEV_VERSION?>" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>
<?php } else { ?>

 <script type="text/javascript"  src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/production/content-creator-main.js?ver=<?php echo VERSION?>"></script>
<?php } ?>


</body>
</html>
