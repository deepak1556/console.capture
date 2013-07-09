(function(console) {
    function getBox(width, height) {
	return {
	    string: "+",
	    style: "font-size: 1px; padding: " + Math.floor(height/2) + "px " + Math.floor(width/2) + "px; line-height: " + height + "px;"
	}
    }

    var frame;

    var Capture = function(options) {
	var opt = options || {};
	this.delay = opt.delay ? opt.delay : 16;
	this.captureFrame = null;
	this.scale = 1;
	this.gif = new GIF({
	    workers: 4
	});
    };

    console.image = function(url, scale, callback) {
	if(typeof scale == "function") {
	    callback = scale;
	    scale = 1;
	}
	if(!scale) {
	    scale = 1;
	}

	var img = new Image();

	img.onload = function() {
	    var dim = getBox(this.width * scale, this.height * scale);
	    console.log("%c" + dim.string, dim.style + "background-image: url(" + url + "); background-size: " + (this.width * scale) + "px" + (this.height * scale) + "px; color: transparent;");
	    if(callback) {
		callback();
	    }
	};

	img.src = url;
	img.style.background = "url(" + url + ")";
    };
 
    console.captureStart = function(canvas, options) {
	frame = new Capture(options);

	frame.captureFrame = setInterval(function() {
	    frame.gif.addFrame(canvas, {delay: 25});
	}, frame.delay * 10);
    };

    console.captureEnd = function(msg) {
	if(typeof msg == "string") {
	    console.log(msg);
	}

	clearInterval(frame.captureFrame);

	frame.gif.on('finished', function(blob) {
	    var reader = new FileReader;
	    
	    reader.onload = function(blob) {
		console.image(reader.result);
	    };

	    reader.readAsDataURL(blob);
	});

	frame.gif.render();
    };
})(console);