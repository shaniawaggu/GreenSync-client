window.addEventListener('DOMContentLoaded', fetchData);

// FETCH DATA FROM API for FORECAST DATA

async function fetchData() {
    try {
        const response = await fetch(`http://131.145.0.127:3000/forecasts`);
        if (response.ok) {
            const data = await response.json();
            const hourlyData = convertToHourlyData(data);
            const dayArray = processDays(hourlyData);
            updateDayBoxes(dayArray);
            createWeekChart(hourlyData);
            updateMaxEnergy(dayArray)
        } else {
            throw new Error("HTTP status code: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }
}

// CONVERTS TO DIFFERENT FORMAT OF ARRAYS

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

// CONVERTS 7 DAYS TO ONE DAY BY ITERATING OVER 24 HOURS 

function processDays(data) {
    const days = [];

    for (let i = 0; i < 7; i++) {
        const startIndex = i * 24;
        const endIndex = startIndex + 24;

        const date = data.hourly.time[startIndex].split('T')[0];
        const estimatedenergy = data.hourly.estimated_energy.slice(startIndex, endIndex); 
        const windSpeed = data.hourly.wind_energy.slice(startIndex, endIndex); 
        const directNormalIrradiance = data.hourly.solar_energy.slice(startIndex, endIndex); 
        const weekday = weekdays[new Date(date).getDay()-1];
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
            box.textContent = day.weekday + " " + (day.date).split("-")[2] + " March"
            if (day.weekday == undefined){
                box.textContent = "Sunday" + " " + (day.date).split("-")[2] + " March"
            }
            box.addEventListener('click', () => {
                // Pass the data for the clicked day to update the chart
                createDayChart([
                    day.timeLabels,
                    day.estimatedenergy,
                    day.windSpeed,
                    day.directNormalIrradiance
                ]);
            });
        }
    });
}

function updateMaxEnergy(days){
    days.forEach((day, index) => {
        const box = document.querySelector(`#box_${index + 1} p`);
        if (box) {
            let max = 0
            for (i in day.estimatedenergy){
                if (day.estimatedenergy[i] > max) {
                    max = day.estimatedenergy[i]
                }
            box.textContent = "Estimated MW " + Math.round(max)
            if (max > 500){
                box.style.color = "green"
            } else if ( max < 500 && max > 250){
                box.style.color = "darkorange"
            } else {
                box.style.color = "red"
            }
            }        
        }
    })
}

const weeklyButton = document.querySelector('#box_8').addEventListener('click',fetchData)

// Send data to the CREATE chart functions.

// Initalise the x and y axis to variables
function createWeekChart(data) {
    const timeLabels = data.hourly.time.map((t) => {
        const date = new Date(t);
        const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' }); // Get the full day name
        const hour = date.toLocaleTimeString('en-GB', { hour: '2-digit'}); // Get the hour and minute
        return `${dayName}, ${hour.split(":")[0]+"h"}`; // Combine day name and hour
    });
    const estimated_energy = data.hourly.estimated_energy;
    const wind_energy = data.hourly.wind_energy;
    const solar_energy = data.hourly.solar_energy;
    chartJSRun(timeLabels,estimated_energy,wind_energy,solar_energy)
}

// Initalise the x and y axis to variables
function createDayChart(data) {
    console.log(data)
    const timeLabels = data[0]
    const estimated_energy = data[1]
    const wind_energy = data[2]
    const solar_energy = data[3]
    chartJSRun(timeLabels,estimated_energy,wind_energy,solar_energy)
}

let myChart; 

function chartJSRun(timeLabels, estimated_energy, wind_energy, solar_energy) {
    
    // Chart JS syntax
    const ctx = document.getElementById('weatherChart').getContext('2d');

    // Check if a chart instance already exists via myChart;
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
                    borderWidth: 3,
                    tension: 0.7,
                    yAxisID: 'y1',
                    pointRadius: 1,
                    fill: {
                        target: 'origin',
                    }
                },
                {
                    label: 'Solar Energy (W/m²)',
                    data: solar_energy,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    yAxisID: 'y2',
                    pointRadius: 0.2,
                },
                {
                    label: 'Wind Energy (km/)',
                    data: wind_energy,
                    borderColor: 'rgba(123, 99, 132, 1)',
                    backgroundColor: 'rgba(123, 99, 132, 0.2)',
                    borderWidth: 1.5,
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
                    display: false,
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
window.addEventListener('DOMContentLoaded', fetchOptimalPoints)

async function fetchOptimalPoints() {
    try {
        const response = await fetch(`http://131.145.0.127:3000/forecasts/optimal-windows`);
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            updateOptimalPoints(data)
        } else {
            throw new Error("HTTP status code: " + response.status);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateOptimalPoints(data){
    
    weekdays.forEach((day, index) => {
        const dayElement = document.querySelector(`#days_${index+1}`);
            if (dayElement) {
                if (data[day].startTime == null || data[day].score == null){
                    dayElement.nextElementSibling.textContent = "🌳🌳"
                    dayElement.nextElementSibling.style.backgroundColor = "orange"
                } else {
                    dayElement.textContent = `${day} ${data[day].startTime.split("T")[1]}`;
                    dayElement.nextElementSibling.textContent = data[day].score.toFixed(3);
                if (data[day].score > 0.1) {
                    dayElement.nextElementSibling.style.backgroundColor = "lightgreen"
                    dayElement.nextElementSibling.style.color = "black"
                    dayElement.nextElementSibling.textContent = "🌳🌳🌳"
                } else if (data[day].score < 0.032 && data[day].score < 0.99) {
                    dayElement.nextElementSibling.style.backgroundColor = "orange"
                    dayElement.nextElementSibling.style.opacity = "1"
                    dayElement.nextElementSibling.style.color = "black"
                    dayElement.nextElementSibling.textContent = "🌳🌳"
                }  else {
                    dayElement.nextElementSibling.style.backgroundColor = "salmon"
                    dayElement.nextElementSibling.style.opacity = "1"
                    dayElement.nextElementSibling.style.color = "black"
                    dayElement.nextElementSibling.textContent = "🌳"
                }
                }
            }
        });
    }
    

