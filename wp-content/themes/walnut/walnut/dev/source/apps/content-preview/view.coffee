define ['app'], (App)->
    App.module "ContentPreview.Views", (Views, App, Backbone, Marionette, $, _)->
        class Views.Layout extends Marionette.Layout

            className: ''

            template: '
                <div class="preview">
                    <div class="" id="top-panel"></div>
                    <div class="" id="content-board"></div>
                    <div class="tiles grey text-grey b-grey b-b m-t-20">
                      <div class="grid simple m-b-0 transparent">
                          <div class="grid-title no-border qstnInfo">
                            <p class="bold small-text inline text-grey"><i class="fa fa-question"></i> Question Info </p>
                            <div class="tools"> <a href="javascript:;" class="arrow expand"></a> </div>
                          </div>
                          <div style="overflow: hidden; display: none;" class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20">
                            <p class="">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
                          </div>
                        </div>
                    </div>
                </div>'

            regions:
                contentBoardRegion: '#content-board'
                topPanelRegion: '#top-panel'
