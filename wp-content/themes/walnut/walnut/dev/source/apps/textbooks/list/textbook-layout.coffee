define ['app'
		'text!apps/textbooks/templates/textbooks.html'
		],(App,textbooksTpl)->

	App.module "TextbooksApp.List.Views",(Views, App)->

		class Views.TextbookBreadcrumbView extends Marionette.ItemView

			template : '<li>
							<p>Dashboard</p>
						</li>
						<li>
							<p><a href="javascript://">Content Management</a></p>
						</li>
						<li>
							<p><a class="active" href="javascript://">Textbooks</a></p>
						</li>'

			tagName	 : 'ul'
			className: 'breadcrumb'


		class Views.TextbookListLayout extends Marionette.Layout

				template : textbooksTpl

				className : 'page-content'

				regions: 
					breadcrumbRegion 	: '#breadcrumb-region'
					textbooksListRegion	: '#textbooks-list-region'
