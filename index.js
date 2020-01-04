
var width = document.getElementById('svgmap').clientWidth;
var height = document.getElementById('svgmap').clientHeight;


console.log(width, height);

var marginLeft = 0;
var marginTop = 0;

var tooltip = d3.select("#map-whole")
		.append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

var svgmap = d3.select('#svgmap')
    .append('g')
    .attr('transform', 'translate(-100, -13980)');
	//.attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
	

d3.json('./manhattanFinal.geojson',function(dataIn){

	console.log(dataIn);

	var t = dataIn.features;

	console.log(t);

	var nested = d3.nest()
	.key(function(d) { return d.properties.LotArea; })
	.entries(t)
	.sort(function(a,b) { return b.key - a.key; })

	console.log(nested);

	var eachPath = [];

	for (var i=0; i<nested.length; i++){
		//console.log(...nested[i].values);
	//eachPath.push(...nested[i].values);
		 for (var j=0; j<(nested[i].values).length; j++)
		{
			eachPath.push({key:nested[i].key, values:[(nested[i].values)[j]]});
		} 
	}

	console.log("Here is sorted values");
	console.log(eachPath);
	//n1 = nested.slice(0, 10);
	n1 = eachPath.slice(0,10);
	console.log(n1);
	//console.log(n2);





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


	// var tooltip = d3.select("#topLayer")
	// 	.append("div")
	// 	.attr("class", "tooltip")
	// 	.style("opacity", 0);

	svgmap.selectAll("path")
	.on("mouseenter", function(d) {

		console.log(d.properties.Address);
		
		tooltip.html(d.properties.Address)
		.transition()
		.duration(1000)
		.style("opacity", .9)
		.style("left", (d3.mouse(this)[0]-510) + "px") 
		.style("top", (d3.mouse(this)[1]-14000) + "px")
		//.html(+d.properties.Address);

		d3.select(this)
			.attr("opacity", 0.7);
	
	}).on("mouseleave", function() {
		tooltip.style("opacity", 0);



		d3.select(this)
			.attr("opacity", 1);

	})    

	
		
	var svgs = []
	for (i = 0; i < n1.length; i++) {
		svgs[i] = d3.select("#list")
			.append("svg")
			.attr("id", "svg" + i)
			.attr("width", width/10)
			.attr("height", height/10)

		var geo  =  {type: "FeatureCollection",  features: n1[i].values};

		var path = d3.geoPath()
				.projection(d3.geoTransverseMercator()
				.fitExtent([[10, 10], [width/10, height/10]], geo));

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

		console.log(clickNumber);
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

			tooltip.style("opacity", 0);

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

			tooltip.style("opacity", 1);
			
			}
		
		}
	});
});