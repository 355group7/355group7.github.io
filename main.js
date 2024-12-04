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

async function visuals() {
    pokemondata = await d3.csv("assets/starter_pokemon_rankings_with_evolution (1).csv", d3.autoType);
    console.log(pokemondata);
    // Filter dataset
    pokemondata = pokemondata.filter(
    (d) => d.evolution_stage === "Base" && d.region !== "Overall"
  );

  

  // Group data by region
  const regions = Array.from(new Set(pokemondata.map(d => d.region)));

  // Define dimensions
  const margin = { top: 50, right: 30, bottom: 60, left: 50 };
  const width = 800;
  const height = 400;
  const chartWidth = (width - margin.left - margin.right) / regions.length;
  const chartHeight = height - margin.top - margin.bottom;


  svg = d3
  .select("#view1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(0, 50)"); 

// Scales
const xScale = d3.scalePoint()
.domain(["Base"]) 
.range([0, chartWidth]);

const yScale = d3.scaleLinear()
.domain([0, d3.max(pokemondata, d => d.ranking)]) 
.range([chartHeight, 0])
.nice();

const colorScale = d3.scaleOrdinal()
.domain(["Water", "Grass", "Fire"])
.range(["#1f77b4", "#2ca02c", "#d62728"]);

// Draw for each region
regions.forEach((region, i) => {
    const regionData = pokemondata.filter(d => d.region === region);

    // Group for region
    const regionGroup = svg.append("g")
        .attr("transform", `translate(${margin.left + i * chartWidth}, ${margin.top})`);

    // Axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Append axes
    regionGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis);

    regionGroup.append("g")
        .call(yAxis);

    // Add axis titles
    regionGroup.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + 40)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .text("Evolution Stage");

    regionGroup.append("text")
        .attr("x", -chartHeight / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        // .text("Ranking");

    // Add title for region
    regionGroup.append("text")
        .attr("x", chartWidth / 2)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(region);

    // Add points
    regionGroup.selectAll("circle")
        .data(regionData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.evolution_stage))
        .attr("cy", d => yScale(d.ranking))
        .attr("r", 5)
        .attr("fill", d => colorScale(d.type))
        .attr("opacity", 0.7)
        .on("mouseover", (event, d) => {
            // Add tooltip logic here
            console.log(d); // Debugging hover data
        });
});
}

//render();


async function runApp() {
    document.querySelector(".arrow-button[style='--index: 0;']").addEventListener("click", () => {
        visuals();
        console.log("Visualization rendered!");
    });
  }

  runApp();
