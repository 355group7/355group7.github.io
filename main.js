import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let data; 
let svg, regionGroup;
let xScale, yScale, colorScale;
let xAxis, yAxis;
let regions, maxRanking;
let pokemondata, pokemondata1;


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
const buttonContent = {
    0: {
        text: "This is the description about vis 1."

    },
    1: {
        // image: "path/to/image2.jpg",
        text: "This is the content for Button 2."
    },
    2: {
        image: "path/to/image3.jpg",
        text: "This is the content for Button 3."
    },
    3: {
        image: "path/to/image4.jpg",
        text: "This is the content for Button 4."
    },
    4: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 5."
    },
    5: {
        image: "path/to/image6.jpg",
        text: "This is the content for Button 6."
    },
    6: {
        image: "path/to/image7.jpg",
        text: "This is the content for Button 7."
    },
    7: {
        image: "path/to/image8.jpg",
        text: "This is the content for Button 8."
    },
    8: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 9."
    },
    9: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 10."
    },
    10: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 11."
    },
    11: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 12."
    },
    12: {
        image: "path/to/image5.jpg",
        text: "This is the content for Button 13."
    }
};

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

// async function render() {
//     const data = await d3.csv("assets/starter_pokemon_rankings_with_evolution (1).csv");

//     const pokemonData2 = data.filter(
//         d => d.evolution_stage === "Base" && d.region !== "Overall"
//     );

//     const vlSpec1 = vl

//         .markPoint()
//         .data(pokemonData2)
//         .encode(
//             vl.x().fieldO("evolution_stage").title("evolution_stage"),
//             vl.y().fieldQ("ranking").title("Ranking").sort("descending"), // Ranking on y-axis
//             vl.color().fieldN("type").title("Type").scale({
//                 domain: ["Water", "Grass", "Fire"],
//                 range: ["#1f77b4", "#2ca02c", "#d62728"]
//             }),
//             vl.column().fieldN("region").title("Region")
//         )
//         .width(60)
//         .height(400)
//         .toSpec();
//     await vegaEmbed("#view1", vlSpec1); // Ensure #view1 exists in visualization.html
// }

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
    pokemondata1 = await d3.csv("assets/355M1.csv", d3.autoType);
    console.log(pokemondata1);
    // Filter dataset
    pokemondata1 = pokemondata1.filter(
    (d) => d.evolution_stage === "Base" && d.region !== "Overall"
  );

  // Convert votes to a number
  pokemondata1.forEach(d => {
    d.votes = +d.votes; });
  

  // Group data by region
  const regions = Array.from(new Set(pokemondata1.map(d => d.region)));

  // Define dimensions
  const margin = { top: 50, right: 30, bottom: 60, left: 50 };
  const width = 800;
  const height = 400;
  const chartWidth = (width - margin.left - margin.right) / regions.length;
  const chartHeight = height - margin.top - margin.bottom;


  svg = d3
  .select("#view")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(0, 50)"); 

// Scales
const xScale = d3.scalePoint()
.domain(pokemondata1.map(d => d["pokemon"]))
.range([0, chartWidth]);

const yScale = d3.scaleLinear()
.domain([0, d3.max(pokemondata1, d => d.votes)]) 
.range([chartHeight, 0])
.nice();

const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
.domain([...new Set(pokemondata1.map(d => d.region))]);

const shapeScale = d3.scaleOrdinal(d3.symbols)
.domain([...new Set(pokemondata1.map(d => d.tail))]);

const shapeGenerator = d3.symbol().size(100);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g")
    .call(d3.axisLeft(yScale));

// Group data by region for line creation
const nestedData = d3.group(pokemondata1, d => d.region);

// Draw lines for each region
nestedData.forEach((regionData, region) => {
  const line = d3.line()
    .x(d => xScale(d["pokemon"]))
    .y(d => yScale(d.votes));

  svg.append("path")
    .datum(regionData)
    .attr("fill", "none")
    .attr("stroke", colorScale(region))
    .attr("stroke-width", 2)
    .attr("d", line);
});

// Draw shapes (points) for each Pokémon
svg.selectAll(".point")
  .data(pokemondata1)
  .enter()
  .append("path")
  .attr("d", d => shapeGenerator.type(shapeScale(d.tail))())
  .attr("transform", d => `translate(${xScale(d["pokemon name"])},${yScale(d.votes)})`)
  .attr("fill", d => colorScale(d.region));
};

//render();

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
      .attr("opacity", 0.8);
  
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
      .attr("stroke-width", 2);
  
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
      .attr("opacity", 0.8);
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
