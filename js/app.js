document.getElementById("btnTrain").addEventListener("click", trainModel);
document.getElementById("btnPredict").addEventListener("click", predictModel);
document.getElementById("btnShowGraph").addEventListener("click", showGraph);
document.getElementById("modelSelect").addEventListener("change", handleModelChange);

let dataset, header;
let modelType, modelInstance;
let showColumns;

function trainModel() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput) {
        if (!modelType || modelType === 'select_model') {
            alert('Selecciona un modelo');
            return;
        }
        if (!showColumns) {
            handleModelChange();
            alert("Selecciona las columnas o presiona nuevamente el boton para entrenar");
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            const parsedData = parseCSV(event.target.result);
            const parsedData2 = parseCSV2(event.target.result);
            headers = parsedData.headers;
            dataset = parsedData.rowsData;

            if (dataset.length === 0 || dataset.some(row => row.length === 0)) {
                alert("El archivo CSV no contiene datos válidos.");
                return;
            }

            switch (modelType) {
                case 'linear_regression':
                    startRegressionTraining();
                    break;
                case 'k_means':
                    startKmeansTraining();
                    break;
                case 'decision_tree':
                    headers = parsedData2.headers;
                    dataset = parsedData2.rowsData;
                    startTreeTraining();
                    break;
                default:
                    alert("Modelo no soportado");
                    return;
            }
        };
        reader.readAsText(fileInput);
    } else {
        alert("Por favor, selecciona un archivo CSV.");
    }
}

function handleModelChange() {
    modelInstance = undefined;
    showColumns = false;
    clearRegressionSelectors();
    modelType = document.getElementById("modelSelect").value;

    const fileInput = document.getElementById("fileInput").files[0];
    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const parsedData = parseCSV(event.target.result);
            const parsedData2 = parseCSV2(event.target.result);
            headers = parsedData.headers;
            dataset = parsedData.rowsData;
            switch (modelType) {
                case 'linear_regression':
                    document.getElementById('btnPredict').style.display = 'block';
                    setupRegressionSelectors();
                    break;
                case 'k_means':
                    setupKmeansSelectors();
                    break;
                case 'decision_tree':
                    headers = parsedData2.headers;
                    dataset = parsedData2.rowsData;
                    setupTreeSelectors();
                    break;
                default:
                    alert("Modelo no soportado");
                    return;
            }
        };
        reader.readAsText(fileInput);
    }

}

function predictModel() {
    if (!modelInstance) {
        alert("El modelo no ha sido entrenado o no hay datos para mostrar.");
        return;
    }
    const userInput = prompt('Por favor, el nuevo rango de un números separados por coma:');
    const numArray = userInput.split(',').map(Number);

    switch (modelType) {
        case 'linear_regression':
            const predictValues = predictModelLineal(modelInstance, numArray);
            showGraphLineal(predictValues);
            break;
        case 'k_means':
            break;
        case 'decision_tree':
            break;
        default:
            return;
    }
}

function showGraph() {
    if (!modelInstance) {
        alert("El modelo no ha sido entrenado o no hay datos para mostrar.");
        return;
    }
    if (chart) chart.destroy();
    document.getElementById('chartCanvas2').style.display = 'none';
    switch (modelType) {
        case 'linear_regression':
            document.getElementById('chartCanvas').style.display = 'block';
            showGraphLineal();
            break;
        case 'k_means':
            document.getElementById('chartCanvas').style.display = 'block';
            showGraphKmeans(clusterGraphInfo);
            break;
        case 'decision_tree':
            document.getElementById('chartCanvas').style.display = 'none';
            document.getElementById('chartCanvas2').style.display = 'block';
            showGraphTree(visTreeGraphInfo);
            break;
        default:
            return;
    }

}

function parseCSV(data) {
    if (data.endsWith('\n')) {
        data = data.trim();
    }
    const rows = data.split('\n');
    const headers = rows[0].split(',').map(header => header.trim());  // Obtener los encabezados
    const rowsData = rows.slice(1)  // Omitir la primera fila
        .map(row => row.split(',').map(value => {
            if (parseFloat(value.trim())) {
                return parseFloat(value.trim())
            } else {
                return value.trim()
            }
        }));
    const numericHeaders = [];
    rowsData[0].forEach((element, index) => {
        if (parseFloat(element)) {
            numericHeaders.push(headers[index]);
        }
    });

    const numericData = filterNumericColumns(rowsData);
    return { headers: numericHeaders, rowsData: numericData };
    //return { headers, rowsData };
}

function parseCSV2(data) {
    if (data.endsWith('\n')) {
        data = data.trim();
    }
    const rows = data.split('\n');
    const headers = rows[0].split(',').map(header => header.trim());
    const rowsData = rows.slice(1)
        .map(row => row.split(',').map(value => {
            if (parseFloat(value.trim())) {
                return parseFloat(value.trim())
            } else {
                return value.trim()
            }
        }));
    return { headers, rowsData };
}

function filterNumericColumns(data) {
    const numericData = data.map(row => {
        return Object.entries(row)
            .filter(([key, value]) => typeof value === 'number')
            .map(([key, value]) => value); // Devuelve solo los valores
    });
    return numericData;
}
function removeDuplicates(array) {
    return array.filter((value, index, self) => self.indexOf(value) === index && self.lastIndexOf(value) === index);
}

function removeOptionsSelect(id) {
    const selectElement = document.getElementById(id);
    while (selectElement.options.length > 0) {
        selectElement.remove(0); // Elimina la primera opción hasta que el select esté vacío
    }
}

function removeValuesTable(id) {
    const table = document.getElementById(id);
    for (var i = 0; i < table.rows.length; i++) {
        var row = table.rows[i];
        
        // Elimina todos los <td> de la fila actual
        while (row.cells.length > 0) {
            row.deleteCell(0);
        }
    }
}

function clearRegressionSelectors() {
    removeOptionsSelect("columnx");
    removeOptionsSelect("columny");
    removeOptionsSelect("columnkmeans");
    removeValuesTable("valuesTable");
    removeValuesTable("valuesTable2");
    document.getElementById('columnsxylineal').style.display = 'none';
    document.getElementById('kmeansdata').style.display = 'none';
    document.getElementById('treeparams').style.display = 'none';
    document.getElementById('btnPredict').style.display = 'none';
}
