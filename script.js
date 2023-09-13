const expressionInput1 = document.getElementById("expressionInput1");
const expressionInput2 = document.getElementById("expressionInput2");
const plotButton = document.getElementById("plotButton");
const calculateAreaButton = document.getElementById("calculateAreaButton");
const graphCanvas = document.getElementById("graph");
const graphContext = graphCanvas.getContext("2d");
const plotTypeSelect = document.getElementById("plotType");
const areaResultSpan = document.getElementById("areaResult");

let xValues, yValues1, yValues2;

// Function to clear the canvas
function clearCanvas() {
    graphContext.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
}

plotButton.addEventListener("click", () => {
    clearCanvas(); // Clear the canvas before plotting

    const expression1 = expressionInput1.value.trim();
    const expression2 = expressionInput2.value.trim();
    const plotType = plotTypeSelect.value; // Get the selected plot type

    try {
        const code1 = math.compile(expression1);
        const code2 = math.compile(expression2);

        xValues = math.range(-10, 10, 0.1).toArray();
        yValues1 = xValues.map(x => {
            const result = code1.evaluate({ x: x });

            // Check if the result is a valid number
            return (typeof result === 'number' && !isNaN(result) && isFinite(result)) ? result : null;
        });

        yValues2 = xValues.map(x => {
            const result = code2.evaluate({ x: x });

            // Check if the result is a valid number
            return (typeof result === 'number' && !isNaN(result) && isFinite(result)) ? result : null;
        });

        const datasets = [];

        if (plotType === "area") {
            datasets.push({
                label: expression1,
                data: yValues1,
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.3)",
                borderWidth: 2,
                fill: true,
            });

            datasets.push({
                label: expression2,
                data: yValues2,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.3)",
                borderWidth: 2,
                fill: true,
            });
        } else {
            datasets.push({
                label: expression1,
                data: yValues1,
                borderColor: "blue",
                borderWidth: 2,
            });

            datasets.push({
                label: expression2,
                data: yValues2,
                borderColor: "red",
                borderWidth: 2,
            });
        }

        new Chart(graphContext, {
            type: "line",
            data: {
                labels: xValues,
                datasets: datasets,
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                    },
                    y: {
                        type: "linear",
                        position: "left",
                        min: 0, // Adjust the minimum y-value to start from 0
                    },
                },
            },
        });
    } catch (error) {
        alert("Invalid function. Please enter valid mathematical expressions.");
    }
});

calculateAreaButton.addEventListener("click", () => {
    if (xValues && yValues1 && yValues2) {
        const dx = xValues[1] - xValues[0];
        let area = 0;

        for (let i = 0; i < xValues.length; i++) {
            const y1 = yValues1[i];
            const y2 = yValues2[i];

            if (y1 !== null && y2 !== null) {
                area += Math.abs(y1 - y2) * dx;
            }
        }

        areaResultSpan.textContent = `Area between the curves: ${area.toFixed(2)}`;
    } else {
        areaResultSpan.textContent = "Please plot both curves before calculating the area.";
    }
});
