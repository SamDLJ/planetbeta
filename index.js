import { Atlas } from './data.js';


/*
function importAll(r) {
  let items = [];
  r.keys().map((item, index) => { items[item.replace('./', '')] = r(item); });
  return items;
}
const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));
*/

//var atlas = clone(new_atlas);



const svg = d3.select('svg'); //('#test')
//const width = document.body.clientWidth;
//const height = document.body.clientHeight;
var width = 500;//document.body.clientWidth;
var height = 500;//document.body.clientHeight;
var shadow_size_offset = 0;

var size = 500;
var shadowsize = 475;
var halfsize = 250;
var grow = 0;
var transf_scale = 1.0;

var ex = 0.015;
var ex_spin = -1.2;

const max_nutation = 64;
//console.log("doc.body width: "+width+" doc.body height: "+height);

var svgs0 = document.getElementsByTagName("svg")[0];
svgs0.setAttribute("viewBox", [220, -30, width+30, height+40]);


var worldzoom = document.getElementsByClassName("world_container")[0];
worldzoom.style.height = size+'px';
worldzoom.style.width = size+'px';

var shadowzoom = document.getElementById("world_shadow");
shadowzoom.style.height = shadowsize-shadow_size_offset+'px';
shadowzoom.style.width = shadowsize-shadow_size_offset+'px';

shadowzoom.style.transform = "scale("+Math.pow(transf_scale, ex)+")";
//svgs0.setAttribute("filter", "url(#inset-shadow)");
//svgs0.setAttribute("boxShadow", "inset -65px -65px 400px rgba(200,0,0,.5)");
//svgs0.setAttribute("background", "yellow");
//svgs0.setAttribute("viewBox", [0, 0, 1, 1]);
//svgs0.setAttribute("viewBox", [200, -50, 100, 100%]);//, "100%", "100%"]);
//svgs0.setAttribute("preserveAspectRatio", "xMidYMid slice");
//svgs0.setAttribute("textAlign", "center"); //200, -50

//var display_nme = document.getElementById("name").innerHTML;
//var display_loc = document.getElementById("location").innerHTML;
//var display_pop = document.getElementById("population").innerHTML;
//var display_clm = document.getElementById("climate").innerHTML;

//display: block;
//margin: auto;
const projection = d3.geoOrthographic();
//const projection2 = d3.geoOrthographic();
//const projection = d3.geoEquirectangular();
//const projection = d3.geoNaturalEarth1();
//const projection = d3.geoMercatorRaw()
//var graticule = d3.geoGraticule();

//let context = d3.select('#world')
//  .node()
//  .getContext('2d');
//var lines = d3.geoGraticule10()

//let context = d3.select('svg');
//context.node().getContext('2d');
const boxShadow = [
	"0 0 1px #ffa, 0 0 2px #ffa, 0 0 4px #ffa, 0 0 8px #ffa",
	"0 0 1px #eef, 0 0 2px #eef, 0 0 4px #eef, 0 0 8px #eef",
	"0 0 1px #a77, 0 0 2px #a77, 0 0 4px #a77, 0 0 8px #a77",
	"0 0 1px #fff, 0 0 2px #fff, 0 0 4px #fff, 0 0 8px #fff",
	"0 0 1px #bbb, 0 0 2px #bbb, 0 0 4px #bbb, 0 0 8px #bbb",
]
const backgrounds = [
	"#ffa", "#eef", "#a77", "#fff", "#bbb",
]

function stars(){
	const count = 1000;
	//const section = document.getElementsByClassName("world_container")[0];
	//const section = document.getElementById("stars_here");
	const section = document.querySelector('section');
	let i = 0;
	while (i < count){
		const star = document.createElement('i');
		const x = Math.floor(Math.random() * 1500);
		const y = Math.floor(Math.random() * 1000);
		
		const size = Math.random() * 1;
		const color = Math.floor(Math.random() * boxShadow.length);
		const duration = Math.random() * 2;
		
		star.style.left = x+'px';
		star.style.top = y+'px';
		
		star.style.width = 1+size+'px';
		star.style.height = 1+size+'px';
		star.style.background = backgrounds[color];//'#fff';
		star.style.boxShadow = boxShadow[color];
		
		star.style.animationDuration = 1+duration+'s';
		//star.style.animationDelay = duration+'s';
		
		
		
		section.appendChild(star);
		i++;
	}
}
stars();

