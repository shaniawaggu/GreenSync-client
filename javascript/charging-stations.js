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
fetch("javascript/charging-stations.json")
    .then(response => response.json())
    .then(data => {
        let markers = L.markerClusterGroup();
        
        data.forEach(station => {
            if (station.latitude && station.longitude) {
                let marker = L.marker([parseFloat(station.latitude), parseFloat(station.longitude)], { icon: chargingIcon });
                marker.bindPopup(`<b>${station.primary_name}</b><br>Location: ${station.licence_area}`);
                marker.on('mouseover', function (e) {
                    this.openPopup();
                });
                marker.on('mouseout', function (e) {
                    this.closePopup();
                });
                markers.addLayer(marker);
            } else {
                console.warn("Skipping station due to missing latitude or longitude:", station);
            }
        });
        
        map.addLayer(markers);
    })
    .catch(error => console.error("Error fetching charging stations:", error));