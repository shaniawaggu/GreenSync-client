let streets = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
    }
);

let satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
);

let basemaps = {
    "Streets": streets,
    "Satellite": satellite
};

let map = L.map("map", {
    layers: [streets],
    minZoom: 7,
    maxZoom: 16,
    maxBounds: L.latLngBounds([[-90, -180], [90, 180]]),
}).setView([51.5, -0.12], 11);

L.control.layers(basemaps).addTo(map);

// Define custom charging station icon using Leaflet ExtraMarkers
let chargingIcon = L.ExtraMarkers.icon({
    icon: "fa-charging-station",
    markerColor: "green",
    shape: "square",
    prefix: "fa"
});

// Fetch local JSON file containing charging stations
// fetch("javascript/charging-stations.json")
//     .then(response => response.json())
//     .then(data => {
//         let markers = L.markerClusterGroup();
        
//         data.forEach(station => {
//             if (station.latitude && station.longitude) {
//                 let marker = L.marker([parseFloat(station.latitude), parseFloat(station.longitude)], { icon: chargingIcon });
//                 marker.bindPopup(`<b>${station.primary_name}</b><br>Location: ${station.licence_area}`);
//                 marker.on('mouseover', function (e) {
//                     this.openPopup();
//                 });
//                 marker.on('mouseout', function (e) {
//                     this.closePopup();
//                 });
//                 markers.addLayer(marker);
//             } else {
//                 console.warn("Skipping station due to missing latitude or longitude:", station);
//             }
//         });
        
//         map.addLayer(markers);
//     })
//     .catch(error => console.error("Error fetching charging stations:", error));

async function loadChargingStations() {
    const userId = localStorage.getItem("id");

    if (!userId) {
        console.error("User ID not found in local storage.");
        window.location.assign("./index.html");
        return;
    }

    const options = {
        headers: {
            Authorization: localStorage.getItem("token"),
        },
    };

    try {
        // Step 1: Fetch user data (postcode)
        const userResponse = await fetch(`http://localhost:3000/user/${userId}`, options);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");

        const userData = await userResponse.json();
        const userPostcode = userData.postcode;

        if (!userPostcode) {
            console.error("User postcode not found.");
            return;
        }

        // Step 2: Fetch latitude/longitude from Postcodes.io API
        // const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/${userPostcode.replace(/\s+/g, '')}`);
        // if (!postcodeResponse.ok) throw new Error("Failed to fetch postcode data");

        const postcodeResponse = await fetch(`https://api.postcodes.io/postcodes/SE187BE`);

        const postcodeData = await postcodeResponse.json();
        const userLatitude = postcodeData.result.latitude;
        const userLongitude = postcodeData.result.longitude;

        if (!userLatitude || !userLongitude) {
            console.error("Could not retrieve user coordinates.");
            return;
        }

        // Step 3: Set map view to user's location
        map.setView([userLatitude, userLongitude], 14); // Zoom in on user

        // Step 4: Fetch charging stations & display nearby ones
        const stationsResponse = await fetch("javascript/charging-stations.json");
        if (!stationsResponse.ok) throw new Error("Failed to fetch charging stations");

        const stationsData = await stationsResponse.json();
        let markers = L.markerClusterGroup();

        stationsData.forEach(station => {
            if (station.latitude && station.longitude) {
                let marker = L.marker(
                    [parseFloat(station.latitude), parseFloat(station.longitude)], 
                    { icon: chargingIcon }
                );

                marker.bindPopup(`<b>${station.primary_name}</b><br>Location: ${station.licence_area}`);

                marker.on("mouseover", function () {
                    this.openPopup();
                });
                marker.on("mouseout", function () {
                    this.closePopup();
                });

                markers.addLayer(marker);
            }
        });

        map.addLayer(markers);

    } catch (error) {
        console.error("Error:", error);
        window.location.assign("./index.html"); // Redirect if there's an error
    }
}

// Call function when page loads
loadChargingStations();