//console.log(Math.floor(Math.random() * 3));

function render_with_rotation(anglex, angley) {
  
  projection.rotate([anglex,angley,-5]); //
  //projection2.rotate([anglex,angley,0]);
  
  svg.selectAll('*').remove();
  let g = svg.append('g').attr("id", "main_continent");
	//g.attr("display", "block");
	//g.attr("margin", "auto");
	
  let g2 = svg.append('g').attr("id", "markers");
	let g3 = svg.append('g').attr("id", "lakes");
	let g4 = svg.append('g').attr("id", "siamka");
	let g5 = svg.append('g').attr("id", "cities");
	
  
  var pathGenerator = d3.geoPath(projection);
  //var pathGenerator2 = d3.geoPath(projection);
  
  let markers = topojson.feature(Atlas, Atlas.objects.Markers);
  let lands = topojson.feature(Atlas, Atlas.objects.Main_Continent);
	let waters = topojson.feature(Atlas, Atlas.objects.Lakes_Layer);
	let siamka = topojson.feature(Atlas, Atlas.objects.Siamka);
	let cities = topojson.feature(Atlas, Atlas.objects.Cities);

  g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}))
    .call(d3.drag()
      .on("start", mouseDown)
      .on("drag", mouseHold)
      .on("end", mouseUp)
    );
    
  g.selectAll('path')
    .data(lands.features)
    .enter()
    .append('path')
    .attr('class', 'main_continent_css')
    .attr('d', pathGenerator)
    .on("mouseover", d => {  })
		.on("mousedown", d => {  })
    .append('title').text( d => d.properties.name )
		
    
	
  /* markers */
  g2.append('path')
    .attr('class', 'marker_sphere')
    .attr('d', pathGenerator({type: 'Sphere'}))
    .call(d3.drag()
      .on("start", mouseDown)
      .on("drag", mouseHold)
      .on("end", mouseUp)
    ); 
  
  g2.selectAll('path')
    .data(markers.features)
    .enter()
    .append('path')
    .attr('class', 'markers_css')
    .attr('d', pathGenerator)
    .on("mouseover", d => {  })
		.on("mousedown", d => {  })
		.append('title').text( d => d.properties.name );
		
	
	
	
	/* lakes */
	g3.append('path')
	  .attr('class', 'lakes_sphere')
	  .attr('d', pathGenerator({type: 'Sphere'}))
	  .call(d3.drag()
	    .on("start", mouseDown)
	    .on("drag", mouseHold)
	    .on("end", mouseUp)
	  ); 

	g3.selectAll('path')
	  .data(waters.features)
	  .enter()
	  .append('path')
	  .attr('class', 'lakes_css')
	  .attr('d', pathGenerator)
	  .on("mouseover", d => {  })
		.on("mousedown", d => { mouseClick(d); })
		.append('title').text( d => d.properties.name );
  
	/* Siamka */
	g4.append('path')
	  .attr('class', 'siamka_sphere')
	  .attr('d', pathGenerator({type: 'Sphere'}))
	  .call(d3.drag()
	    .on("start", mouseDown)
	    .on("drag", mouseHold)
	    .on("end", mouseUp)
	  ); 

	g4.selectAll('path')
	  .data(siamka.features)
	  .enter()
	  .append('path')
	  .attr('class', 'siamka_css')
	  .attr('d', pathGenerator)
	  .on("mouseover", d => {  })
		.on("mousedown", d => { mouseClick(d); })
		.append('title').text( d => d.properties.name );

	 /**/
		
	/* cities */
	g5.append('path')
	  .attr('class', 'cities_sphere')
	  .attr('d', pathGenerator({type: 'Sphere'}))
	  .call(d3.drag()
	    .on("start", mouseDown)
	    .on("drag", mouseHold)
	    .on("end", mouseUp)
	  ); 

	g5.selectAll('path')
	  .data(cities.features)
	  .enter()
	  .append('path')
	  .attr('class', 'cities_css')
	  .attr('d', pathGenerator)
	  .on("mouseover", d => { mouseClick(d); })
		.on("mousedown", d => { mouseClick(d); })
		.append('title').text( d => d.properties.name );
  
}

