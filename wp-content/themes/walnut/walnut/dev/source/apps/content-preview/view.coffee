define ['app'], (App)->
    App.module "ContentPreview.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.Layout extends Marionette.Layout

            className: ''

            template: '
            							<div class="preview">
            								<div class="" id="top-panel"></div>
            								<div class="" id="content-board"></div>
            							</div>
            							'

            regions:
                contentBoardRegion: '#content-board'
                topPanelRegion: '#top-panel'
