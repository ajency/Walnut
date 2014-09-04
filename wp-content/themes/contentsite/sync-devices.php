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
  Template Name: Sync Devices
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
                                           <img width="192" height="38" src="http://localhost/walnut/wp-content/themes/walnut/images/synapse_logo.png" class="logo" alt="" data-src="http://localhost/walnut/wp-content/themes/walnut/images/synapse_logo.png" data-src-retina="http://localhost/walnut/wp-content/themes/walnut/images/synapse_logo.png">
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
                 //print_r($menu_content);
                 $menu ='';
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
                        <table class="table table-condensed table-fixed-layout table-bordered takeClass tablesorter tablesorter-default" role="grid" aria-describedby="take-class-modules_pager_info">
                           <thead>
                            <tr>
                                <th class="blog-name filter-select" data-placeholder="Select a Blog">Blogname</th> 
                                <th data-placeholder="Device">Device </th> 
                                <th class="filter-false">Last Ping</th>
                            </tr>
                           </thead>
                            <?php 
                            
                            $sync_log_devices = get_sync_log_devices();
                                $resultset = '';
                                if(count($sync_log_devices) > 0){
                                    foreach ($sync_log_devices as $device) {
                                           $blog_details = get_blog_details($device->blog_id);
                                           $last_sync = strtotime($device->last_sync);
                                           $currentdate = date('Y-m-d');
                                           $last_syncdate = date('Y-m-d',$last_sync);

                                           if($currentdate == $last_syncdate){
                                               $days_between = 'Today';
                                           }else{
                                               $days_between = (ceil(abs(strtotime($currentdate) - strtotime(date('Y-m-d',strtotime($last_syncdate)))) / 86400) - 1).' days ago';
                                           }
                                           $resultset .='<tr>';
                                           $resultset .='<td>'.$blog_details->blogname.'</td>';
                                           $resultset .='<td>'.$device->device_type.'</td>';
                                           $resultset .='<td>'.$days_between.'</td>';
                                           $resultset .='</tr>';
                                       }
                                }
                                else{
                                    $resultset .='<tr><td colspan="3">No Results found</td> </tr>';
                                }

                                echo $resultset;  
                            ?>
                        </table>
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
<script type="text/javascript" src="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/jquery.tablesorter.widgets.js"></script>
<script>
    Pace.on('hide', function () {
        document.getElementById("site_main_container").setAttribute('class', 'showAll');
    })
</script>


<script type="text/javascript">  
jQuery(document).ready(function() {
  jQuery(".tablesorter").tablesorter({
       widgets: ["zebra", "filter"],
      
        widgetOptions : {

          // If there are child rows in the table (rows with class name from "cssChildRow" option)
          // and this option is true and a match is found anywhere in the child row, then it will make that row
          // visible; default is false
          filter_childRows : false,

          // if true, a filter will be added to the top of each table column;
          // disabled by using -> headers: { 1: { filter: false } } OR add class="filter-false"
          // if you set this to false, make sure you perform a search using the second method below
          filter_columnFilters : true,

          // extra css class applied to the table row containing the filters & the inputs within that row
          filter_cssFilter : '',

          // class added to filtered rows (rows that are not showing); needed by pager plugin
          filter_filteredRow   : 'filtered',

          // add custom filter elements to the filter row
          // see the filter formatter demos for more specifics
          filter_formatter : null,

          // add custom filter functions using this option
          // see the filter widget custom demo for more specifics on how to use this option
          filter_functions : null,

          // if true, filters are collapsed initially, but can be revealed by hovering over the grey bar immediately
          // below the header row. Additionally, tabbing through the document will open the filter row when an input gets focus
          filter_hideFilters : false,

          // Set this option to false to make the searches case sensitive
          filter_ignoreCase : true,

          // if true, search column content while the user types (with a delay)
          filter_liveSearch : true,

          // jQuery selector string of an element used to reset the filters
          filter_reset : 'button.reset',

          // Use the $.tablesorter.storage utility to save the most recent filters (default setting is false)
          filter_saveFilters : true,

          // Delay in milliseconds before the filter widget starts searching; This option prevents searching for
          // every character while typing and should make searching large tables faster.
          filter_searchDelay : 300,

          // if true, server-side filtering should be performed because client-side filtering will be disabled, but
          // the ui and events will still be used.
          filter_serversideFiltering: false,

          // Set this option to true to use the filter to find text from the start of the column
          // So typing in "a" will find "albert" but not "frank", both have a's; default is false
          filter_startsWith : false,

          // Filter using parsed content for ALL columns
          // be careful on using this on date columns as the date is parsed and stored as time in seconds
          filter_useParsedData : false

        }
  });
  
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
});
</script>
</body>
</html>