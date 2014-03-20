/**
 * Custom Plugins for Kinetic.js   Used to resize the different shapes



*/

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
        fill: 'skyblue',
        stroke: 'lightgray',
        strokeWidth: 3,
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
        console.log(circle.getAbsolutePosition().x +" ,  "+circle.getAbsolutePosition().y)
        var dx=x1-x2;
        var dy=y1-y2;
        var r=Math.sqrt(dx*dx+dy*dy)-draggerOffset;
        r=Math.max(5,r);
        circle.resize(r);
      //  dragLine.setPoints([myGuageX,myGuageY, x1,y1]);
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

    var myGroup = new Kinetic.Group({
                x: subjectX,
                y: subjectY,
                draggable: true
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



// // single dragger
// resizeRect = function(rectangle){
// 	var draggerOffset = 0;
// 	var draggerRadius = 5;
// 	var subjectX = rectangle.getAbsolutePosition().x;
// 	var subjectY = rectangle.getAbsolutePosition().y;
// 	var subjectWidth = rectangle.width();
// 	var subjectHeight = rectangle.height();

// 	var dragger = new Kinetic.Group({
// 		draggable : true
// 	});

// 	var dragCircle=new Kinetic.Circle({
//         x: subjectX+subjectWidth+draggerOffset,
//         y: subjectY+subjectHeight+draggerOffset,
//         radius: draggerRadius,
//         fill: 'skyblue',
//         stroke: 'lightgray',
//         strokeWidth: 3,
//         draggable:true,
//         dragBoundFunc: function(pos) {
//             return { x: (pos.x>rectangle.getAbsolutePosition().x+draggerOffset)?pos.x : rectangle.getAbsolutePosition().x+draggerOffset,
//             		 y: (pos.y>rectangle.getAbsolutePosition().y+draggerOffset)?pos.y : rectangle.getAbsolutePosition().y+draggerOffset }
//         }
//     });

//     dragCircle.on("dragmove", function () {
    
//         var pos = this.getAbsolutePosition();
//         var x = pos.x;
//         var y = pos.y;
//         var rectX = rectangle.getAbsolutePosition().x;
//         var rectY = rectangle.getAbsolutePosition().y;
//         rectangle.resize(x - rectX, y - rectY);
        
    
// 	});

// 	rectangle.resize = function(width,height){
// 		rectangle.width(width);
// 		rectangle.height(height);
// 	};


// 	dragger.add(rectangle);
// 	dragger.add(dragCircle);


//     return dragger;

// };




// resizeRect = function(rectangle){
// 	var draggerOffset = 5;
// 	var draggerRadius = 5;
// 	var subjectWidth = rectangle.width();
// 	var subjectHeight = rectangle.height();
// 	var subjectX = rectangle.getAbsolutePosition().x;
// 	var subjectY = rectangle.getAbsolutePosition().y;

// 	var dragger = new Kinetic.Group({
// 		draggable : true
// 	});

// 	var dragRightCircle = new Kinetic.Circle({
//         x: subjectX+subjectWidth+draggerOffset,
//         y: subjectY+subjectHeight/2,
//         radius: draggerRadius,
//         fill: 'skyblue',
//         stroke: 'lightgray',
//         strokeWidth: 3,
//         draggable:true,
//         dragBoundFunc: function(pos) {
//             return { x: (pos.x>rectangle.getAbsolutePosition().x+5+draggerOffset)?pos.x : rectangle.getAbsolutePosition().x+5+draggerOffset,
//             		 y: this.getAbsolutePosition().y }
//         }
//     });

//     dragRightCircle.on("dragmove",function(){
//         var x1=this.getAbsolutePosition().x;
//         //var y1=this.getAbsolutePosition().y;
//         var x2=this.getAbsolutePosition().x>rectangle.getAbsolutePosition().x?rectangle.getAbsolutePosition().x:rectangle.getAbsolutePosition().x+rectangle.width();;
//         //var y2=circle.getAbsolutePosition().y;
//         console.log(rectangle.getAbsolutePosition().x +" ,  "+rectangle.getAbsolutePosition().y)
//         var dx=x1-x2;
//        // var dy=y1-y2;
//         var r=Math.sqrt(dx*dx)-draggerOffset;
//         r=Math.max(5,r);
//         rectangle.resize(r,this);
//       //  dragLine.setPoints([myGuageX,myGuageY, x1,y1]);
//     });

//     dragger.add(dragRightCircle);


// 	var dragLeftCircle = new Kinetic.Circle({
//         x: subjectX-draggerOffset,
//         y: subjectY+subjectHeight/2,
//         radius: draggerRadius,
//         fill: 'skyblue',
//         stroke: 'lightgray',
//         strokeWidth: 3,
//         draggable:true,
//         dragBoundFunc: function(pos) {
//             return { x: (pos.x<rectangle.getAbsolutePosition().x-draggerOffset+rectangle.width()-5)?pos.x : rectangle.getAbsolutePosition().x-draggerOffset,
//             		 y: this.getAbsolutePosition().y }
//         }
//     });
//     var ra=null;

//     dragLeftCircle.on("dragmove",function(){
//         var x1=this.getAbsolutePosition().x;
//         //var y1=this.getAbsolutePosition().y;
//         var x2=this.getAbsolutePosition().x>rectangle.getAbsolutePosition().x?rectangle.getAbsolutePosition().x:rectangle.getAbsolutePosition().x+(ra||rectangle.width());
//         //var y2=circle.getAbsolutePosition().y;
//         console.log(rectangle.getAbsolutePosition().x +" ,  "+rectangle.getAbsolutePosition().y)
//         var dx=x1-x2;
//        // var dy=y1-y2;
//         r=Math.sqrt(dx*dx)-draggerOffset;
//         r=Math.max(5,r);
//         rectangle.resize(r,this);
//       //  dragLine.setPoints([myGuageX,myGuageY, x1,y1]);
//     });

//     dragger.add(dragLeftCircle);



//     rectangle.resize = function(newWidth,drag){
//     	this.width(newWidth);
//     	if(this.getAbsolutePosition().x+newWidth>drag.getAbsolutePosition().x && newWidth>5){
//     		this.setAbsolutePosition({
//     			x :  drag.getAbsolutePosition().x+draggerOffset,
//     			y : this.getAbsolutePosition().y
//     		})
//     	}

//     };

//     dragger.add(rectangle);

//     return dragger;

// }