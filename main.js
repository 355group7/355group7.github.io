import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let data; 
let svg, regionGroup;
let xScale, yScale, colorScale;
let xAxis, yAxis;
let regions, maxRanking;
let pokemondata;


// Add event listener for the Pokemon title
document.querySelector(".sidebar h1").addEventListener("click", function () {
    // Redirect to the front page (index.html)
    window.location.href = "index.html"; // Replace with your front page file
});
// Add event listener for the Pokemon title
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

function drawPokeballWithButtons() {
  // Select the container for the Poké Ball
  const container = d3.select("#poke-ball-container")
    .style("position", "relative")
    .style("width", "100%")
    .style("height", "100%");

  // Create an SVG inside the container
  const svg = container.append("svg")
    .attr("width", "100vw") 
    .attr("height", "100vh") 
    .style("position", "absolute");

  // Define constants for size calculations
  const pokeBallSize = window.innerWidth * 0.24;
  const centerCircleSize = pokeBallSize / 4;
  const borderWidth = pokeBallSize / 20;

  // Group for Poké Ball and buttons
  const pokeBallGroup = svg.append("g")
    .attr("class", "poke-ball-group")
    .attr("transform", `translate(${window.innerWidth / 1.25}, ${window.innerHeight / 2})`);

  // Draw the Poké Ball
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

  // Draw the Arrow Buttons
  const arrowButtonData = [
    { index: 0, label: "Vis1", xOffset: -pokeBallSize / 1.8, yOffset: -pokeBallSize / 4 },
    { index: 1, label: "Vis2", xOffset: -pokeBallSize / 1.8, yOffset: -pokeBallSize / 8 },
    { index: 2, label: "Vis3", xOffset: -pokeBallSize / 1.8, yOffset: pokeBallSize / 8 },
    { index: 3, label: "Vis4", xOffset: -pokeBallSize / 1.8, yOffset: pokeBallSize / 4 },
  ];

  const arrowButtons = pokeBallGroup.selectAll(".arrow-button")
    .data(arrowButtonData)
    .enter()
    .append("g")
    .attr("class", "arrow-button")
    .attr("transform", d => `translate(${d.xOffset - 300}, ${d.yOffset})`)
    .on("click", (event, d) => {
      console.log(`Button ${d.label} clicked`);
      // Trigger visualization functions
      if (d.index === 0) visuals0();
      if (d.index === 1) visuals1();
      if (d.index === 2) visuals2();
      if (d.index === 3) visuals3();
    });

  // Add Button Shapes
  arrowButtons.append("rect")
    .attr("x", 0)
    .attr("y", -10)
    .attr("width", 18 * 16) // 18rem equivalent
    .attr("height", 20) // Height of the button
    .attr("fill", "#232323")
    .attr("rx", 5); // Rounded corners

  // Add Button Labels
  arrowButtons.append("text")
    .attr("x", 18 * 8) // Center text in button (half of 18rem)
    .attr("y", 5)
    .attr("fill", "#ffffff")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text(d => d.label);
}
drawPokeballWithButtons();

// Add event listeners to each arrow-button
document.querySelectorAll(".arrow-button").forEach((button, index) => {
    const arrow = document.querySelector(`.arrow:nth-of-type(${index + 1})`);

    // Hover effect: temporarily move the button and arrow
    button.addEventListener("mouseenter", () => {
        if (button !== activeButton && arrow) {
            arrow.style.transform = "translateX(-40px)";
            button.style.transform = "translateX(-20px)";
        }
    });

    // Reset position on mouse leave if not active
    button.addEventListener("mouseleave", () => {
        if (button !== activeButton && arrow) {
            arrow.style.transform = ""; // Reset arrow
            button.style.transform = ""; // Reset button
        }
    });

    // Click event: make the button and arrow move permanently until another is clicked
    button.addEventListener("click", () => {
        // If there was a previously active button, reset its transformation and remove the box
        if (activeButton && activeButton !== button) {
            const activeArrow = document.querySelector(
                `.arrow:nth-of-type(${Array.from(document.querySelectorAll(".arrow-button")).indexOf(activeButton) + 1})`
            );
            if (activeArrow) activeArrow.style.transform = ""; // Reset previous arrow
            activeButton.style.transform = ""; // Reset previous button
            document.querySelector(".popup-box")?.remove(); // Remove previous popup
        }

        // Set the current button as active
        activeButton = button;

        // Apply the transformation continuously
        if (arrow) {
            arrow.style.transform = "translateX(-40px)";
            button.style.transform = "translateX(-20px)";
        }

        // Create and display the popup box
        let popupBox = document.querySelector(".popup-box");
        if (!popupBox) {
            popupBox = document.createElement("div");
            popupBox.className = "popup-box";
            document.body.appendChild(popupBox);
        }

        // Set the content of the popup box
        const content = buttonContent[index];
        popupBox.innerHTML = `
            <p>${content.text}</p>
        `;

        // Position the popup box to the left of the button
        const rect = button.getBoundingClientRect();
        popupBox.style.position = "absolute";
        popupBox.style.top = `${rect.top}px`;
        popupBox.style.left = `${rect.left - popupBox.offsetWidth - 10}px`;
    });
});



