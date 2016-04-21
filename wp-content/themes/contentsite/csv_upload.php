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
  Template Name: Csv Upload
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
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/listnav.css" rel="stylesheet" type="text/css">
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/TimeCircles.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">


    <!-- NEED TO WORK ON -->
    <?php
    $ver = date( 'YmdHis' );
    if (ENV == 'dev') {
        ?>

        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/datepicker.css" rel="stylesheet" type="text/css"/>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/datetimepicker.css" rel="stylesheet" type="text/css"/>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-timepicker.css" rel="stylesheet"
              type="text/css"/>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css"
              media="screen"/>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css"
              media="screen"/>
        <!-- BEGIN CORE CSS FRAMEWORK -->
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">


        <!-- END CORE CSS FRAMEWORK -->

        <!-- BEGIN CSS TEMPLATE -->
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">


        <!-- END CSS TEMPLATE -->

    <?php
    } else {
        ?>
        <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/production/css/walnut.min.css?ver=<?php echo $ver ?>"
              rel="stylesheet" type="text/css"/>
    <?php } ?>

    <link href="<?=get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>
    <script type="text/javascript"
            src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js?1401271188580"></script>
</head>
<body>

<?php

$themeUrl = get_template_directory();


$divisionCsvUrl = $themeUrl . '/csvupload/division.csv';
$studentCsvUrl = $themeUrl . '/csvupload/student.csv';
$teacherCsvUrl = $themeUrl . '/csvupload/teacher.csv';
$teacherTextbookCsvUrl = $themeUrl . '/csvupload/teacher_textbooks.csv';
$textbookCsvUrl = $themeUrl . '/csvupload/textbook.csv';
//echo $divisionCsvUrl;
$divisionCsvJson = parseCSV( $divisionCsvUrl );
$studentCsvJson = parseCSV( $studentCsvUrl );
$teacherCsvJson = parseCSV( $teacherCsvUrl );
$teacherTextbookCsvJson = parseCSV( $teacherTextbookCsvUrl );
//$textbookCsvJson = parseCSV($textbookCsvUrl);

getDivisionCsvContent( $divisionCsvJson );
getStudentCsvContent( $studentCsvJson );
getTeacherCsvContent( $teacherCsvJson );
getTeacherTextbookCsvContent( $teacherTextbookCsvJson );
//getTextbookCsvContent($textbookCsvJson);

?>

</body>
</html>