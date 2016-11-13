var canvas; 
var context;
var isDragging = false;
var prevX;
var prevY;

var overlay;

var MIN_MASS    = 1.0;
var curmass     = 0.5;  // Adjust this: [0,1] ratio of min/max
var MAX_MASS    = 160.0;
var MIN_DRAG    = 0.0;
var curdrag     = 0.35; // Adjust this: [0,1] ratio of min/max
var MAX_DRAG    = 0.5;
var WIDTH       = 0.5;  // Adjust this: width of the pen
var FIXED_ANGLE = 0; // Adjust this: 1=fixed angle or 0=variable

var xsize       = window.innerWidth;
var ysize       = window.innerHeight;
var xyratio     = xsize/ysize;
var mouse       = new Filter();
var odelx, odely;
var isMouseDown = false;
var mx,my;
var overlayers = [];

function point2LatLng(point, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}
function Filter() {
    this.curx = 0.0;
    this.cury = 0.0;
    this.velx = 0.0;
    this.vely = 0.0;
    this.vel = 0.0;
    this.accx = 0.0;
    this.accy = 0.0;
    this.acc = 0.0;
    this.angx = 0.0;
    this.angy = 0.0;
    this.mass = 0.0;
    this.drag = 0.0;
    this.lastx = 0.0;
    this.lasty = 0.0;
    this.fixedangle = FIXED_ANGLE;
};
Filter.prototype.setpos = function(x,y) {
    this.curx = x;
    this.cury = y;
    this.lastx = x;
    this.lasty = y;
    this.velx = 0.0;
    this.vely = 0.0;
    this.accx = 0.0;
    this.accy = 0.0;
}
Filter.prototype.apply = function(mx,my) {
    var mass, drag;
    var fx, fy, force;

    /* calculate mass and drag */
    mass = flerp(MIN_MASS,MAX_MASS,curmass);
    drag = flerp(MIN_DRAG,MAX_DRAG,curdrag*curdrag);

    /* calculate force and acceleration */
    fx = mx-this.curx;
    fy = my-this.cury;
    this.acc = Math.sqrt(fx*fx+fy*fy);
    if(this.acc<0.000001)
		return 0;
	// console.log('')
    this.accx = fx/mass;
    this.accy = fy/mass;

    /* calculate new velocity */
    this.velx += this.accx;
    this.vely += this.accy;
    this.vel = Math.sqrt(this.velx*this.velx+this.vely*this.vely);
    if(this.vel<0.000001) 
 	return 0;

    /* calculate angle of drawing tool */
    this.angx = -this.vely;
    this.angy = this.velx;
    this.angx /= this.vel;
    this.angy /= this.vel;
    if(this.fixedangle) {
	this.angx = 0.5;
	this.angy = 0.5;
   }

    /* apply drag */
    // console.log(drag)
    this.velx = this.velx*(1.0-drag*2);
    this.vely = this.vely*(1.0-drag*2);

    /* update position */
    this.lastx = this.curx;
    this.lasty = this.cury;
    this.curx = this.curx+this.velx;
    this.cury = this.cury+this.vely;
    return 1;
}

function flerp(f0,f1,p) {
    return ((f0*(1.0-p))+(f1*p));
}

function USGSOverlay(bounds, image, map) {
        // Initialize all properties.
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
      }
