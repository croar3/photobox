//Photobox 1.0
//Began on 2013-09-28

var brightness,contrast,gamma,soften;
var canvas = document.getElementById('canvas');
var ocanvas = document.getElementById('ocanvas');
var octx = ocanvas.getContext('2d');
var ctx = canvas.getContext('2d');
function num(el) {
	return parseInt(document.getElementById(el).value);
}
function cap(el) {
	return Math.round(Math.max(0,Math.min(255,el)));
}
$('#draggable').draggable({
	start: function() {
		$(this).find('.canvas').addClass('grabbing');
	},
	stop: function() {
		$(this).find('.canvas').removeClass('grabbing');
	}
});

var camera = {
	center: function() {
		var cw = $('.canvas')[0].width;
		var ch = $('.canvas')[0].height;
		$('#draggable').animate({'left': parseInt((($(window).width()-390)/2)-(cw/2)) ,
		'top': parseInt(($(window).height()/2)-(ch/2)-9)}, 'fast' );
		//$('#demo').css('left', ((($(window).width()-350)/2)-($('#demo')[0].width/2)))
		//.css('top', (($(window).height()/2)-($('#demo')[0].height/2)));
		return true;

	},
	currentZoom: 100,
	zoom: function(amnt) {
		amnt = Math.max(12,Math.min(100,amnt));
		$('#zoomslider').slider('value', amnt);
		camera.currentZoom = amnt;
		$('.canvas').css({
			'-moz-transform': 'scale(' + (amnt/100) + ')',
			'-webkit-transform': 'scale(' + (amnt/100) + ')',
		});
		camera.center();
		return camera.currentZoom;
	},
	zoomIn: function() {
		var amnt = Math.max(12,Math.min(100,camera.currentZoom + 20));
		$('#zoomslider').slider('value', amnt);
		camera.currentZoom = amnt;
		$('.canvas').css({
			'-moz-transform': 'scale(' + (amnt/100) + ')',
			'-webkit-transform': 'scale(' + (amnt/100) + ')',
		});
		camera.center();
		return camera.currentZoom;
	},
	zoomOut: function() {
		var amnt = Math.max(12,Math.min(100,camera.currentZoom - 20));
		$('#zoomslider').slider('value', amnt);
		camera.currentZoom = amnt;
		$('.canvas').css({
			'-moz-transform': 'scale(' + (amnt/100) + ')',
			'-webkit-transform': 'scale(' + (amnt/100) + ')',
		});
		camera.center();
		return camera.currentZoom;
	},
	toScreen: function() {
		camera.center();
		if (canvas.width/canvas.height > ($(window).width()-390)/$(window).height()) {
			camera.zoom(100*(($(window).width()-400)/canvas.width));
			return 100*(($(window).width()-400)/canvas.width);
		}
		else {
			camera.zoom(100*(($(window).height()-20)/canvas.height));
			return 100*(($(window).height()-20)/canvas.height);
		}
	}
};
var image = {
	pixels: null,
	update: function() {
		var a = 0;                     //  set your counter to 1

		var n=5;
		var iw = 150;
		var interval = setInterval(looper, n);
		function clr() {
			clearInterval(interval);
		}
		function looper() {
			var px = octx.getImageData(a,0,iw,canvas.height);
			var d = px.data;
			if (num('brightness') != 0) {
				brightness = num('brightness')/90;
			}
			for (var i=0; i<d.length; i+=4) {
				var r = d[i];
				var g = d[i+1];
				var b = d[i+2];

				if (num('brightness') != 0) {
					r = cap(r*brightness);
					g = cap(g*brightness);
					b = cap(b*brightness);
				}
				d[i] = r;
				d[i+1] = g;
				d[i+2] = b;
			}
			
			//console.log(image.pixels);
			ctx.putImageData(px,a,0);
			a+=iw;
			console.log(a);
			if (a>canvas.width) {
				a=0;
				clearInterval(interval);
			}
		}
	}
};



$('#dropzone').click(function() {
	$('#uploader').trigger('click');
});
function handleDragOver(e) {
	e.stopPropagation();
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}
function handleFiles(e) {
	var img = new Image;
	img.src = URL.createObjectURL(e.target.files[0]);
	img.onload = function() {
		canvas.width = this.width;
		canvas.height = this.height;
		ocanvas.width = this.width;
		ocanvas.height = this.height;
		octx.drawImage(img,0,0);
		ctx.drawImage(img,0,0);
		$('.dia').fadeOut('fast');
		camera.toScreen();
		$('#canvas').fadeIn('slow');
		image.pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
	}
}
function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	var files = evt.dataTransfer.files; // FileList object. files is a FileList of File objects. List some properties.
	var img = new Image;
	img.src = URL.createObjectURL(files[0]);
	img.onload = function() {
		canvas.width = this.width;
		canvas.height = this.height;
		ocanvas.width = this.width;
		ocanvas.height = this.height;
		octx.drawImage(img,0,0);
		ctx.drawImage(img,0,0);
		$('.dia').fadeOut('fast');
		camera.toScreen();
		$('#canvas').fadeIn('slow');
		image.pixels = ctx.getImageData(0,0,canvas.width,canvas.height);
	}
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	evt.target.className = (evt.type == "dragover" ? "hover" : "");
}
var input = document.getElementById('uploader');
input.addEventListener('change', handleFiles);
document.getElementById('dropzone').addEventListener('dragover', handleDragOver, false);
document.getElementById('dropzone').addEventListener('dragleave', handleDragOver, false);
document.getElementById('dropzone').addEventListener('drop', handleFileSelect, false);

shortcut.add("0",function() {
	camera.toScreen();
	},{'type':'keydown','propagate':false,'disable_in_input':true,'target':document
});
shortcut.add("1",function() {
	camera.zoom(100);
	},{'type':'keydown','propagate':false,'disable_in_input':true,'target':document
});

$('#zoomslider').slider({
	min: 12,
	max: 100,
	step: 1,
	value: 100,
	start: function(event, ui) {
		camera.center();
	},
	slide: function(event, ui) {
		$('.canvas').css({
			'-moz-transform': 'scale(' + (ui.value/100) + ')',
			'-webkit-transform': 'scale(' + (ui.value/100) + ')',
		});
	}
});


$('#brightness, #contrast, #gamma, #soften, #tint, #temperature').slidespinbox({
	step:1,
	min:-180,
	max:180,
	change: function() {
		image.update();
	}
});


// var val = 3;
// $(this).css({
// '-moz-transform': 'scale(' + val + ')',
// '-webkit-transform': 'scale(' + val + ')',
// });