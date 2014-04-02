/**
 * Custom Plugins for Kinetic.js   Used to resize the different shapes



*/

dragBoundRect = function(pos,inner,outer){

        var minX = outer.getX();
        var maxX = outer.getX() + outer.getWidth() - inner.getWidth();
        var minY = outer.getY();
        var maxY = outer.getY() + outer.getHeight() - inner.getHeight();

        var X = pos.x;
        var Y = pos.y;
       
        if (X < minX - inner.getX()) {
            X = minX - inner.getX();
        }
        if (X > maxX - inner.getX()) {
            X = maxX - inner.getX();
        }
        if (Y < minY - inner.getY()) {
            Y = minY - inner.getY();
        }
        if (Y > maxY - inner.getY()) {
            Y = maxY - inner.getY();
        }
        return ({
            x: X,
            y: Y
        });


} 



resizeCircle = function(circle,layer){
	
	var draggerOffset = 0;
	var draggerRadius = 5;
	var subjectRadius = circle.radius();
	var subjectX = circle.getAbsolutePosition().x;
	var subjectY = circle.getAbsolutePosition().y;

	var dragger = new Kinetic.Group({
		draggable : true
	})

	var dragCircle=new Kinetic.Circle({
        x: subjectX+subjectRadius+draggerOffset,
        y: subjectY,
        radius: draggerRadius,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,

        draggable:true,
        dragBoundFunc: function(pos) {
            return { x: pos.x, y: this.getAbsolutePosition().y }
        }



       
    });
    dragCircle.on("dragmove",function(){
        var x1=this.getAbsolutePosition().x;
        var y1=this.getAbsolutePosition().y;
        var x2=circle.getAbsolutePosition().x;
        var y2=circle.getAbsolutePosition().y;
        
        var dx=x1-x2;
        var dy=y1-y2;
        var r=Math.sqrt(dx*dx+dy*dy)-draggerOffset;
        r=Math.max(5,r);
        circle.resize(r);
      //  dragLine.setPoints([myGuageX,myGuageY, x1,y1]);
    });


    dragCircle.on('mouseover', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.strokeWidth(4);
        layer.draw();
    });
    dragCircle.on('mouseout', function () {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.strokeWidth(2);
        layer.draw();
    });
    

    circle.resize = function(newRadius){
    	this.radius(newRadius);
    };

    dragger.add(circle);
    dragger.add(dragCircle);

    layer.add(dragger);
    return dragger;
}



resizeRect = function(rectangle,layer){
    var subjectX = rectangle.getAbsolutePosition().x;
    var subjectY = rectangle.getAbsolutePosition().y;
    var subjectPosition = rectangle.getAbsolutePosition();
    var subjectWidth = rectangle.width();
    var subjectHeight = rectangle.height();
    var stage = layer.getStage()


    var myGroup = new Kinetic.Group({
                x: subjectX,
                y: subjectY,
                draggable: true,
                dragBoundFunc: function(pos){
                    return dragBoundRect(pos,this.getChildren()[0],stage)
                }
    });
    

    layer.add(myGroup)


    myGroup.add(rectangle);
    var topLeftAnchor=addAnchor(myGroup, 0, 0, 'topLeft');
    addAnchor(myGroup, subjectWidth, 0, 'topRight');
    addAnchor(myGroup, subjectWidth, subjectHeight, 'bottomRight');
    addAnchor(myGroup, 0, subjectHeight, 'bottomLeft');

    rectangle.setPosition(topLeftAnchor.getPosition());

    return myGroup;


}

addAnchor=function(group, x, y, name) {
            var layer = group.getLayer();

            var anchor = new Kinetic.Circle({
                x: x,
                y: y,
                stroke: '#666',
                fill: '#ddd',
                strokeWidth: 2,
                radius: 8,
                name: name,
                draggable: true,
                dragOnTop: false
            });

            anchor.on('dragmove', function () {
                update(this);
                layer.draw();
            });
            anchor.on('mousedown touchstart', function () {
                group.draggable(false);
                this.moveToTop();
            });
            anchor.on('dragend', function () {
                group.draggable(true);
                layer.draw();
                update(this);
            });
            // add hover styling
            anchor.on('mouseover', function () {
                var layer = this.getLayer();
                document.body.style.cursor = 'pointer';
                this.strokeWidth(4);
                layer.draw();
            });
            anchor.on('mouseout', function () {
                var layer = this.getLayer();
                document.body.style.cursor = 'default';
                this.strokeWidth(2);
                layer.draw();
            });

            group.add(anchor);
            if(name=="topLeft"){
                return anchor
            }
        }


update=function (activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var mask = group.getChildren()[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();


    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            break;
    }

   mask.setPosition(topLeft.getPosition());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        mask.setSize({"width":width, "height":height});
    }
}