function mouseDown() {
	
}

const spacing = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"


function mouseClick(d) {
	try {
		let dd = d.srcElement.__data__.properties.info;
		
		document.getElementById("name").innerHTML = spacing+dd.fullname;
		document.getElementById("location").innerHTML = spacing+dd.location;
		document.getElementById("population").innerHTML = spacing+dd.population;
		document.getElementById("climate").innerHTML = spacing+dd.climate;
		
		
		let imgc = document.getElementById("image_container");
		let img = document.createElement('img')
		img.id = "image_info";
		img.src = "./images/"+dd.image;
		
		if (imgc.hasChildNodes()) {
		  imgc.replaceChild(img, imgc.childNodes[0]);
		} else {
			imgc.appendChild(img);
		}
		
		
		
	} catch (e) {
		
		return;
	}
	
	
	
	
}
function mouseHold() {}
function mouseUp() {}


const mouse = {
	x: undefined,
	y: undefined
}

const init_pos = {
	x: undefined,
	y: undefined,
	t: undefined
}

const finl_pos = {
	x: undefined,
	y: undefined,
	t: undefined,
	w: width,
	h: height
}

const holdpos = {
	x: 0,
	y: 0,
}

const pos = {
	x: 0,
	y: 0,
}

const damp = {
	x: 0,
	y: 0,
}
const v = {
	x: 0,
	y: 0,
}

const a = {
	x: 0.1,
	y: 0.1,
}

const cap = {
	px: 10,
	py: 10,
	nx: -10,
	ny: -10,
}

const scale = 10000;
const hold_speed = {
	x: 1,
	y: 1
};

var transf_spin = Math.pow(transf_scale, ex_spin);

var holding = false;


/*
var currx = 0, curry = 0; // this one stays permanent
var lastx = 0, lasty = 0; // temporary
var dx = 0, dy = 0;
*/
// init, should run once 
render_with_rotation(pos.x, pos.y);


const last_pos = {
	x: 0,
	y: 0,
}

addEventListener('mousemove', () => {
	last_pos.x = mouse.x;
	last_pos.y = mouse.y;
	mouse.x = (event.clientX / innerWidth)*2 - 1;
	mouse.y = (event.clientY / innerHeight)*2 - 1;
	
	//console.log(transf_spin);
	if (holding) {
		//v.x = 0;
		//v.y = 0;
		
		let speedx = Math.abs(150*(mouse.x - last_pos.x))+1;
		let speedy = Math.abs(150*(mouse.y - last_pos.y))+1;
		
		
		if (speedx >= 5*transf_spin){
			speedx = 5*transf_spin;
		} else if (speedx >= 2*transf_spin){
			speedx = 3*transf_spin;
		}
		
		if (speedy >= 5*transf_spin){
			speedy = 5*transf_spin;
		} else if (speedy >= 2*transf_spin){
			speedy = 3*transf_spin;
		}
		
		if (mouse.x > last_pos.x) {
			pos.x += 1*speedx;//hold_speed.x;
			v.x = speedx;
			if (pos.x > 180) {
				pos.x = -179;
			}
		} else if (mouse.x < last_pos.x) {
			pos.x -= 1*speedx;//hold_speed.x;
			v.x = -speedx;
			if (pos.x <= -180) {
				pos.x = 180;
			}
		}
		
		if (mouse.y < last_pos.y) {
			pos.y += 1*speedy;
			v.y = speedy;
			if (pos.y > max_nutation) {
				pos.y = max_nutation;
			}
		} else if (mouse.y > last_pos.y) {
			pos.y -= 1*speedy;
			v.y = -speedy;
			if (pos.y <= -max_nutation) {
				pos.y = -max_nutation;
			}
		}
		
		render_with_rotation(pos.x, pos.y);
		
	}
	
})

