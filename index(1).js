
var width = document.getElementById('svgmap').clientWidth;
var height = document.getElementById('svgmap').clientHeight;


console.log(width, height);

var marginLeft = 0;
var marginTop = 0;

var svgmap = d3.select('#svgmap')
    .append('g')
    .attr('transform', 'translate(-150, -13980)');
	//.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
	

d3.json('./manhattanFinal.geojson',function(dataIn){

	console.log(dataIn);

	var t = dataIn.features;

	var m = t.filter(function(d) { return d.properties.LotArea != null})
		.filter(function(d) { return d.properties.LotArea != 0})
	
	console.log(m);

	var nested = d3.nest()
		.key(function(d) { return d.properties.LotArea; })
		.entries(m)
		.sort(function(a,b) { return b.key - a.key; })


	var eachPath = [];
	for (var i=0; i<nested.length; i++){
		for (var j=0; j<(nested[i].values).length; j++){
			eachPath.push({key:nested[i].key, values: (nested[i].values)[j]});
		}
	}

	console.log(eachPath);


	n1 = eachPath.slice(1, 20);

	console.log("Here are datas for drawing")
	console.log(n1);

	var length = []

	n1.forEach(function(d){
		length.push(Math.sqrt(d.key)/20) ;
	  })

	console.log(length);


/* import manhattan map for the welcome page*/
	var center = d3.geoCentroid(dataIn);
	console.log(center);
	var scale = 200000;
	var offset = [width/2, height/2];
	var projection = d3.geoMercator().center(center).translate(offset);

	//create the path
	var cityPath = d3.geoPath().projection(projection.scale(scale));

	//console.log(dataIn);
	//console.log(dataIn.features);

	var pathMap = svgmap.selectAll('path')
		 .data(dataIn.features)
		 .enter()
		 .append("path")
		 .attr("d", cityPath)
		 .attr("fill", "steelblue")
		 .attr("stroke", "white")
		 .attr("stroke-width", 1);


	var tooltip = d3.select("#svgmap")
		.append("div")
		.attr("class", "tooltip");

	svgmap.selectAll("path")
	.on("mouseover", function(d) {
		
		tooltip.style("visibility", "visible")
		.style("left", (d3.mouse(this)[0]-510) + "px") 
		.style("top", (d3.mouse(this)[1]-14000) + "px")
		.html(d.properties.Address);

		d3.select(this)
			.attr("opacity", 0.7);
	
	}).on("mouseout", function() {
		tooltip.style("visibility", "hidden");

		d3.select(this)
			.attr("opacity", 1);
	})    


	var svgs = []
	for (i = 0; i < n1.length; i++) {
		svgs[i] = d3.select("#list")
			.append("svg")
			.attr("id", "svg" + i)
			.attr("width", length[i])
			.attr("height", length[i])


		var geo  =  {type: "FeatureCollection",  features: n1[i].values};
		console.log("Here are geo datas.");
		console.log(geo);

		var path = d3.geoPath()
				.projection(d3.geoTransverseMercator()
				.fitExtent([[0, 0], [length[i]], length[i]], geo));

			svgs[i].selectAll("path")
				.data(geo.features)
				.enter()
				.append("path")
				.attr("d", path)
				.attr("opacity", 0)
				.attr('fill', "steelblue")
				.attr('stroke', 'white')
				.attr('stroke-width', 1);
	}
	
	/*-----------------This is a click function -------------------------------------------------------*/
	//array of streetBlocks//
	var clickNumber = 0;
	//console.log(clickNumber);
	d3.select("#size").on("click", function() {

		// console.log(clickNumber);
		clickNumber += 1;
		if (clickNumber%2){
			svgmap.selectAll("path")
				.attr("opacity", 0)
				.transition()
				.duration(1000);

			for(var i=0; i<n1.length; i++){
				svgs[i].selectAll("path")
					.attr("opacity", 1)
					.transition()
					.duration(1000);
			}

		} else {
			svgmap.selectAll("path")
				.attr("opacity", 1)
				.transition()
				.duration(1000);

			for(var i=0; i<n1.length; i++){
				svgs[i].selectAll("path")
					.attr("opacity", 0)
					.transition()
					.duration(1000)
			}
		
		}
	});

});