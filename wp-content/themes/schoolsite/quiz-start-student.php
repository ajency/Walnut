<?php
/*
  Template Name: Quiz Start Student
 */
?>
<?php
	get_header('student');
?>

<?php
	$quiz_id = $_GET['quiz_id'];
    $quiz    = student_fetch_single_quiz($quiz_id)['data'];
    $chapter     = null;
    $textbook    = get_book($quiz->term_ids['textbook']);
    $chapters    = student_fetch_chapters($quiz->term_ids['textbook']);
    if(isset($_GET['home'])){
        $back="dashboard-student";
    }else{
        $back = "quiz-listview-student?textbook_id=".$quiz->term_ids['textbook'];
    }
    foreach ($chapters['data'] as $key => $chap) {
      if($chap->term_id==$quiz->term_ids['chapter']){
        $chapter = $chap->name;
        break;
      }
    }
?>
<div class="container-fluid walnut-content">
    <div class="row text-center">
        <section class="col-sm-12 col-lg-12 quiz-subj">
            <div class="row">
                <div class="col-lg-12">
                    <div class="direction text-center">
                        <div class="icon"><a href="<?php echo site_url() ?>/<?php echo $back ?>" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div>
                        <p class="welcome-text">Time to take a quiz</p>
                    </div>
                </div>
            </div>
            <!-- Quiz Summary -->
            <div class="row">
                <div class="col-sm-8 col-sm-offset-2 col-lg-8 col-lg-offset-2">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="practice-grids">
                                <div class="practice-grid-1">
                                    <div class="">
                                        <h4>Text Book</h4>
                                        <h4><?php echo $textbook->name ?></h4>
                                    </div>
                                    <div class="">
                                        <h4>Chapter</h4>
                                        <h4><?php echo $chapter ?></h4>
                                    </div>
                                </div>
                                <div class="practice-grid-2">
                                    <div class="">
                                        <h4>No of Questions</h4>
                                        <h4><?php echo count($quiz->content_pieces) ?> </h4>
                                    </div>
                                    <div class="">
                                        <h4>Duration</h4>
                                        <h4><?php echo $quiz->duration ?> MINS</h4>
                                    </div>
                                    <div class="">
                                        <h4>Marks</h4>
                                        <h4><?php echo $quiz->marks ?></h4>
                                    </div>
                                    <div class="">
                                        <h4>Type</h4>
                                        <h4><?php echo $quiz->quiz_type ?></h4>
                                    </div>
                                </div>
                                <div class="practice-grid-3">
                                    <div class="">
                                        <h4>Quiz Instructions</h4>
                                        <h4><?php echo $quiz->description['instruction'] ?></h4>
                                    </div>
                                </div>
                                <div class="start-btn">
                                    <button class="btn" type="submit">
                                    <span><i class="fa fa-file-image-o"></i></span>
                                    <span>Start</span>
                                    <span><i class="fa fa-angle-right"></i></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <!-- All the Best section -->
                        <div class="col-lg-12">
                            <div class="all-d-best">
                                <i class="fa fa-thumbs-o-up fa-2x"></i> <span>All the Best ...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
<?php
    get_footer('student');
?>                
<script type="text/javascript">
$(document).ready(function(){

});    
</script>