//let parent = document.getElementById('main_continent');
//parent.onmouseover = parent.onmouseout = parent.onmousemove = handler;
var hold_ready = false;


function handler(event) {
  let type = event.type;
	
  //while (type.length < 11) type += ' ';
	if (event.target.id == "world"){
		//render_with_rotation(10,0);
		hold_ready = true;
	} else {
		//render_with_rotation(0,0);
		hold_ready = false;
	}
	//console.log("hold ready: "+hold_ready+"  type:"+type+"   event.target.id: "+event.target.id);// + " target=" + event.target.id);// + " x:" + event.offsetX + " y:" + event.offsetY);
  //log()
  return false;
}




addEventListener('mousedown', () => {
	let world = document.getElementById('world');
	world.onmouseover = world.onmouseout = world.onmousemove = handler;
	//console.log(world.onmousemove);
	
	
	init_pos.x = mouse.x;
	init_pos.y = mouse.y;
	init_pos.t = Date.now();
	
	
	holding = true;
	
	
})

addEventListener('mouseup', () => {
	finl_pos.x = mouse.x - init_pos.x;
	finl_pos.y = mouse.y - init_pos.y;
	finl_pos.t = Date.now()-init_pos.t;
	
	holding = false;
	
});


addEventListener('touchstart', (event) => {
	document.getElementById("touchevents").innerHTML = "touch start";
	if (event.touches.length > 1) {
		document.getElementById("touchevents").innerHTML = "double touch...";
	} 
		
	
	//let world = document.getElementById('world');
	//world.onmouseover = world.onmouseout = world.onmousemove = handler;
	//console.log(world.onmousemove);
	mouse.x = (event.touches[0].clientX / innerWidth)*2 - 1;
	mouse.y = (event.touches[0].clientY / innerHeight)*2 - 1;

	init_pos.x = mouse.x;
	init_pos.y = mouse.y;
	init_pos.t = Date.now();


	holding = true;
	

});

addEventListener('touchend', () => {
	document.getElementById("touchevents").innerHTML = "...";
	finl_pos.x = mouse.x - init_pos.x;
	finl_pos.y = mouse.y - init_pos.y;
	finl_pos.t = Date.now()-init_pos.t;
	
	holding = false;
})

addEventListener('touchmove', () => {
	document.getElementById("touchevents").innerHTML = "touch moving...";
	
	last_pos.x = mouse.x;
	last_pos.y = mouse.y;
	mouse.x = (event.touches[0].clientX / innerWidth)*2 - 1;
	mouse.y = (event.touches[0].clientY / innerHeight)*2 - 1;

	//console.log(transf_spin);
	if (holding) {
		//v.x = 0;
		//v.y = 0;
	
		let speedx = parseInt( Math.abs(150*(mouse.x - last_pos.x)))+1;
		let speedy = parseInt( Math.abs(150*(mouse.y - last_pos.y)))+1;
	
	
		if (speedx >= 5*transf_spin){
			speedx = 5*transf_spin;
		} else if (speedx >= 2*transf_spin){
			speedx = 3*transf_spin;
		}
	
		if (speedy >= 5*transf_spin){
			speedy = 5*transf_spin;
		} else if (speedy >= 2*transf_spin){
			speedy = 3*transf_spin;
		}
	
		if (mouse.x > last_pos.x) {
			pos.x += 1*speedx;//hold_speed.x;
			v.x = speedx;
			if (pos.x > 180) {
				pos.x = -179;
			}
		} else if (mouse.x < last_pos.x) {
			pos.x -= 1*speedx;//hold_speed.x;
			v.x = -speedx;
			if (pos.x <= -180) {
				pos.x = 180;
			}
		}
	
		if (mouse.y < last_pos.y) {
			pos.y += 1*speedy;
			v.y = speedy;
			if (pos.y > max_nutation) {
				pos.y = max_nutation;
			}
		} else if (mouse.y > last_pos.y) {
			pos.y -= 1*speedy;
			v.y = -speedy;
			if (pos.y <= -max_nutation) {
				pos.y = -max_nutation;
			}
		}
	
		render_with_rotation(pos.x, pos.y);
	
	}
});

