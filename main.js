import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let data; 
let svg, regionGroup;
let xScale, yScale, colorScale;
let xAxis, yAxis;
let regions, maxRanking;
let pokemondata;

//title
document.querySelector(".sidebar h1").addEventListener("click", function () {
    // Redirect to the front page (index.html)
    window.location.href = "index.html"; // Replace with your front page file
});

// Keep track of the currently active button
let activeButton = null;

// Define the content for each button
// const buttonContent = {
//     0: {
//         text: "This is the description about vis 1."

//     },
//     1: {
//         text: "This is the content for Button 2."
//     },
//     2: {
//         image: "path/to/image3.jpg",
//         text: "This is the content for Button 3."
//     },
//     3: {
//         image: "path/to/image4.jpg",
//         text: "This is the content for Button 4."
//     },
//     4: {
//         image: "path/to/image5.jpg",
//         text: "This is the content for Button 5."
//     }
// };

// Create a description box dynamically
const descriptionBox = d3.select("body")
  .append("div")
  .attr("id", "description-box")
  .style("position", "absolute")
  .style("bottom", "20px") // Distance from bottom
  .style("left", "20vw")  // Align to the right side
  .style("width", "500px")
  .style("padding", "10px")
  .style("background-color", "rgba(255, 255, 255, 0.8)")
  .style("border", "1px solid #ccc")
  .style("border-radius", "8px")
  .style("box-shadow", "0 2px 5px rgba(0,0,0,0.3)")
  .style("font-size", "18px")
  .style("color", "#333")
  .style("display", "none"); // Initially hidden



  function setDescription(text) {
    descriptionBox
      .html(text)
      .style("display", "block"); // Show the description box
  }
  
function drawPokeballWithButtons() {
  //draw in what section
  const container = d3.select("#poke-ball-container")
    .style("position", "relative")
    .style("width", "100%")
    .style("height", "100vh");

  // Create an SVG inside the container
  const svg = container.append("svg")
    .attr("width", "100%") 
    .attr("height", "100%") 
    .style("position", "absolute");

  //sizes
  const pokeBallSize = Math.min(window.innerWidth, window.innerHeight) * 0.28;
  const centerX = window.innerWidth * 0.8; 
  const centerY = window.innerHeight * 0.5; 
  const arrowButtonOffset = pokeBallSize / 2; 
  const centerCircleSize = pokeBallSize / 4;
  const borderWidth = pokeBallSize / 20;

  // Group for pokeball and buttons
  const pokeBallGroup = svg.append("g")
    .attr("class", "poke-ball-group")
    .attr("transform", `translate(${centerX}, ${centerY})`);

  // Draw the ball
  pokeBallGroup.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", pokeBallSize / 2)
    .attr("fill", "#d16533")
    .attr("stroke", "#232323")
    .attr("stroke-width", borderWidth);

  const arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(pokeBallSize / 2)
  .startAngle(-Math.PI/2)
  .endAngle(-Math.PI *1.5);

  pokeBallGroup.append("path")
  .attr("d", arcGenerator)
  .attr("fill", "#ffffff")
  .attr("stroke", "#232323")
  .attr("stroke-width", borderWidth);

  pokeBallGroup.append("rect")
    .attr("x", -pokeBallSize / 2)
    .attr("y", -borderWidth / 2)
    .attr("width", pokeBallSize)
    .attr("height", borderWidth)
    .attr("fill", "#232323");

  pokeBallGroup.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", centerCircleSize / 2)
    .attr("fill", "#ffffff")
    .attr("stroke", "#232323")
    .attr("stroke-width", borderWidth / 2);

  // Draw the arrow buttons
  const arrowButtonData = [
    { index: 0, label: "Vis1", xOffset: -arrowButtonOffset, yOffset: -pokeBallSize / 4 },
    { index: 1, label: "Vis2", xOffset: -arrowButtonOffset, yOffset: -pokeBallSize / 8 },
    { index: 2, label: "Vis3", xOffset: -arrowButtonOffset, yOffset: pokeBallSize / 8 },
    { index: 3, label: "Vis4", xOffset: -arrowButtonOffset, yOffset: pokeBallSize / 4 },
  ];

  const arrowButtons = pokeBallGroup.selectAll(".arrow-button")
    .data(arrowButtonData)
    .enter()
    .append("g")
    .attr("class", "arrow-button")
    .attr("transform", d => `translate(${d.xOffset - 300}, ${d.yOffset})`)
    .on("click", (event, d) => {
      // Clear the visualization container
      d3.select("#view").html("");

      // Trigger visualization functions
      if (d.index === 0) visuals0();
      if (d.index === 1) visuals1();
      if (d.index === 2) visuals2();
      if (d.index === 3) visuals3();
    });

  // Add button shapes
  arrowButtons.append("rect")
    .attr("x", 30)
    .attr("y", -10)
    .attr("width", 14 * 16) 
    .attr("height", 25) 
    .attr("fill", "#232323")
    .attr("rx", 5); // Rounded corners

  // Add Button labels (texts)
  arrowButtons.append("text")
    .attr("x", 14 * 10) 
    .attr("y", 5)
    .attr("fill", "#ffffff")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text(d => d.label);
}


