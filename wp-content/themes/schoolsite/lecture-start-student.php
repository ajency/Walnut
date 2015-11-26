<?php
/*
  Template Name: Lecture Start Student
 */
?>
<?php
	get_header('student');
?>
<?php
    $lecture_id = $_GET['lecture_id'];
    $module     = fetch_single_student_trainig_module($lecture_id)['data'];
    $textbook    = get_book($module->term_ids['textbook']);
    $chapters    = student_fetch_chapters($module->term_ids['textbook']);
    $chapter     = null;
    foreach ($chapters['data'] as $key => $chap) {
      if($chap->term_id==$module->term_ids['chapter']){
        $chapter = $chap->name;
        break;
      }
    }
    $videos = $module->content_layout;
?>
<div class="container-fluid walnut-content">
    <!-- Page detail -->
    <div class="row text-center">
        <section class="col-sm-12 col-lg-12 quiz-subj">
            <div class="row">
                <div class="col-lg-12">
                    <div class="direction text-center">
                        <div class="icon"><a href="<?php echo site_url() ?>/lecture-listview-student?textbook_id=<?php echo $module->term_ids['textbook'] ?>" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div>
                        <p class="welcome-text">You're here to view the <a href=""><?php echo $module->name ?></a> Lecture</p>
                    </div>
                </div>
            </div>
            <!-- Tutorail details -->
            <div class="row">
                <div class="col-sm-8 col-sm-offset-2 col-lg-8 col-lg-offset-2">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="tutorial">
                                <div class="tutorial-lecture">
                                    <h4>Lecture</h4>
                                    <h4><?php echo $module->name ?></h4>
                                </div>
                                <div class="tutorial-books">
                                    <h4>Text Book</h4>
                                    <h4><?php echo $textbook->name ?></h4>
                                </div>
                                <div class="tutorial-chapter">
                                    <h4>Chapter</h4>
                                    <h4><?php echo $chapter ?></h4>
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
                        <!-- Timeline with youtube link cards -->
                        <div class="col-lg-12">
                            <ul class="time-indicator">
                                <?php foreach($videos as $key => $video): ?>
                                <?php 
                                    $post_excerpt = explode("http",(get_single_content_piece($video['id'])->post_excerpt));
                                    $post_excerpt = "http".$post_excerpt[1];
                                ?>
                                <li>
                                    <div class="time-indicator-min">
                                        <h4><?php echo get_single_content_piece($video['id'])->duration ?><br><span>MIN</span></h4>
                                    </div>
                                    <div class="video-card">
                                        <h3>You can watch this video directly on Youtube @:</h3>
                                        <a href=""><?php echo $post_excerpt; ?></a>
                                    </div>
                                </li>
                                <?php endforeach; ?>
                            </ul>
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
