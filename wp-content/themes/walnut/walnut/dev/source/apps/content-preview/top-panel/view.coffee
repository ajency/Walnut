define ['app'],(App)->

	App.module "ContentPreview.TopPanel.Views",(Views,App,Backbone,Marionette,$,_)->

		class Views.TopPanelView extends Marionette.ItemView



			template : '<div class="pieceWrapper">
							<div class="tiles white grid simple vertical blue m-b-0">
								<div class="grid-body no-border">
									<div class="p-t-10">
									  <div class="row m-b-10">
							            <div class="col-md-4 col-sm-4 b-grey b-r">
							              <label class="form-label bold small-text">Class</label>
											4
							            </div>
							            <div class="col-md-4 col-sm-4 b-grey b-r">
							              <label class="form-label bold small-text">Subject</label>
											Science			                  
							            </div>
							            <div class="col-md-4 col-sm-4">
							              <label class="form-label bold small-text">Chapter</label>
											Internal Organs of the Body
							            </div>
							          </div>
							          <div class="row">
							            <div class="col-md-4 col-sm-4 b-grey b-r">
							              <label class="form-label bold small-text">Section</label>
											Internal &amp; External
							            </div>
							            <div class="col-md-4 col-sm-4 b-grey b-r">
							              <label class="form-label bold small-text">Sub-Section</label>
											-			                  
							            </div>
							            <div class="col-md-4 col-sm-4">
							              <label class="form-label bold small-text">Type</label>
											Difficult
							            </div>
							          </div>
							      </div>
							    </div>
							</div>
							<div class="tiles blue p-l-15 p-r-15">
								<div class="tiles-body no-border">
									<div class="row">
						                <div class="col-md-4 col-sm-4">
						                	<h4 class="text-white m-t-0 m-b-0 semi-bold time"> <i class="fa fa-clock-o"></i> 3m15s</h4>
						                </div>
						                <div class="col-md-4 col-sm-4 text-center">
						                  <h4 class="text-white m-t-0 m-b-0  time"> Marks: <span id="total-marks" class="semi-bold">0</span></h4>
						                </div>
						                <div class="col-md-4 col-sm-4 text-right">
						                  <a href="#" class="hashtags transparent"> <i class="fa fa-lightbulb-o"></i> Hint </a>
						                </div>
						            </div>
							    </div>
							</div>
						</div>
						'

		

			onShowTotalMarks:(totalMarks)->
				@$el.find('span#total-marks').text totalMarks