drawPokeballWithButtons();

async function visuals0() {

  setDescription("This dot chart shows the votes for the three Pokémon in each region in 2019. Each region has a total of 950 votes, one for each of the three attributes of the original Pokémon.");

  const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

  // Filter dataset for base evolution stage and valid regions
  const filteredData = pokemondata.filter(
    d => d.evolution_stage === "base" && d.region !== "Overall"
  );

  // Set dimensions
  const margin = { top: 60, right: 40, bottom: 60, left: 50 };
  const width = 800;
  const height = 500;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Append SVG container
  const svg = d3
    .select("#view")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Scales
  const xScale = d3.scalePoint()
    .domain([...new Set(filteredData.map(d => d.region))])
    .range([chartWidth * 0.05, chartWidth * 0.8]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.votes)])
    .range([chartHeight, 0])
    .nice();

  const colorScale = d3.scaleOrdinal()
    .domain(["fire", "water", "grass"])
    .range(["red", "blue", "green"]);

  const sizeScale = d3.scaleLinear()
    .domain([d3.min(filteredData, d => d.votes), d3.max(filteredData, d => d.votes)])
    .range([4, 12]);

  const shapeMap = {
    fire: "triangle",
    water: "circle",
    grass: "square"
  };

  // Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

    svg.selectAll(".x-grid-line")
    .data(xScale.domain())
    .enter()
    .append("line")
    .attr("class", "x-grid-line")
    .attr("x1", d => xScale(d)) // Starting x position
    .attr("x2", d => xScale(d)) // Ending x position
    .attr("y1", 0)              // Starting y position (top of the chart)
    .attr("y2", chartHeight)    // Ending y position (bottom of the chart)
    .attr("stroke", "gray")     // Line color
    .attr("stroke-dasharray", "4 4") // Dashed line style
    .attr("stroke-opacity", 0.5);    // Optional: reduce opacity for aesthetics

  // Add axis labels
  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .text("Regions in Pokemon World");

  svg.append("text")
    .attr("x", -chartHeight / 2)
    .attr("y", -margin.left + 10)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("fav pokemon Votes in 2019");

  // Points
  svg.selectAll(".point")
  .data(filteredData)
  .enter()
  .append("image")
  .attr("x", d => xScale(d.region) - 10) // Adjust x position to center the image
  .attr("y", d => yScale(d.votes) - 10) // Adjust y position to center the image
  .attr("width", 20)                    // Set the image width
  .attr("height", 20)                   // Set the image height
  .attr("href", d => `assets/images/${d.type}.png`) // Dynamically load the image based on type
  .attr("opacity", 1);

// Add a group to hold the points and the PNGs
const pointsGroup = svg.append("g").attr("class", "points-group");

