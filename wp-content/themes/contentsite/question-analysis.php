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
Template Name: question analysis
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
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css" media="screen"/>
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery-ui.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/slider.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css" media="screen"/>
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-tagsinput.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/mashmenu.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.minicolors.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev//css/jquery.resizableColumns.css" rel="stylesheet" media="screen"/>

    <!-- END CORE CSS FRAMEWORK -->

    <!--wordpress image edit css -->
    <link href="<?php get_site_url()?>/wp-includes/css/dashicons.min.css" rel="stylesheet" media="screen">
    <link href="<?php get_site_url()?>/wp-includes/js/imgareaselect/imgareaselect.css" rel="stylesheet"
          media="screen">
    <link href="<?php get_site_url()?>/wp-admin/css/media-rtl.css" rel="stylesheet" media="screen">
    <link href="<?php get_site_url()?>/wp-admin/css/media.css" rel="stylesheet" media="screen">

	<!-- BEGIN CSS TEMPLATE -->
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">
	<link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/admin.css" rel="stylesheet" type="text/css">
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
                           <div class="main-content-region question-analysis">
                                <div class="tiles white grid simple vertical green">
                                    
                                    <div class="grid-title no-border">
                                        <h4 class="">Question Analysis</h4> 
                                        <div class="tools"> 
                                            <a href="javascript:;" class="collapse"></a> 
                                        </div> 
                                    </div>  

                                    <div class="grid-body no-border contentSelect">
                                        <div id="filters-region" class="m-b-10">
                                            <div class="row">
                                                <div class="col-sm-12">
                                                    <div class="filters new-filter question-filter">

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Class">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Textbook">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Chapter">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Section">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Subsection">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Question Ans">
                                                        </div>

                                                    </div>
                                                    <div class="filters new-filter question-filter more-filter">

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Class">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Textbook">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Chapter">
                                                        </div>

                                                        <div class="">
                                                            <input class="" type="text" placeholder="Section">
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <table class="table table-bordered m-t-10 question-data tablesorter" id="content-pieces-table">
                                                    <thead>
                                                        <tr>
                                                            <th style="width:4%"><div id="check_all_div" class="checkbox check-default" style="margin-right:auto;margin-left:auto;">
                                                                <input id="check_all" type="checkbox">
                                                                <label for="check_all"></label>
                                                            </div>
                                                            <th>Section</th>
                                                            <th>Excerpt</th>
                                                            <th>Times Asked</th>
                                                            <th>Correct %</th>
                                                            <th>Wrong %</th>
                                                            <th>Skipped %</th>
                                                            <th>Avg time to answer</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody id="list-content-pieces" aria-relevant="all" aria-live="polite" role="alert" data-link="row" class="rowlink">

                                                        <td class="v-align-middle"><div class="checkbox check-default">
                                                            <input class="tab_checkbox" type="checkbox" value="{{id}}" id="checkbox{{id}}">
                                                            <label for="checkbox{{id}}"></label>
                                                          </div>
                                                        </td>
                                                        <td>Test</td>
                                                        <td>Afsdf sdf</td>
                                                        <td>Esdfsaf sdfa</td>
                                                        <td>Esadf asdfsd</td>
                                                        <td>Wsdf asdf as</td>
                                                        <td>Qdfgdsfg dsfdfg</td>
                                                        <td>tewrdszfsd</td>
                                                        <td>tewrdszfsd</td>
                                                    </tbody>
                                                </table>
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
    <div id="dialog-region" class="modal"></div>
    <div id="settings-region"></div>
</div>


<!-- <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script> -->


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

<script type="text/javascript" src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
<script>
     Pace.on( 'hide', function(){
         document.getElementById("site_main_container").setAttribute('class','showAll');
     })
</script>
 <script type="text/javascript" src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/ckeditor/ckeditor.js?ver=2.0"></script> 
<?php if(ENV=='dev') { ?>
<script type="text/javascript" data-main="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/content-creator-main.js?ver=<?php echo DEV_VERSION?>" src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>

<?php } else { ?>

 <script type="text/javascript"  src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/production/content-creator-main.js?ver=<?php echo VERSION?>"></script>
<?php } ?>


 <script type="text/javascript"  src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/jquery.js?ver=<?php echo VERSION?>"></script>

 <script type="text/javascript"  src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/jquery.tablesorter.js?ver=<?php echo VERSION?>"></script>

<script>

    $(function(){
         $(".question-data").tablesorter(); 
     });

</script>


</body>
</html>
