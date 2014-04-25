define ['app'],(App)->

	App.module "TeachersDashboardApp.View.StudentsList",(StudentsList, App)->		

		class StudentsList.List extends Marionette.ItemView

			className: 'studentList m-t-35'
				
			template : '<div class="m-b-15 semi-bold pull-left row">
							<div class="col-md-6">
								<label class="form-label bold">Class</label>
								<select id="class" class="form-control select2" >
						            <option value="1">1</option>
						            <option value="2">2</option>
						            <option value="3">3</option>
						        </select>
						    </div>
						    <div class="col-md-6">
						        <label class="form-label bold">Div</label>
								<select id="div" class="form-control select2" >
						            <option value="A">A</option>
						            <option value="B">B</option>
						            <option value="C">C</option>
						        </select>
						    </div>
					    </div>

						<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10"><button type="button" class="btn btn-primary btn-xs btn-sm"><i class="fa fa-check"></i> Done </button></div>

						<div class="m-t-10 well pull-right m-b-10 p-t-10 p-b-10 m-r-20"><button type="button" class="btn btn-primary btn-xs btn-sm m-r-10"><i class="fa fa-check-circle"></i> Right Answer</button> <button type="button" class="btn btn-danger btn-xs btn-sm"><i class="fa fa-times-circle"></i> Wrong Answer</button></div>

						<div class="clearfix"></div>
						<div class="row students m-t-20">
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-15 p-l-5 p-r-5"><span class="semi-bold">Richmond</span> Watkins</h4>
					                    <h5 class="muted text-center no-margin p-t-5 p-b-10">1536</h5>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles red active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-times-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Clint</span> Watkins</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles green active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-check-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Mark</span> Roberts</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles default active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Jim</span> Smith</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles default active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">John</span> Doe</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles green active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-check-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Robert</span> Clark</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles default active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-minus-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Mathew</span> Ross</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles red active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-times-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
							<div class="col-sm-3 m-b-20">
								<div class="row single tiles white no-margin">    
					                <div class="col-md-8 col-xs-8 no-padding">
					                  <div class="text-center">
					                    <h4 class="text-primary no-margin p-t-20 p-b-20 p-l-5 p-r-5"><span class="semi-bold">Emily</span>  Rose</h4>
					                    <div class="clearfix"></div>
					                  </div>
					                </div>
									 <div class="col-md-4 col-xs-4 no-padding">
					                  <div class="tiles green active">
					                  	<div class="user-profile-pic text-left m-t-0 p-t-10"> 
										<img data-src-retina="assets/img/profiles/avatar2x.jpg" data-src="assets/img/profiles/avatar.jpg" src="assets/img/profiles/avatar.jpg" alt="">
									  </div>
					                    <div class="bold text-white text-center p-t-5 p-b-5"><i class="fa fa-check-circle"></i></div>
					                  </div>
					                </div>
					            </div>
							</div>
						</div>'

	