pointsGroup.selectAll(".point")
.data(filteredData)
.enter()
.append("path")
.attr("transform", d => `translate(${xScale(d.region)}, ${yScale(d.votes)})`)
.attr("d", d => {
  const size = sizeScale(d.votes);
  if (shapeMap[d.type] === "circle") {
    return d3.symbol().type(d3.symbolCircle).size(size * 20)();
  } else if (shapeMap[d.type] === "triangle") {
    return d3.symbol().type(d3.symbolTriangle).size(size * 20)();
  } else if (shapeMap[d.type] === "square") {
    return d3.symbol().type(d3.symbolSquare).size(size * 20)();
  }
})
.attr("fill", d => colorScale(d.type))
.attr("opacity", 0)
.on("mouseover", function (event, d) {
  // Create a PNG image element dynamically using the image field from the data
  svg.append("image")
    .attr("x", xScale(d.region) - 20) // Adjust the position of the PNG image
    .attr("y", yScale(d.votes) - 70) // Position the image above the point
    .attr("width", 60)               // Set image width
    .attr("height", 60)              // Set image height
    .attr("href", `assets/${d.image}`) // Dynamically fetch the image path from data
    .attr("class", "hover-image");   // Add a class for easy selection
})
.on("mouseout", function () {
  // Remove the PNG image on mouseout
  svg.selectAll(".hover-image").remove();
});

// Add legend
const legend = svg.append("g")
.attr("transform", `translate(${chartWidth - 50}, ${margin.top})`);

// Mapping icons to types
const iconMap = {
fire: "assets/images/fire.png",   // Replace with the actual path to your fire icon
water: "assets/images/water.png", // Replace with the actual path to your water icon
grass: "assets/images/grass.png"  // Replace with the actual path to your grass icon
};

["fire", "water", "grass"].forEach((type, i) => {
// Add image for each type
legend.append("image")
  .attr("x", 0)
  .attr("y", i * 40) // Vertical spacing
  .attr("width", 20) // Set icon width
  .attr("height", 20) // Set icon height
  .attr("href", iconMap[type]); // Load image dynamically based on type

// Add text label next to the image
legend.append("text")
  .attr("x", 30) // Position to the right of the image
  .attr("y", i * 40 + 15) // Align vertically with the icon
  .text(type.charAt(0).toUpperCase() + type.slice(1)) // Capitalize first letter
  .attr("alignment-baseline", "middle")
  .style("font-size", "14px");
});
}

async function visuals1() {
  setDescription("This dot chart shows the votes for the three Pokémon in each region in 2020. ");

  const pokemondata = await d3.csv("assets/starter_pokemon_rankings_with_evolution (1).csv", d3.autoType);

  // Normalize type values
  const filteredData = pokemondata.filter(
      d => d.evolution_stage === "Base" && d.region !== "Overall"
  ).map(d => ({
      ...d,
      type: d.type.trim().toLowerCase() // Clean type values
  }));

  const margin = { top: 60, right: 60, bottom: 60, left: 60 };
  const width = 800;
  const height = 500;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3
    .select("#view")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scalePoint()
    .domain(["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar"])
    .range([chartWidth * 0.05, chartWidth * 0.8]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.votes)])
    .range([chartHeight, 0])
    .nice();

  const iconMap = {
    fire: "assets/images/fire.png",
    water: "assets/images/water.png",
    grass: "assets/images/grass.png",
  };

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.selectAll(".x-grid-line")
    .data(xScale.domain())
    .enter()
    .append("line")
    .attr("class", "x-grid-line")
    .attr("x1", d => xScale(d))
    .attr("x2", d => xScale(d))
    .attr("y1", 0)
    .attr("y2", chartHeight)
    .attr("stroke", "gray")
    .attr("stroke-dasharray", "4 4")
    .attr("stroke-opacity", 0.5);

  svg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .text("Regions in Pokemon World");

  svg.append("text")
    .attr("x", -chartHeight / 2)
    .attr("y", -margin.left + 10)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Pokemon Votes");

    svg.selectAll(".point")
    .data(filteredData)
    .enter()
    .append("image")
    .attr("x", d => xScale(d.region) - 10)
    .attr("y", d => yScale(d.votes) - 10)
    .attr("width", 20)
    .attr("height", 20)
    .attr("href", d => `assets/images/${d.type}.png`)
    .attr("opacity", 1)
    .on("mouseover", function (event, d) {
      svg.append("image")
        .attr("x", xScale(d.region) - 20)
        .attr("y", yScale(d.votes) - 70)
        .attr("width", 60)
        .attr("height", 60)
        .attr("href", `assets/${d.image}`)
        .attr("class", "hover-image");
    })
    .on("mouseout", function () {
      svg.selectAll(".hover-image").remove();
    });

    // Add legend
const legend = svg.append("g")
.attr("transform", `translate(${chartWidth + 40}, ${margin.top})`);

