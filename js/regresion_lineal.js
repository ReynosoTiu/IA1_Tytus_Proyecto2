
function setupRegressionSelectors() {
    const xSelect = document.getElementById("columnx");
    headers.forEach(header => {
        const option = document.createElement("option");
        option.value = header;
        option.text = header;
        xSelect.appendChild(option);
    });

    const ySelect = document.getElementById("columny");
    headers.forEach(header => {
        const option = document.createElement("option");
        option.value = header;
        option.text = header;
        ySelect.appendChild(option);
    });

    document.getElementById('columnsxylineal').style.display = 'block';
    showColumns = true;
}

function startRegressionTraining() {
    const columnx = document.getElementById("columnx").value;
    const columny = document.getElementById("columny").value;

    const xIndex = headers.indexOf(columnx);
    const yIndex = headers.indexOf(columny);

    console.log(headers, dataset);
    console.log(xIndex, yIndex);
    
    const xData = dataset.map(row => row[xIndex]);
    const yData = dataset.map(row => row[yIndex]);

    console.log(xData, yData)
    if (xData.includes(NaN) || yData.includes(NaN)) {
        alert("Los datos contienen valores no válidos.");
        return;
    }

    modelInstance = new LinearRegression();
    modelInstance.fit(xData, yData);
    
    alert("Modelo de regresión lineal entrenado con éxito.");
}

// function getGraphDataLineal(model, xValuesP) {
//     if (!model || !model.isFit) {
//         console.error("El modelo no ha sido entrenado.");
//         return null;
//     }

//     const xValues = removeDuplicates(xValuesP)
//     const yValues = xValues.map(x => model.m * x + model.b);
//     return { x: xValues, y: yValues };
// }
let chart;
function showGraphLineal(graphData) {
    if (chart) chart.destroy();
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    if (modelInstance && modelInstance.isFit) {
        const columnx = document.getElementById("columnx").value;
        const columny = document.getElementById("columny").value;

        // Encuentra los índices de las columnas seleccionadas
        const xIndex = headers.indexOf(columnx);
        const yIndex = headers.indexOf(columny);

        // Extraer datos de X e Y
        const xValues = dataset.map(row => row[xIndex]);
        const yTrain = dataset.map(row => row[yIndex]);


        if (graphData) {
            chart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Entrenamiento',
                            data: xValues.map((x, index) => ({ x: x, y: yTrain[index] })),
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            showLine: false,  // Solo puntos
                            pointRadius: 4
                        },
                        {
                            label: 'Predecir',
                            data: graphData.x.map((x, index) => ({ x: x, y: graphData.y[index] })),
                            borderColor: 'red',
                            backgroundColor: 'red',
                            showLine: true,
                            fill: false,
                            pointRadius: 0,
                            type: 'line'
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom'
                        }
                    }
                }
            });
        } else {
            chart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Entrenamiento',
                            data: xValues.map((x, index) => ({ x: x, y: yTrain[index] })),
                            backgroundColor: 'blue',
                            borderColor: 'blue',
                            showLine: false,  // Solo puntos
                            pointRadius: 4
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    } else {
        alert("El modelo no ha sido entrenado o no hay datos para mostrar.");
    }
}


function predictModelLineal(model, xPredict) {
    return { x: xPredict, y: model.predict(xPredict) };
}