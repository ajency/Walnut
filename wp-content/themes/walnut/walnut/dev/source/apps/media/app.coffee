define ['app'
        'controllers/region-controller'
        'apps/media/upload/controller'
        'apps/media/youtube-video/controller'
        'apps/media/grid/controller'
        'apps/media/selected/controller'
        'apps/media/edit-media/controller'], (App, RegionController, outerTpl)->
    App.module 'Media', (Media, App, Backbone, Marionette, $, _)->