// Legend entries for Fire, Water, and Grass
const legendData = [
{ type: "fire", label: "Fire" },
{ type: "water", label: "Water" },
{ type: "grass", label: "Grass" },
];

legendData.forEach((item, i) => {
// Icon
legend.append("image")
  .attr("x", -80)
  .attr("y", i * 40)
  .attr("width", 20)
  .attr("height", 20)
  .attr("href", iconMap[item.type]);

// Text label
legend.append("text")
  .attr("x", -50)
  .attr("y", i * 40 + 15)
  .text(item.label)
  .attr("alignment-baseline", "middle")
  .style("font-size", "14px")
  .style("fill", "#000");
});
}

async function visuals2() {
  setDescription("This dot chart shows how the overall appearance design of the three Pokémons affected players' choices in 2019. Each region has a total of 950 votes, one for each of the three attributes of the original Pokémon. According to the Pokémon Encyclopedia, the table divides the three Pokémons into five types of size.");

  const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

  // Filter dataset for base evolution stage
  const filteredData = pokemondata.filter(
    (d) => d.evolution_stage === "base" && d.region !== "Overall"
  );
  
  // Dimensions
  const margin = { top: 60, right: 200, bottom: 60, left: 50 };
  const width = 800;
  const height = 500;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Scales
  const xScale = d3.scalePoint()
    .domain([...new Set(filteredData.map(d => d.pokemon))])  // Use 'pokemon' for the x-axis
    .range([0, chartWidth])
    .padding(0.5);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.votes)])  // Use 'votes' for the y-axis
    .range([chartHeight, 0]);  // Invert the scale (higher votes at the top)

  const sizeScale = d3.scaleLinear()
    .domain(d3.extent(filteredData, d => d.votes))
    .range([4, 12]);

  const colorScale = d3.scaleOrdinal()
    .domain([...new Set(filteredData.map(d => d["Body shape"]))])
    .range(d3.schemeTableau10);
  
  // Mapping body shapes to image paths
  const shapeImageMap = {
    "with bipedal": "assets/images/with bipedal.png",
    "with quadrup": "assets/images/with quadrup.png",
    "with a head and legs": "assets/images/with a head and legs.png",
    "with fins": "assets/images/with fin.png",
    "with wing": "assets/images/with wing.png"
  };

  // Append SVG container
  const svg = d3
    .select("#view")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Axes
  svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g")
    .call(d3.axisLeft(yScale));
  
  // Points (using images for different Body shapes)
  svg.selectAll(".point")
    .data(filteredData)
    .enter()
    .append("image")
    .attr("class", "point")
    .attr("x", d => xScale(d.pokemon) - 20)  // Adjust image position (use 'pokemon' for x)
    .attr("y", d => yScale(d.votes) - 20) // Adjust image position (use 'votes' for y)
    .attr("width", 40)  // Set image width
    .attr("height", 40) // Set image height
    .attr("href", d => shapeImageMap[d["Body shape"]])  // Set the image source based on Body shape
    .attr("opacity", 0.8);

  // Add Legend (if desired, to show Body shape -> image mapping)
  const legend = svg.append("g")
    .attr("transform", `translate(${chartWidth + 20}, 20)`);

  Object.entries(shapeImageMap).forEach(([shape, imagePath], i) => {
    legend.append("image")
      .attr("x", 0)
      .attr("y", i * 40)
      .attr("width", 20)
      .attr("height", 20)
      .attr("href", imagePath);
    
    legend.append("text")
      .attr("x", 30)
      .attr("y", i * 40 + 10)
      .text(shape)
      .attr("alignment-baseline", "middle");
  });

  // Hover effect to show image
  svg.selectAll(".point")
    .on("mouseover", function(event, d) {
      svg.append("image")
        .attr("x", xScale(d.pokemon) - 20)
        .attr("y", yScale(d.votes) - 70)
        .attr("width", 60)
        .attr("height", 60)
        .attr("href", `assets/${d.image}`)
        .attr("class", "hover-image");
    })
    .on("mouseout", function() {
      svg.selectAll(".hover-image").remove();
    });
  }

  async function visuals3() {
    setDescription("This chart shows how the design of the tails of the three Pokémons affected players' choices in 2019. Each region has a total of 950 votes, which are voted for the three types of initial Pokémon. According to the Pokémon Pokédex, the table uses solid points to indicate that Pokémons have tails, and hollow circles to indicate that Pokémons do not have tails.");

    const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

    // Filter dataset for base evolution stage
    const filteredData = pokemondata.filter(
      (d) => d.evolution_stage === "base" && d.region !== "Overall"
    );
  
    // Set dimensions
    const margin = { top: 60, right: 30, bottom: 60, left: 70 };
    const width = 800;
    const height = 500;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
  
    // Append SVG container
    const svg = d3
      .select("#view")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Scales
    const xScale = d3.scalePoint()
      .domain([...new Set(filteredData.map((d) => d["pokemon"]))]) // Unique Pokémon names
      .range([0, chartWidth])
      .padding(0.5);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.votes)]) // Votes range
      .range([chartHeight, 0])
      .nice();
  
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(filteredData.map((d) => d.region))]) // Unique regions
      .range(d3.schemeCategory10);
  
    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");
  
    svg.append("g").call(yAxis);
  
    // Add axis labels
    svg.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Pokemon");
  
    svg.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Votes");
  
    // Line generator
    const line = d3
      .line()
      .x((d) => xScale(d["pokemon"])) // Map x position to Pokémon names
      .y((d) => yScale(d.votes)) // Map y position to votes
      .curve(d3.curveMonotoneX); // Smooth lines
  
    // Group data by region for separate lines
    const regions = d3.group(filteredData, (d) => d.region);
  
    // Draw lines
    svg.selectAll(".line")
      .data(regions)
      .enter()
      .append("path")
      .attr("d", ([, values]) => line(values)) // Generate the path
      .attr("fill", "none")
      .attr("stroke", ([region]) => colorScale(region)) // Color by region
      .attr("stroke-width", 2)

