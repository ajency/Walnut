<?php
/*
  Template Name: Dashboard Lecture Listview Student
 */
?>
<?php
	get_header('student');
?>
<?php
$textbook_id = $_GET['textbook_id'];
$textbook    = get_book($textbook_id);
$chapters    = student_fetch_chapters($textbook_id);
$lectures    = student_fetch_lectures_by_textbook_id($textbook_id);
$chapter_id_to_name_map = array();
foreach ($chapters['data'] as $key => $value) {
    $chapter_id_to_name_map[$value->term_id] = $value->name;
}
?>
<div class="container-fluid walnut-content">
    <!-- Welcome text -->
    <div class="row text-center">
        <section class="col-sm-9 col-md-9 col-lg-9 quiz-subj lecture-data">
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div class="direction text-center">
                        <div class="icon"><a href="/dashboard-student" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div>
                        <p class="welcome-text">You're on <a href="javascript:"><?php echo $textbook->name ?></a> Lectures</p>
                    </div>
                </div>
            </div>
            <!-- All Lectures -->
            <h4 class="text-danger" id="danger" style="display:<?php echo count($lectures)>0?'none':'block'; ?>">There is no lesson for this filter, select other filter for lesson listings.</h4>
            <div class="row">
                <?php foreach($lectures as $key => $lecture): ?>
                <div class="col-sm-6 col-md-6 col-lg-6 chapter_tiles <?php echo "chapter_".$lecture['chapter_id'] ?>">
                    <div class="l-q-cards animated bounceIn">
                        <div class="l-q-cards__title lecture--card">
                            <div class="lecture">
                                <span>Lecture :</span>
                                <span><?php echo $lecture['lecture_name'] ?></span>
                            </div>
                            <div class="chapter">
                                <span>Chapter :</span>
                                <span><?php echo $chapter_id_to_name_map[$lecture['chapter_id']] ?></span>
                            </div>
                            <div class="view">
                                <a href="/#students/training-module/<?php echo $lecture['lecture_id'] ?>"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/view.png" class="img-responsive center-block">
                                </a>
                            </div>
                        </div>
                        <div class="l-q-cards__details">
                            <div class="timing">
                                <span><i class="fa fa-clock-o"></i></span>
                                <span class="total-time"><?php echo $lecture['duration'] ?> MINS</span>
                            </div>
                        </div>
                    </div>
                </div>  
                <?php endforeach; ?>              
            </div>
        </section>
        <!-- Filters for chapters -->
        <aside class="col-sm-3 col-md-3 col-lg-3 sidebar spacing">
            <div class="panel-group sidebar-panel" id="accordion" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                        <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        All Chapters
                        <span class="drop-icon pull-right">
                        <i class="fa fa-angle-right fa-lg is-open"></i>
                        </span>
                        </a>
                        </h4>
                    </div>
                    <div id="collapseOne" class="panel-collapse collapse in tick" role="tabpanel" aria-labelledby="headingOne">
                    	<?php foreach ($chapters['data'] as $key => $chapter):?>
                        <div class="panel-body chapters" id="<?php echo "chapter_".$chapter->term_id ?>">
                            <div class="chapter-names">
                                <?php echo $chapter->name ?>                                
                            </div>
                            <div class="checked">
                                <i class="fa fa-check"></i>
                            </div>
                        </div>
                    	<?php endforeach; ?>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</div>
<?php
	get_footer('student');
?>
<script type="text/javascript">
$(document).ready(function(){
   $(".chapters").click(function(){
        var show_class = this.id;
        var is_checked = ($("#"+show_class +" div").hasClass('is-checked'));
        if(is_checked){
            $(".chapter_tiles").hide();
            $("."+show_class).show();            
        }else{
            $(".chapter_tiles").show();
        }
        var no_items = true;
        $( ".chapter_tiles" ).each(function( index ) {
            if( $(this).css("display")!='none' ){
                no_items = false;
            }
        });
        $("#danger").hide();
        if(no_items==true){
            $("#danger").show();
        }
        $("html, body").animate({ scrollTop: 0 }, "slow");
   });
});    
</script>
