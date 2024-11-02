
function setupKmeansSelectors() {
    const xSelect = document.getElementById("columnkmeans");
    headers.forEach(header => {
        const option = document.createElement("option");
        option.value = header;
        option.text = header;
        xSelect.appendChild(option);
    });

    document.getElementById('kmeansdata').style.display = 'block';
    showColumns = true;
}

let clusterGraphInfo;
function startKmeansTraining() {
    const column = document.getElementById("columnkmeans").value;
    const xIndex = headers.indexOf(column);

    const xData = dataset.map(row => row[xIndex]);
    const kmeanscluster = parseInt(document.getElementById("kmeanscluster").value);
    const kmeansiteracion = parseInt(document.getElementById("kmeansiteracion").value);

    if (xData.includes(NaN) || !kmeanscluster || !kmeansiteracion) {
        alert("Los datos o los parámetros contienen valores no válidos");
        return;
    }

    if (xData.length < kmeanscluster) {
        alert(`El numero de clusters (${kmeanscluster}) no puede ser mayor a la cantidad de datos (${xData.length})`)
    }
    
    modelInstance = new LinearKMeans();
    const clusterized_data = modelInstance.clusterize(kmeanscluster, xData, kmeansiteracion);
    let clusters = new Set([...clusterized_data.map(a => a[1])]);
    clusters = Array.from(clusters);
    clusters.forEach((cluster, i) => {
        clusters[i] = [cluster, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })]
    });
    clusterGraphInfo={clusters, clusterized_data};
    alert("Modelo de regresión lineal entrenado con éxito.");
}

function showGraphKmeans(clusterGraphInfo) {
    let { clusters, clusterized_data } = clusterGraphInfo
    if (clusters) {
        let chartData = [];
        clusterized_data.forEach(e => {
            chartData.push({
                x: e[0],
                y: 0,
                backgroundColor: clusters[clusters.findIndex(a => a[0] == e[1])][1]
            });
        });
        const ctx = document.getElementById("chartCanvas").getContext("2d");
        chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Clusters',
                    data: chartData,
                    pointRadius: 7,
                    pointStyle: 'rectRot',
                    backgroundColor: chartData.map(d => d.backgroundColor)
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'X'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y'
                        },
                        min: -1,
                        max: 1
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}