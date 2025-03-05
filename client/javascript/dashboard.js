window.addEventListener('DOMContentLoaded', fetchData);

async function fetchData() {
    try {
        const response = await fetch(`http://localhost:3000/forecasts/`);
        if (response.ok) {
            const data = await response.json();
            const hourlyData = convertToHourlyData(data);
            const dayArray = processDays(hourlyData);
            updateDayBoxes(dayArray);
            createWeekChart(hourlyData);
        } else {
            throw new Error("HTTP status code: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }
}

function convertToHourlyData(inputData) {
    return {
        "hourly": {
            "time": inputData.map(entry => entry.dateandtime),
            "estimated_energy": inputData.map(entry => parseFloat(entry.estimatedenergy)),
            "wind_energy": inputData.map(entry => parseFloat(entry.windenergy)),
            "solar_energy": inputData.map(entry => parseFloat(entry.solarenergy))
        }
    };
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function processDays(data) {
    const days = [];

    for (let i = 0; i < 7; i++) {
        const startIndex = i * 24;
        const endIndex = startIndex + 24;

        const date = data.hourly.time[startIndex].split('T')[0];
        const estimatedenergy = data.hourly.estimated_energy.slice(startIndex, endIndex); 
        const windSpeed = data.hourly.wind_energy.slice(startIndex, endIndex); 
        const directNormalIrradiance = data.hourly.solar_energy.slice(startIndex, endIndex); 
        const weekday = weekdays[new Date(date).getDay()];
        const timeLabels = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

        days.push({
            date,
            estimatedenergy,
            windSpeed,
            directNormalIrradiance,
            weekday,
            timeLabels
        });
    }
    return days;
}

function updateDayBoxes(days) {
    days.forEach((day, index) => {
        const box = document.querySelector(`#box_${index + 1} strong`);
        if (box) {
            box.textContent = day.weekday;
            box.addEventListener('click', () => {
                const ctx = document.getElementById('weatherChart').getContext('2d');

                // Pass the data for the clicked day to update the chart
                createDayChart([
                    day.timeLabels,
                    day.estimatedenergy,
                    day.directNormalIrradiance,
                    day.windSpeed
                ]);
            });
        }
    });
}

function createWeekChart(data) {
    const timeLabels = data.hourly.time.map((t) => new Date(t).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', hour: '2-digit'
    }));
    const estimated_energy = data.hourly.estimated_energy;
    const wind_energy = data.hourly.wind_energy;
    const solar_energy = data.hourly.solar_energy;
    chartJSRun(timeLabels,estimated_energy,wind_energy,solar_energy)
}

function createDayChart(data) {
    const timeLabels = data[0]
    const estimated_energy = data[1]
    const wind_energy = data[2]
    const solar_energy = data[3]
    chartJSRun(timeLabels,estimated_energy,wind_energy,solar_energy)
}

let myChart; 

function chartJSRun(timeLabels, estimated_energy, solar_energy, wind_energy) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    // Check if a chart instance already exists

    if (myChart) {
        myChart.destroy(); // Destroy the existing chart instance
    }

    // Create a new chart instance
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Estimated Energy (%)',
                    data: estimated_energy,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                    tension: 0.7,
                    yAxisID: 'y1',
                    pointRadius: 0.1,
                    fill: {
                        target: 'origin',
                    }
                },
                {
                    label: 'Solar Energy (W/m²)',
                    data: solar_energy,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 3,
                    tension: 0.4,
                    yAxisID: 'y2',
                    pointRadius: 0.2,
                },
                {
                    label: 'Wind Energy (km/h)',
                    data: wind_energy,
                    borderColor: 'rgba(123, 99, 132, 1)',
                    backgroundColor: 'rgba(123, 99, 132, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y3',
                    pointRadius: 0.2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y1: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Estimated Energy (%)',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
                y2: {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Solar Energy (W/m²)',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
                y3: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Wind Energy (km/h)',
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date',
                    },
                },
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: true,
                },
                legend: {
                    position: 'top',
                },
            },
        },
    });
}