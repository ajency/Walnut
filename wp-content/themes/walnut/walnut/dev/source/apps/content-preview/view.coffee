define ['app'], (App)->

    App.module "ContentPreview.Views", (Views, App, Backbone, Marionette, $, _)->

        class Views.Layout extends Marionette.Layout

            className : ''

            template : '<div class="preview">
                            <div class="" id="top-panel"></div>
                            <div class="" id="content-board"></div>
                            <div class="clearfix"></div>
                            <!--<div class="tiles grey text-grey b-grey b-b m-t-20">
                                <div class="grid simple m-b-0 transparent">
                                    <div class="grid-title no-border qstnInfo">
                                        <p class="bold small-text inline text-grey"><i class="fa fa-question"></i> Additional Information </p>
                                        <div class="tools"> <a href="javascript:;" class="arrow expand"></a> </div>
                                    </div>
                                    <div class="qstnInfoBod no-border m-t-10 p-b-5 p-r-20 p-l-20">
                                        <p class="">{{instructions}}</p>
                                    </div>
                                </div>
                            </div>-->
                        </div>'

            regions :
                contentBoardRegion : '#content-board'
                topPanelRegion : '#top-panel'