async function visuals0() {
  pokemondata = await d3.csv("assets/starter_pokemon_rankings_with_evolution (1).csv", d3.autoType);
  console.log(pokemondata);

  pokemondata = pokemondata.filter(
    (d) => d.evolution_stage === "Base" && d.region !== "Overall"
  );

  const regions = Array.from(new Set(pokemondata.map(d => d.region)));

  const margin = { top: 50, right: 30, bottom: 60, left: 50 };
  const width = 800;
  const height = 400;
  const chartWidth = (width - margin.left - margin.right) / regions.length;
  const chartHeight = height - margin.top - margin.bottom;

  svg = d3
  .select("#view")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  const xScale = d3.scalePoint().domain(["Base"]).range([0, chartWidth]);
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(pokemondata, d => d.ranking)])
    .range([0, chartHeight])
    .nice();
  const colorScale = d3.scaleOrdinal(["Water", "Grass", "Fire"], ["#1f77b4", "#2ca02c", "#d62728"]);

  regions.forEach((region, i) => {
    const regionData = pokemondata.filter(d => d.region === region);

    const regionGroup = svg.append("g")
      .attr("transform", `translate(${margin.left + i * chartWidth}, ${margin.top})`);

    regionGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale));

    regionGroup.append("g").call(d3.axisLeft(yScale));

    regionGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Evolution Stage");

    regionGroup.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")
      .text(region);

    regionGroup.selectAll("circle")
      .data(regionData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.evolution_stage))
      .attr("cy", d => yScale(d.ranking))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.type))
      .attr("opacity", 0.7)
      .on("mouseover", (event, d) => console.log(d));
  });
}

async function visuals1() {
  const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

  // Filter dataset for base evolution stage
  const filteredData = pokemondata.filter(
    (d) => d.evolution_stage === "base" && d.region !== "Overall"
  );
  
  // Dimensions
  const margin = { top: 50, right: 30, bottom: 60, left: 50 };
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

async function visuals2() {
    const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

    // Filter dataset for base evolution stage and valid regions
    const filteredData = pokemondata.filter(
      d => d.evolution_stage === "base" && d.region !== "Overall"
    );
  
    // Set dimensions
    const margin = { top: 50, right: 30, bottom: 60, left: 50 };
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
      .text("Regions");
  
    svg.append("text")
      .attr("x", -chartHeight / 2)
      .attr("y", -margin.left + 10)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Votes");

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
  
    ["fire", "water", "grass"].forEach((type, i) => {
      legend.append("path")
        .attr("transform", `translate(0, ${i * 20})`)
        .attr("d", d3.symbol().type(shapeMap[type] === "triangle" ? d3.symbolTriangle :
          shapeMap[type] === "circle" ? d3.symbolCircle : d3.symbolSquare).size(100)())
        .attr("fill", colorScale(type));
  
      legend.append("text")
        .attr("x", 15)
        .attr("y", i * 20 + 5)
        .text(type)
        .attr("alignment-baseline", "middle");
    });
  }

  async function visuals3() {
    const pokemondata = await d3.csv("assets/355M1.csv", d3.autoType);

    // Filter dataset for base evolution stage
    const filteredData = pokemondata.filter(
      (d) => d.evolution_stage === "base" && d.region !== "Overall"
    );
  
    // Set dimensions
    const margin = { top: 50, right: 30, bottom: 60, left: 70 };
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
      .call(xAxis);
  
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
  
    // Add legend for regions
    const legend = svg
      .append("g")
      .attr("transform", `translate(${chartWidth - 50}, 0)`);
  
    [...regions.keys()].forEach((region, i) => {
      legend
        .append("rect")
        .attr("x", 0)
        .attr("y", i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale(region));
  
      legend
        .append("text")
        .attr("x", 20)
        .attr("y", i * 20 + 12)
        .text(region)
        .attr("font-size", "12px")
        .attr("alignment-baseline", "middle");
    });
  
    // Add points on the lines
    svg.selectAll(".point")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d["pokemon"]))
      .attr("cy", (d) => yScale(d.votes))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.region))
      .attr("opacity", 0.8)
      .on("mouseover", function (event, d) {
        // Create a PNG image element dynamically using the image field from the data
        svg.append("image")
          .attr("cx", xScale(d.region) - 20) // Adjust the position of the PNG image
          .attr("cy", yScale(d.votes) - 70) // Position the image above the point
          .attr("width", 60)               // Set image width
          .attr("height", 60)              // Set image height
          .attr("href", `assets/${d.image}`) // Dynamically fetch the image path from data
          .attr("class", "hover-image");   // Add a class for easy selection
      })
      .on("mouseout", function () {
        // Remove the PNG image on mouseout
        svg.selectAll(".hover-image").remove();   });
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