//document.getElementById("climate").innerHTML = spacing+dd.climate;
//ontouchcancel 	The event occurs when the touch is interrupted
//ontouchend 			The event occurs when a finger is removed from a touch screen
//ontouchmove 		The event occurs when a finger is dragged across the screen
//ontouchstart 		The event occurs when a finger is placed on a touch screen

function animate() {
	
	requestAnimationFrame(animate);
	
	if (v.x > 0){
		v.x -= a.x;
		if (v.x <= 0) {
			v.x = 0;
		}
	} else if (v.x < 0){
		v.x += a.x;
		if (v.x >= 0) {
			v.x = 0;
		}
	}
	
	
	if (v.y > 0){
		v.y -= a.y;
		if (v.y <= 0) {
			v.y = 0;
		}
	} else if (v.y < 0){
		v.y += a.y;
		if (v.y >= 0) {
			v.y = 0;
		}
	}
	
	
	//damp.x += v.x;
	//damp.y += v.y;
	
	if (v.x == 0 && v.y == 0) {
		return;
	}
	
	pos.x += v.x;
	pos.y += v.y;
	if (pos.y >= max_nutation) {
		pos.y = max_nutation;
	} 
	if (pos.y <= -max_nutation) {
		pos.y = -max_nutation;
	}
	
	//console.log(pos.x+" "+pos.y)
	render_with_rotation(pos.x, pos.y);
	//render_with_rotation(damp.x, damp.y);
}
animate();




/* from https://jsfiddle.net/ucLe3hLa/ */
var scrolling = false;
var oldTime = 0;
var newTime = 0;
var isTouchPad;
var eventCount = 0;
var eventCountStart;

var mouseHandle = function (evt) {
  var isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
	//console.log(evt.type);
	
  //console.log(grow+"    "+(-(halfsize+grow))+"");
  if (!isTouchPadDefined) {
      if (eventCount === 0) {
          eventCountStart = new Date().getTime();
      }

      eventCount++;

      if (new Date().getTime() - eventCountStart > 50) {
              if (eventCount > 5) {
                  isTouchPad = true;
              } else {
                  isTouchPad = false;
              }
          isTouchPadDefined = true;
      }
  }
	
	//if (evt.type == "DOMMouseScroll" || evt.touches.length > 1) {
  if (evt.type == "DOMMouseScroll") {
      // here you can do what you want
      // i just wanted the direction, for swiping, so i have to prevent
      // the multiple event calls to trigger multiple unwanted actions (trackpad)
      if (!evt) evt = event;
      var direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;
      if (direction < 0) {
				
				//grow += 10;
				transf_scale += 0.1;
				if (transf_scale >= 8.0){
					transf_scale = 8.0;
				}
				worldzoom.style.transform = "scale("+transf_scale+")";
				shadowzoom.style.transform = "scale("+Math.pow(transf_scale,ex)+")";
				transf_spin = Math.pow(transf_scale, ex_spin);
				
      } else {
				//grow -= 10;
				transf_scale -= 0.1;
				if (transf_scale <= 0.7){
					transf_scale = 0.7;
				}
				worldzoom.style.transform = "scale("+transf_scale+")";
				shadowzoom.style.transform = "scale("+Math.pow(transf_scale,ex)+")";
				transf_spin = Math.pow(transf_scale, ex_spin);
				
      }
  }
    
}
document.addEventListener("mousewheel", mouseHandle, false);
document.addEventListener("DOMMouseScroll", mouseHandle, false);
document.addEventListener("touchstart", mouseHandle, false);









