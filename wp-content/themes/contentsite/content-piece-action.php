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
Template Name: content-piece-action
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
                           
                     <div class="content-piece__details">
                         
                        <div class="info correct">
                            <label>Correct Percentage : <b>100</b></label>
                        </div>

                        <div class="info wrong">
                            <label>Wrong Percentage : <b>30</b></label>
                        </div>

                        <div class="info skipped">
                            <label>Skipped Percentage : <b>10</b></label>
                        </div>

                        <div class="info average">
                            <label>Average Time Taken : <b>20min</b></label>
                        </div>

                        <div class="info attempted">
                            <label>Students who attempted that question : <b>15</b></label>
                        </div>

                     </div>   
                    




                   <div id="options-bar-region">

                       <div>

                           <ul class="nav nav-tabs" id="subProps">
                                <li class="active" id="settings-tab"><a class="tabs" href="#settings-tab-pane" aria-controls="Settings" role="tab" data-toggle="tab">Settings</a></li>
                                <li class="" id="more-tab"><a class="tabs" href="#more-tab-pane" aria-controls="Hints" role="tab" data-toggle="tab">Hints and comments</a></li>
                            </ul>


                            <form name="contentpiece-settings">
                                <div class="tab-content ">
                                    <div role="tabpanel" class="tab-pane active" id="settings-tab-pane">

                                        <div class="row m-b-15">
                                            <div class="col-sm-4">
                                                <label class="form-label">Textbook<span class="text-error">*</span></label>
                                                <div class="select2-container form-control select2" id="s2id_subs"><a href="javascript:void(0)" class="select2-choice" tabindex="-1">   <span class="select2-chosen" id="select2-chosen-7">--select textbook--</span><abbr class="select2-search-choice-close"></abbr>   <span class="select2-arrow" role="presentation"><b role="presentation"></b></span></a><label for="s2id_autogen7" class="select2-offscreen"></label><input class="select2-focusser select2-offscreen" type="text" aria-haspopup="true" role="button" aria-labelledby="select2-chosen-7" id="s2id_autogen7"><div class="select2-drop select2-display-none select2-with-searchbox">   <div class="select2-search">       <label for="s2id_autogen7_search" class="select2-offscreen"></label>       <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-owns="select2-results-7" id="s2id_autogen7_search" placeholder="">   </div>   <ul class="select2-results" role="listbox" id="select2-results-7">   </ul></div></div><select required="" name="term_ids[textbook]" id="subs" class="form-control select2 select2-offscreen" tabindex="-1" title="">
                                                    <option value="">--select textbook--</option>
                                                    <option value="1686">122 (Nursery, Junior KG)</option>
                                                    <option value="1649">a1a1a1 (Class 4, Class 5)</option>
                                                    <option value="1684">a2222 (Class 5)</option>
                                                    <option value="1664">a2222222222 (Junior KG, Senior KG)</option>
                                                    <option value="1549">AAAAAAAAAAAAAA (Nursery, Junior KG)</option>
                                                    <option value="1608">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa (Nursery, Junior KG, Senior KG, Class 1, Class 2)</option>
                                                    <option value="1552">AAAAAAAAAAAAAAswqswqsw </option>
                                                    <option value="1550">AAqqqq (Junior KG, Class 1)</option>
                                                    <option value="1540">Abce (Nursery, Junior KG)</option>
                                                    <option value="1694">action jackson (Class 5)</option>
                                                    <option value="1620">adedededqwe (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1628">antelope (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1625">apple (Class 1, Class 2)</option>
                                                    <option value="1635">apple and pine (Class 3, Class 4)</option>
                                                    <option value="1634">apple and pineapple (Nursery, Junior KG)</option>
                                                    <option value="1618">assssssss (Nursery, Junior KG)</option>
                                                    <option value="1639">atom (Nursery, Junior KG)</option>
                                                    <option value="1630">augmented (Class 1, Class 2, Class 3)</option>
                                                    <option value="1633">aunties (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1631">aunty (Nursery, Junior KG)</option>
                                                    <option value="1629">autism (Class 3, Class 4, Class 5)</option>
                                                    <option value="1627">aweee (Nursery, Junior KG)</option>
                                                    <option value="1609">balance (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1632">bane (Class 1, Class 2)</option>
                                                    <option value="1616">bbbbb </option>
                                                    <option value="1617">bbbbbb (Class 1, Class 2)</option>
                                                    <option value="1640">complete textbook (Class 2, Class 3)</option>
                                                    <option value="636">Concepts - KG (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="633">Dance - KG </option>
                                                    <option value="5">Dance class 1 </option>
                                                    <option value="10">Dance class 2 </option>
                                                    <option value="1551">dewdew </option>
                                                    <option value="248">DO NOT USE - Dance Junior Kg </option>
                                                    <option value="267">DO NOT USE - Dance Nursery </option>
                                                    <option value="310">DO NOT USE - Dance Senior Kg </option>
                                                    <option value="246">DO NOT USE - Drawing Junior </option>
                                                    <option value="270">DO NOT USE - Drawing Nursery </option>
                                                    <option value="395">DO NOT USE - Drawing Sr Kg </option>
                                                    <option value="423">DO NOT USE - FMS Nursery </option>
                                                    <option value="233">DO NOT USE - GMS Junior KG </option>
                                                    <option value="280">DO NOT USE - GMS Nursery </option>
                                                    <option value="369">DO NOT USE - GMS Senior Kg </option>
                                                    <option value="15">DO NOT USE - Music Junior KG </option>
                                                    <option value="22">DO NOT USE - Music Nursery </option>
                                                    <option value="30">DO NOT USE - Music Senior KG </option>
                                                    <option value="16">DO NOT USE - My World Junior KG </option>
                                                    <option value="23">DO NOT USE - My World Nursery </option>
                                                    <option value="31">DO NOT USE - My World Senior KG </option>
                                                    <option value="17">DO NOT USE - Numeracy Junior KG </option>
                                                    <option value="24">DO NOT USE - Numeracy Nursery </option>
                                                    <option value="20">DO NOT USE - Story Junior KG </option>
                                                    <option value="27">DO NOT USE - Story Nursery </option>
                                                    <option value="35">DO NOT USE - Story Senior KG </option>
                                                    <option value="37">DO NOT USE - Writing Junior KG </option>
                                                    <option value="28">DO NOT USE - Writing Nursery </option>
                                                    <option value="36">DO NOT USE - Writing Senior KG </option>
                                                    <option value="32">DO NOT USE Numeracy Senior KG </option>
                                                    <option value="18">DO NOT USE Outdoor Junior KG </option>
                                                    <option value="25">DO NOT USE Outdoor Nursery </option>
                                                    <option value="33">DO NOT USE Outdoor Senior KG </option>
                                                    <option value="19">DO NOT USE RLR Junior KG </option>
                                                    <option value="26">DO NOT USE RLR Nursery </option>
                                                    <option value="34">DO NOT USE RLR Senior KG </option>
                                                    <option value="634">Drawing - KG </option>
                                                    <option value="6">E.V.S - 1 (Class 1)</option>
                                                    <option value="38">E.V.S - 2 (Class 2)</option>
                                                    <option value="1615">e32e32 (Class 4)</option>
                                                    <option value="1518">eee </option>
                                                    <option value="1517">eeeee </option>
                                                    <option value="75">English - 1 (Class 1)</option>
                                                    <option value="76">English - 2 (Class 2)</option>
                                                    <option value="574">English - 3 (Class 3)</option>
                                                    <option value="584">English - 4 (Class 4)</option>
                                                    <option value="588">English - 5 (Class 5)</option>
                                                    <option value="638">English - KG (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1681">etdwdfet (Nursery, Junior KG)</option>
                                                    <option value="1448">ewdew ()</option>
                                                    <option value="1450">ewdewd ()</option>
                                                    <option value="1522">ewdewde (Nursery, Junior KG)</option>
                                                    <option value="1665">ewdwed (Nursery, Junior KG)</option>
                                                    <option value="1666">Ezra (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1513">FleurTextbook ()</option>
                                                    <option value="1624">freffrfref (Class 1, Class 2)</option>
                                                    <option value="1667">goin on (Class 1, Class 2)</option>
                                                    <option value="1516">ImageTextbook ()</option>
                                                    <option value="1525">jyujyuju </option>
                                                    <option value="1514">KateTextbook </option>
                                                    <option value="7">Math - 1 (Class 1)</option>
                                                    <option value="11">Math - 2 (Class 2)</option>
                                                    <option value="566">Math - 3 (Class 3)</option>
                                                    <option value="561">Math - 4 (Class 4)</option>
                                                    <option value="556">Math - 5 (Class 5)</option>
                                                    <option value="637">Maths - KG (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="640">Music - KG </option>
                                                    <option value="8">Music class 1 </option>
                                                    <option value="12">Music class 2 </option>
                                                    <option value="635">My World - KG (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1623">odie (Nursery, Junior KG)</option>
                                                    <option value="1512">odricaTextbook ()</option>
                                                    <option value="1636">pine and apple (Nursery, Junior KG)</option>
                                                    <option value="1451">q </option>
                                                    <option value="1500">qqq </option>
                                                    <option value="1690">qqqqqqqq (Nursery)</option>
                                                    <option value="1687">qwwq (Class 3, Class 4)</option>
                                                    <option value="1497">qwww </option>
                                                    <option value="1682">r4r4 (Class 3, Class 4)</option>
                                                    <option value="1619">rerer (Nursery, Junior KG)</option>
                                                    <option value="639">Sanskrit </option>
                                                    <option value="1429">scieaaaaa </option>
                                                    <option value="81">Science - 1 (Class 1)</option>
                                                    <option value="82">Science - 2 (Class 2)</option>
                                                    <option value="543">Science - 3 (Class 3)</option>
                                                    <option value="525">Science - 4 (Class 4)</option>
                                                    <option value="493">Science - 5 (Class 5)</option>
                                                    <option value="1501">silebt </option>
                                                    <option value="1521">tatata ()</option>
                                                    <option value="1680">tdfwtydetf (Nursery, Junior KG)</option>
                                                    <option value="1520">teaaaaa ()</option>
                                                    <option value="1445">test 10 </option>
                                                    <option value="1438">test 5 ()</option>
                                                    <option value="1442">test 7 </option>
                                                    <option value="1443">test 9 ()</option>
                                                    <option value="1431">Test abc </option>
                                                    <option value="1434">test1 ()</option>
                                                    <option value="1435">test2 ()</option>
                                                    <option value="1436">test3 ()</option>
                                                    <option value="1437">test4 ()</option>
                                                    <option value="1439">test6 </option>
                                                    <option value="1440">test7 </option>
                                                    <option value="1441">test8 ()</option>
                                                    <option value="1693">testFunction (Nursery, Junior KG, Senior KG)</option>
                                                    <option value="1638">the (Nursery, Junior KG)</option>
                                                    <option value="1688">weeeee (Nursery, Junior KG)</option>
                                                    <option value="1637">weew (Class 2, Class 3)</option>
                                                    <option value="1689">wwwww (Nursery)</option>
                                                    <option value="1621">zdex (Class 1, Class 2)</option>
                                                    <option value="1622">zdexaa (Nursery, Junior KG)</option>
                                                    <option value="1475">zxeey </option>
                                                    <option value="1469">zxey </option>
                                                    <option value="1470">zxey ()</option>
                                                    <option value="1482">zzzzzaaaaa </option>
                                                    <option value="1491">zzzzzzzzzzzzzzz </option>
                                                </select>
                                            </div>
                                            <div class="col-sm-4">
                                                <label class="form-label">Chapter<span class="text-error">*</span><span class="muted small pull-right"> Select a Subject first</span></label>
                                                <div class="select2-container form-control select2" id="s2id_chaps"><a href="javascript:void(0)" class="select2-choice" tabindex="-1">   <span class="select2-chosen" id="select2-chosen-8">&nbsp;</span><abbr class="select2-search-choice-close"></abbr>   <span class="select2-arrow" role="presentation"><b role="presentation"></b></span></a><label for="s2id_autogen8" class="select2-offscreen"></label><input class="select2-focusser select2-offscreen" type="text" aria-haspopup="true" role="button" aria-labelledby="select2-chosen-8" id="s2id_autogen8"><div class="select2-drop select2-display-none select2-with-searchbox">   <div class="select2-search">       <label for="s2id_autogen8_search" class="select2-offscreen"></label>       <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-owns="select2-results-8" id="s2id_autogen8_search" placeholder="">   </div>   <ul class="select2-results" role="listbox" id="select2-results-8">   </ul></div></div><select required="" name="term_ids[chapter]" id="chaps" class="form-control select2 select2-offscreen" tabindex="-1" title=""></select>
                                            </div>
                                            <div class="col-sm-4">
                                                <label class="form-label">Tags <span class="muted small pull-right"> Enter tags for question</span></label>
                                                <input name="post_tags" type="text" data-role="tagsinput" value="" class="tagsinput" placeholder="Type Answer and press Enter" style="display: none;"><div class="bootstrap-tagsinput"><input size="1" type="text"></div>
                                            </div>
                                        </div>
                                        <div class="row m-b-15">
                                            <div class="col-sm-4">
                                                <label class="form-label">Section <span class="muted small pull-right"> Select a Chapter first</span></label>
                                                <div class="select2-container select2-container-multi form-control select2" id="s2id_secs"><ul class="select2-choices">  <li class="select2-search-field">    <label for="s2id_autogen9" class="select2-offscreen"></label>    <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" id="s2id_autogen9" style="width: 32px;" placeholder="">  </li></ul><div class="select2-drop select2-drop-multi select2-display-none">   <ul class="select2-results">   <li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li></ul></div></div><select name="term_ids[sections]" id="secs" class="form-control select2 select2-offscreen" multiple="" tabindex="-1"></select>
                                            </div>
                                            <div class="col-sm-4">
                                                <label class="form-label">Sub-Sections <span class="muted small pull-right"> Select a Chapter first</span></label>
                                                <div class="select2-container select2-container-multi form-control select2" id="s2id_subsecs"><ul class="select2-choices">  <li class="select2-search-field">    <label for="s2id_autogen10" class="select2-offscreen"></label>    <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" id="s2id_autogen10" style="width: 32px;" placeholder="">  </li></ul><div class="select2-drop select2-drop-multi select2-display-none">   <ul class="select2-results">   <li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li><li class="select2-no-results">No matches found</li></ul></div></div><select name="term_ids[subsections]" id="subsecs" class="form-control select2 select2-offscreen" multiple="" tabindex="-1"></select>
                                            </div>
                                            <div class="col-sm-4">
                                                <label class="form-label">Time<span class="text-error">*</span></label>
                                                <div class="row">
                                                    <!--
                                                    <div class="col-sm-6">
                                                        <input type="text" class="form-control" placeholder="Hours">
                                                    </div>-->
                                                    <div class="col-sm-6">
                                                        <input required="" name="duration" type="text" class="form-control" value="" placeholder="Minutes">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row m-b-15">
                                            
                                            <div class="col-sm-4" id="difficulty_level_column">
                                                <label class="form-label">Difficulty Level<span class="text-error">*</span></label>
                                                <div class="select2-container form-control select2" id="s2id_difficulty_level"><a href="javascript:void(0)" class="select2-choice" tabindex="-1">   <span class="select2-chosen" id="select2-chosen-12">--select Difficulty Level--</span><abbr class="select2-search-choice-close"></abbr>   <span class="select2-arrow" role="presentation"><b role="presentation"></b></span></a><label for="s2id_autogen12" class="select2-offscreen"></label><input class="select2-focusser select2-offscreen" type="text" aria-haspopup="true" role="button" aria-labelledby="select2-chosen-12" id="s2id_autogen12"><div class="select2-drop select2-display-none select2-with-searchbox">   <div class="select2-search">       <label for="s2id_autogen12_search" class="select2-offscreen"></label>       <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-owns="select2-results-12" id="s2id_autogen12_search" placeholder="">   </div>   <ul class="select2-results" role="listbox" id="select2-results-12">   </ul></div></div><select required="" name="difficulty_level" id="difficulty_level" class="form-control select2 select2-offscreen" tabindex="-1" title="">
                                                    <option value="">--select Difficulty Level--</option>
                                                    <option value="1">Level 1</option>
                                                    <option value="2">level 2</option>
                                                    <option value="3">Level 3</option>
                                                </select>
                                            </div>
                                            <div class="col-sm-4">
                                                <label class="form-label">Status</label>
                                                <div class="select2-container form-control select2" id="s2id_status"><a href="javascript:void(0)" class="select2-choice" tabindex="-1">   <span class="select2-chosen" id="select2-chosen-13">Under Review</span><abbr class="select2-search-choice-close"></abbr>   <span class="select2-arrow" role="presentation"><b role="presentation"></b></span></a><label for="s2id_autogen13" class="select2-offscreen"></label><input class="select2-focusser select2-offscreen" type="text" aria-haspopup="true" role="button" aria-labelledby="select2-chosen-13" id="s2id_autogen13"><div class="select2-drop select2-display-none select2-with-searchbox">   <div class="select2-search">       <label for="s2id_autogen13_search" class="select2-offscreen"></label>       <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="select2-input" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-owns="select2-results-13" id="s2id_autogen13_search" placeholder="">   </div>   <ul class="select2-results" role="listbox" id="select2-results-13">   </ul></div></div><select required="" name="post_status" id="status" class="form-control select2 select2-offscreen" tabindex="-1" title="">
                                                    <option value="pending">Under Review</option>
                                                    <option value="publish">Publish</option>
                                                    <option value="archive">Archive</option>
                                                </select>
                                            </div>
                                            <div class="col-sm-2">
                                                <label class="form-label">Author:</label>
                                            </div>

                                            <div class="col-sm-2">
                                                <label class="form-label">Last Modified By:</label>
                                                <span class="lastMod muted"></span>
                                            </div>

                                        </div>
                                        <div class="row">
                                            <div class="col-sm-8">
                                                <label class="form-label">Instructions</label>
                                                <textarea name="instructions" class="instructions form-control autogrow" placeholder="Instructions" style="height: 60px;">                        
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div role="tabpanel" class="tab-pane" id="more-tab-pane">
                                        <div class="row m-b-15">
                                            <div class="col-sm-6">
                                                <div class="checkbox check-info">
                                                    <input type="checkbox" name="hint_enable" id="hint_enable">
                                                    <label class="form-label" for="hint_enable">Enable Hint</label>
                                                </div>
                                                <textarea name="hint" id="question-hint" class="form-control" rows="4" placeholder="Enter Hint" style="display: none" disabled=""></textarea>
                                            </div>
                                            <div class="col-sm-6">
                                                <div class="checkbox check-info">
                                                    <input type="checkbox" name="comment_enable" id="comment_enable">
                                                    <label class="form-label" for="comment_enable">Enable Comment</label>
                                                </div>
                                                <textarea name="comment" id="question-comment" class="form-control" placeholder="Enter Comment" rows="4" style="display: none" disabled=""></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div class="row">
                                <div class="builder_actions pull-right">
                                    <button type="button" class="btn btn-info btn-cons2" id="save-question">
                                        <i class="fa fa-check"></i> Save</button>
                                        
                                    <button type="button" class="btn btn-info btn-cons2 none" id="clone-question">Clone</button>
                                        
                                    <button type="button" id="preview-question" class="btn btn-info btn-cons2 none">
                                        <i class="fa fa-eye"></i> Preview</button>
                                        
                                    <button type="button" id="close-content-creator" class="btn btn-danger btn-cons2">
                                        <i class="fa"></i> Cancel</button>
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

  <script type="text/javascript"  src="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/js/plugins/select2.js?ver=<?php echo VERSION?>"></script>

<script>

    $(function(){
         $(".question-data").tablesorter({
            headers: { 
                // assign the secound column (we start counting zero) 
                8: { 
                    // disable it by setting the property sorter to false 
                    sorter: false 
                }
            } 
         }); 


        // $('.question-filter .enter-ques').on('keyup', function() {
        //     $('.more-filter').slideDown();
        //  });
        // $('.question-filter .enter-ques').blur(function () {
        //     if($('.question-filter .enter-ques').val() == ''){
        //         $('.more-filter').slideUp();
        //     }
        // });


        $(".enter-ques").change(function(){
            if($(this).val() != "0") {
              $('.more-filter').slideDown();
            }
            else {
               $('.more-filter').slideUp();
            }
        });


        $(".js-select").select2();
     });

</script>


</body>
</html>
