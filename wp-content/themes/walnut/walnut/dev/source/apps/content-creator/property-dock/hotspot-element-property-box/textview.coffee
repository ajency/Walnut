define ['app'],(App)->

	App.module "ContentCreator.PropertyDock.HotspotElementPropertyBox.Views",
		(Views, App, Backbone, Marionette, $, _)->

			class Views.TextView extends Marionette.ItemView

				template : '<div class="tile-more-content no-padding">
							  
							  <div class="tiles green">
							    
							    <div class="tile-footer drag">
							      Hotspot 
							      <i class="fa fa-chevron-right">
							      </i>
							      
							      <span class="semi-bold">
							        Text Element
							      </span>
							      
							    </div>
							    
							    <div class="docket-body">
							      
							      <div class="form-group">
							        
							        <textarea id="hotspot-textelement-text" class="textarea" placeholder="Enter Text here" >
							          {{text}}
							        </textarea>
							        
							      </div>
							      
							      <div class="form-group">
							        
							        <select class="font" id="hotspot-textelement-fontfamily">
							          
							          <option value="Arial">
							            Arial
							          </option>
							          
							          <option value="Calibri">
							            Calibri
							          </option>
							          
							          <option value="Comic Sans MS">
							            Comic Sans MS
							          </option>
							          
							          <option value="Courier">
							            Courier
							          </option>
							          
							          <option value="Georgia">
							            Georgia
							          </option>
							          
							          <option value="Helvetica">
							            Helvetica
							          </option>
							          
							          <option value="Impact">
							            Impact
							          </option>
							          
							          <option value="Lucida Console">
							            Lucida Console
							          </option>
							          
							          <option value="Lucida Sans Unicode">
							            Lucida Sans Unicode
							          </option>
							          
							          <option value="Tahoma">
							            Tahoma
							          </option>
							          
							          <option value="Times New Roman">
							            Times New Roman
							          </option>
							          
							          <option value="Trebuchet MS">
							            Trebuchet MS
							          </option>
							          
							          <option value="Verdana">
							            Verdana
							          </option>
							          
							        </select>
							        <div class="textFormat" data-toggle="buttons-checkbox">
							        
							        <div id="font-style" class="btn-group">
							          
							          <button id="bold-btn" class="btn">
							            <i class="fa fa-bold">
							            </i>
							          </button>
							          
							          <button id="italic-btn" class="btn">
							            <i class="fa fa-italic">
							            </i>
							          </button>
							          
							        </div>
							        
							      </div>
							        
							      </div>
							      
							      <div class="">
							        
							        <div class="textProp slider success">
							          Size 
							          <input type="text" id="hotspot-textelement-fontsize" class="fontSize" data-slider-max="80" data-slider-step="1" data-slider-value="{{fontSize}}" data-slider-orientation="horizontal" data-slider-selection="before">
							          
							        </div>
							        
							      </div>
							           
							      <div class="form-group inline">
							        Color  
							        <input type="hidden" id="hidden-input" class="fontColor" value="#1a45a1">
							        
							      </div>
							      
							      <div class="form-group inline rotateCtrl">
							        Rotate 
							        <input type="text" class="dial" data-min="0" data-max="360" data-width="40" data-height="40" data-displayInput=false data-thickness=".7" data-fgColor="#0AA699" data-bgColor="#d1dade" data-angleOffset="90" data-cursor=true>
							        
							      </div>
							      
							      <div class="text-right">
							        <a id="delete" class="text-danger small" href="javascript:void(0)"><i class="fa fa-trash-o"></i> Delete</a>
							      </div>
							      
							    </div>
							    
							  </div>
							  
							</div>'

				onShow:->
					self = @	

					#FONT SIZE
					# initialize font size slider
					$('.fontSize').slider()

					# on change of font size do
					$('#hotspot-textelement-fontsize').slider().on 'slide',=>
						size = @model.get 'fontSize'
						@model.set 'fontSize', $('.fontSize').slider('getValue').val()||size


					# TEXT ROTATION
					# initialize the knob
					$('.dial').val self.model.get 'textAngle'
					$(".dial").knob
							change :(val)->
								self.model.set "textAngle",val
								


						

					# FONT COLOR
					# initialize colorpicker and set the on change event
					$('.fontColor').minicolors
							animationSpeed: 200
							animationEasing: 'swing'
							control: 'hue'
							position: 'top left'
							showSpeed: 200

							change :(hex,opacity)->
								self.model.set 'fontColor', hex

					# set the vale of color picker according to the current model
					$('.fontColor').minicolors 'value', self.model.get 'fontColor'


					# FONT FAMILY
					# initialize font family accorging to the model
					$('#hotspot-textelement-fontfamily').select2
							minimumResultsForSearch: -1

					$('#hotspot-textelement-fontfamily').select2 'val',self.model.get 'fontFamily'

					# on change of font family
					$('#hotspot-textelement-fontfamily').on 'change',(e)->
						@.options[0].disabled = true
						self.model.set 'fontFamily', $(e.target).val()
						
								
					# TEXT
					# on change of text
					$('#hotspot-textelement-text').on 'input',=>
						@model.set "text", $('#hotspot-textelement-text').val()

					
					# BOLD and ITALICS
					if @model.get('fontBold') is 'bold'
						$('#font-style.btn-group #bold-btn.btn').addClass 'active'
					if @model.get('fontItalics') is 'italic'
						$('#font-style.btn-group #italic-btn.btn').addClass 'active'

					$('#font-style.btn-group .btn').on 'click',->
						setTimeout ->
							console.log "timeout"
							if $('#font-style.btn-group #bold-btn.btn').hasClass 'active'
							 	self.model.set 'fontBold', "bold"
							else
								self.model.set 'fontBold', ""
							if $('#font-style.btn-group #italic-btn.btn').hasClass 'active'
								self.model.set 'fontItalics', "italic"
							else
								self.model.set 'fontItalics', ""
						,200
						
					#DELETE
					$('#delete.text-danger').on 'click',=>
							@model.set 'toDelete', true
						

