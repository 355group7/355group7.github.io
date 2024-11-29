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
        image: "path/to/image1.jpg",
        text: "This is the content for Button 1."

    },
    1: {
        image: "path/to/image2.jpg",
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
            <img src="${content.image}" alt="Popup Image" style="width:100px; height:auto; margin-bottom:10px;">
            <p>${content.text}</p>
        `;

        // Position the popup box to the left of the button
        const rect = button.getBoundingClientRect();
        popupBox.style.position = "absolute";
        popupBox.style.top = `${rect.top}px`;
        popupBox.style.left = `${rect.left - popupBox.offsetWidth - 10}px`;


    });
});

async function render() {
    const data = await d3.csv("assets/starter_pokemon_rankings_with_evolution (1).csv");

    const pokemonData2 = data.filter(
        d => d.evolution_stage === "Base" && d.region !== "Overall"
    );

    const vlSpec1 = vl
    
        .markBar()
        .data(pokemonData2)
        
        .encode(
            vl.x().fieldO("evolution_stage").title("Evolution Stage"),
            vl.y().fieldO("ranking").title("Ranking").sort("ascending"),
            vl.color().fieldN("type").title("Type").scale({
                domain: ["Water", "Grass", "Fire"],
                range: ["#1f77b4", "#2ca02c", "#d62728"],
            }),
            vl.column().fieldN("region").title("Region")
        )
        .width(60)
        .height(400)
        .toSpec();
    await vegaEmbed("#view1", vlSpec1); // Ensure #view1 exists in visualization.html
}

//render();
document.querySelector(".arrow-button[style='--index: 0;']").addEventListener("click", () => {
    render();
});
