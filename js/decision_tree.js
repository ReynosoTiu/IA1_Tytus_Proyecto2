let headerscopy, datasetcopy;
function setupTreeSelectors() {
    headerscopy = headers;
    datasetcopy = dataset;
    const headerscsv = document.getElementById("headerscsv");
    const bodycsv = document.getElementById("bodycsv");
    for (let i = 0; i < headers.length; i++) {
        const tdheader = document.createElement('th');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `headerCheckbox-${i}`;
        checkbox.checked = false;
        checkbox.addEventListener('change', () => {
            UpdateDatasetTabla();
        });

        tdheader.appendChild(checkbox);
        tdheader.appendChild(document.createTextNode(` ${headers[i]}`));
        headerscsv.appendChild(tdheader);
    }

    for (let i = 0; i < 5; i++) {
        const trboddy = document.createElement('tr');
        for (let j = 0; j < headers.length; j++) {
            const tdbody = document.createElement('td');
            tdbody.innerHTML = dataset[i][j];
            trboddy.appendChild(tdbody);
        }
        bodycsv.appendChild(trboddy);
    }

    const treepredictheader = document.getElementById("treepredictheader");
    treepredictheader.value = headers[headers.length - 1].toString();

    const trtreeheaders = document.getElementById("trtreeheaders");
    const trtreebody = document.getElementById("trtreebody");
    for (let i = 0; i < headers.length - 1; i++) {
        const tdheader = document.createElement('th');
        tdheader.innerHTML = headers[i];
        trtreeheaders.appendChild(tdheader);

        const tdboddy = document.createElement('td');
        const input = document.createElement('input');
        input.id = headers[i];
        input.className = "form form-sm";
        input.style.width = "70px";
        input.value = dataset[0][i];
        tdboddy.appendChild(input);
        trtreebody.appendChild(tdboddy);
    }

    document.getElementById('treeparams').style.display = 'block';
    showColumns = true;
}

function UpdateDatasetTabla(){
    const selectedHeaders = [];
    const selectedDataset = [];

    // Iterar sobre todos los checkboxes para seleccionar las columnas correspondientes
    const allCheckboxes = document.querySelectorAll('[id^="headerCheckbox-"]');
    allCheckboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedHeaders.push(headers[index]);
        }
    });

    dataset.forEach(row => {
        const newRow = [];
        allCheckboxes.forEach((checkbox, index) => {
            if (checkbox.checked) {
                newRow.push(row[index]);
            }
        });
        selectedDataset.push(newRow);
    });
    headerscopy = selectedHeaders;
    datasetcopy = selectedDataset;
    TableValuesRender();
}

function TableValuesRender() {
    removeValuesTable("valuesTable2");
    const treepredictheader = document.getElementById("treepredictheader");
    treepredictheader.value = headerscopy[headerscopy.length - 1].toString();

    const trtreeheaders = document.getElementById("trtreeheaders");
    const trtreebody = document.getElementById("trtreebody");
    for (let i = 0; i < headerscopy.length - 1; i++) {
        const tdheader = document.createElement('th');
        tdheader.innerHTML = headerscopy[i];
        trtreeheaders.appendChild(tdheader);

        const tdboddy = document.createElement('td');
        const input = document.createElement('input');
        input.id = headerscopy[i];
        input.className = "form form-sm";
        input.style.width = "70px";
        input.value = datasetcopy[0][i];
        tdboddy.appendChild(input);
        trtreebody.appendChild(tdboddy);
    }

    document.getElementById('treeparams').style.display = 'block';
    showColumns = true;
}

let visTreeGraphInfo;
function startTreeTraining() {

    if(headerscopy.length < 6) {
        alert("Necesita al menos 6 columnas");
        return;
    }
    let arrData = [...[headerscopy], ...datasetcopy];
    modelInstance = new DecisionTreeID3(arrData);
    let root = modelInstance.train(modelInstance.dataset);

    var arrPred = [];
    var predHeader = headerscopy.slice(0, -1);

    for (let i = 0; i < headerscopy.length - 1; i++) {
        const input = document.getElementById(headerscopy[i]);
        arrPred.push(parseFloat(input.value) ? parseFloat(input.value) : input.value.trim());
    }
    let predict = modelInstance.predict([predHeader, arrPred], root);
    visTreeGraphInfo = {
        dotStr: modelInstance.generateDotString(root),
        predictNode: predict
    };
    
    console.log(vis.network.convertDot(visTreeGraphInfo.dotStr));

    document.getElementById('treeresult').value = predict.value;
    alert("Modelo de regresión lineal entrenado con éxito.");
}


function showGraphTree(graphData) {
    var chart = document.getElementById("tree");
    var {
        dotStr
    } = graphData;
    var parsDot = vis.network.convertDot(dotStr);
    console.log(parsDot);
    var data = {
        nodes: parsDot.nodes,
        edges: parsDot.edges
    }

    var options = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD', // UD, DU, LR, RL
                sortMethod: 'directed', // hubsize, directed
                //shakeTowards: 'roots' // roots, leaves                        
            },
        },
    };
    new vis.Network(chart, data, options);
    alert("Grafico finalizado");
}