// Add points on the lines
svg.selectAll(".point")
  .data(filteredData)
  .enter()
  .append("circle")
  .attr("cx", (d) => xScale(d["pokemon"]))
  .attr("cy", (d) => yScale(d.votes))
  .attr("r", 5)
  .attr("fill", (d) => (d.tail === 1 ? colorScale(d.region) : "rgba(0, 0, 0, 0.1)")) // Solid for tail, transparent for hollow
  .attr("stroke", (d) => colorScale(d.region)) // Stroke matches region color
  .attr("stroke-width", (d) => (d.tail === 1 ? 0 : 2)) // Hollow points have a stroke
  .attr("opacity", 0.8)
  .on("mouseover", function (event, d) {
    // Create a PNG image element dynamically using the image field from the data
    svg.append("image")
      .attr("x", xScale(d["pokemon"]) - 30) // Adjust the x position of the PNG image
      .attr("y", yScale(d.votes) - 70)     // Adjust the y position of the PNG image
      .attr("width", 60)                   // Set image width
      .attr("height", 60)                  // Set image height
      .attr("href", `assets/${d.image}`)   // Dynamically fetch the image path from data
      .attr("class", "hover-image");       // Add a class for easy selection
  })
  .on("mouseout", function () {
    // Remove the PNG image on mouseout
    svg.selectAll(".hover-image").remove();
  });


 // Add Region Name labels above each group of Pokémon
 [...regions.keys()].forEach((region, i) => {
   const avgX = d3.mean(regions.get(region), (d) => xScale(d["pokemon"])); // Find the average x position for the region
   svg.append("text")
     .attr("x", avgX) // Position the label based on the average x of the region
     .attr("y", -10) // Position above the points
     .attr("text-anchor", "middle")
     .text(region)
     .attr("font-size", "14px")
     .attr("fill", colorScale(region));
 });
}

async function runApp() {
    document.querySelector(".arrow-button[style='--index: 0;']").addEventListener("click", () => {
        visuals0();
        console.log("Visualization rendered!");
    });

    document.querySelector(".arrow-button[style='--index: 1;']").addEventListener("click", () => {
        visuals1();
        console.log("Visualization rendered!");
    });
    document.querySelector(".arrow-button[style='--index: 2;']").addEventListener("click", () => {
        visuals2();
        console.log("Visualization rendered!");
    });
    document.querySelector(".arrow-button[style='--index: 3;']").addEventListener("click", () => {
        visuals3();
        console.log("Visualization rendered!");
    });
  }

  runApp();