var canvasTop;
var iswhite = true;
var showing = false;
// jQuery(document).ready(function($) {
function initialize(){
	canvas = document.getElementById("mycanvas");
	context = canvas.getContext("2d");
	$("#mycanvas").attr({
		height: 600,
		width: $(window).width()
	});
	canvasTop = $("#map").offset().top;
	$("#mycanvas").css({
		top: $("#map").offset().top +"px"
	});
	$("#toolbar").css({
		top: $("#map").offset().top+"px"});
	$("#slide-bar").css({
		top: $("#map").offset().top+"px"});
	$(window).on('resize', function(event) {
		$("#mycanvas").attr({
		height: 600,
		width: $(window).width()
		});
	});
	init();
	USGSOverlay.prototype = new google.maps.OverlayView();
	USGSOverlay.prototype.onAdd = function() {

        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = "100%";
        img.style.position = 'absolute';
        img.style.left = '0px';
        div.appendChild(img);

        this.div_ = div;
        // console.log(div);

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      };
      USGSOverlay.prototype.onRemove = function() {
		  this.div_.parentNode.removeChild(this.div_);
		  this.div_ = null;
		};

      USGSOverlay.prototype.draw = function() {

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        var overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        // Resize the image's div to fit the indicated dimensions.
        var div = this.div_;
        
        // div.style.left = sw.x + 'px';
        // div.style.top = ne.y + 'px';
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
        // console.log(div);
      };
	

	$('#drawButton').on('click', function(event) {
		$("#mycanvas").toggle();
		if (iswhite) {
			iswhite = false;
			$('#drawButton').css({
				backgroundColor: 'orange'
			});
		}
		else{
			iswhite = true;
			$('#drawButton').css({backgroundColor: "white"});
		}
		/* Act on the event */
	});
	$('#clear').on('click', function(event) {
		// setMapOnAll(null);
		// for (var i = 0; i<markers.length; i++){
		// 	markers[i].setMap(null);
		// }
		// markers = [];
		// locationsArray = [];
		// for (var i = 0; i<overlayers.length; i++){
		// 	overlayers[i].onRemove();
		// }
		// overlayers=[];
		// event.preventDefault();
		/* Act on the event */
	});
	$('#move').on('click', function(event) {
		if (!showing){
			showing = true;
			$('#move').css({
				backgroundColor: 'orange'
			});
			$('#slide-bar').fadeIn(300, function() {
				
			});
			$('#toolbar').animate({
				right: "250px"},
				300, function() {
				/* stuff to do after animation is complete */
			});
		}
		else {
			showing = false;
			$('#move').css({
				backgroundColor: 'white'
			});
			$('#slide-bar').fadeOut(300, function() {
				
			});
			$('#toolbar').animate({
				right: "0"},
				300, function() {
				/* stuff to do after animation is complete */
			});
		}

		/* Act on the event */
	});
	$("#mycanvas").on('mousedown', function(event) {
		isDragging = true;
		prevX = event.clientX;
		prevY = event.clientY;
		mx = xyratio*event.clientX/xsize;
		my = event.clientY/ysize;
		isMouseDown = true;

   		 mouse.setpos(mx,my);
    		odelx = 0.0;
    		odely = 0.0;
        
		event.preventDefault();
		/* Act on the event */
	});
	$("#mycanvas").on('mousemove', function(e) {
		// console.log(event);
		if (isDragging) {
			if (!e) var e = window.event;
			// console.log(e.clientY);
		    mx = xyratio*(e.clientX)/xsize;
		    my = (e.clientY-50)/ysize;

			var apoint = new Object();
			apoint.x = event.clientX;
			apoint.y = event.clientY;

			var pyrmont = point2LatLng(apoint, map);
			//console.log(pyrmont.lat(),pyrmont.lng())

			var service = new google.maps.places.PlacesService(map);
			        service.nearbySearch({
			          location: pyrmont,
			          radius: 50000,
			          type: ['administrative_area_level_2']
			        }, callback);
			prevX = event.clientX;
			prevY = event.clientY;
		}
		event.preventDefault();
		/* Act on the event */
	});

	$("#mycanvas").on('mouseup', function(event) {
		isDragging = false;
		isMouseDown = false;
		var dataURL = canvas.toDataURL("image/png");
		var width=$(window).width();
		var height = $(window).height();
		var bounds = new google.maps.LatLngBounds(
			map.getBounds().getSouthWest(),
			map.getBounds().getNorthEast()
		);
		// console.log(map.getBounds().getNorthEast().lat());
		// console.log(map.getBounds().getNorthEast().lng());
		// console.log(map.getBounds().getSouthWest());
		// console.log(map.getProjection().fromPointToLatLng(map.getBounds().getNorthEast()).lat());
		overlay = new USGSOverlay(bounds, dataURL, map);
		overlayers.push(overlay);
		context.clearRect(0, 0, $(window).width(), 800);

		event.preventDefault();
		/* Act on the event */
	});
}


function init()
{

    canvas.style.cursor = 'crosshair';
       

    onClear();
      
      

      
    document.onmousedown = function() {return false;} // avoid text selection

    setInterval( "doTimer()", 5 );
}

function doTimer()
{
    if (isMouseDown && mouse.apply(mx,my)) {
        draw();
    }
}
function startStroke()
{
    context.moveTo(mouseX, mouseY);
}

function draw()
{
    var delx, dely; 
    var wid;
    var px, py, nx, ny;
    if (mouse.vel<0.001) return;
    wid = 0.04-mouse.vel;
    wid = wid*WIDTH;
    if(wid<0.001)
    	wid = 0.001;
    delx = mouse.angx*wid;
    dely = mouse.angy*wid;
    // console.log(delx, dely);
    px = mouse.lastx;
    py = mouse.lasty;
    nx = mouse.curx;
    ny = mouse.cury;

    context.beginPath();
    context.moveTo(xsize*(px+odelx)/xyratio,ysize*(py+odely));
    context.lineTo(xsize*(px-odelx)/xyratio,ysize*(py-odely));
    context.stroke();
    context.lineTo(xsize*(nx-delx)/xyratio,ysize*(ny-dely));
    context.lineTo(xsize*(nx+delx)/xyratio,ysize*(ny+dely));
    context.closePath();
    context.fill();  // change to context.stroke(); to see what is being drawn
    odelx = delx;
    odely = dely;
}

function setStyle()
{
    context.lineWidth   = 1.0;
    context.strokeStyle = "red";
    context.fillStyle   = "red";
}
function onClear()
{
    context.fillStyle = "rgb(250, 250, 250)";
    context.clearRect(0, 0, xsize, ysize);
    setStyle();
}