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
	<title>Walnut Learn</title>
	<meta http-equiv="content-type" content="text/html;charset=UTF-8" />
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta content="" name="description" />
	<meta content="" name="author" />

	<!-- NEED TO WORK ON -->

	<!-- BEGIN CORE CSS FRAMEWORK -->
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
	<!-- END CORE CSS FRAMEWORK -->

	<!-- BEGIN CSS TEMPLATE -->
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">
	<link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css">
	<!-- END CSS TEMPLATE -->




</head>
<body class="">


<div>
	<div id="header-region"></div>
	<div id="left-nav-region"></div>
	<div id="main-content-region" class="page-content" data-height="1006">

	</div>
</div>
<div id="dialog-region"></div>
<div id="login-region">
	
</div>
</div>
<script type="text/javascript">
var THEMEURL = 'http://localhost/impruw/testsite93/wp-content/themes/impruwclientparent';
var SITEURL = '<?php echo site_url();?>'
AJAXURL= '<?php echo admin_url('admin-ajax.php') ?>';
var UPLOADURL = '<?php echo admin_url('async-upload.php') ?>';
var _WPNONCE = '8182442cce';

</script>
<?php if(ENV!=='dev') { ?>
<script type="text/javascript" data-main="./wp-content/themes/walnut/walnut/dev/js/content-creator-main" src="./wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>
<?php
} else { ?>
<script type="text/javascript"  src="./wp-content/themes/walnut/walnut/production/content-creator-main.js"></script>
<? } ?>


</body>
</html>