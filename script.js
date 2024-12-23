// URL for OpenStreetMap
const osm_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

// URL for Esri Satellite
const esri_url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

// Definition of the classic map background
const streets = L.tileLayer(osm_url);

// Definition of the satellite map background
const satellite = L.tileLayer(esri_url);

const grenobleGPS = [45.1885, 5.7245]

// Default map initialization
const map = L.map('map', {
    center: grenobleGPS, // Grenoble
    zoom: 13, // Default zoom level
    layers: [streets] // Streets enabled by default
});

// Group the maps and rename them for better display
const baseMaps = {
    "Streets (OSM)": streets,
    "Satellite (Esri)": satellite
};

// Add layer control to the map
const chooseMaps = L.control.layers(baseMaps).addTo(map);

// Create a default Bastille marker
//const bastille = L.marker([45.198601, 5.724592]).addTo(map).bindPopup("The Bastille of Grenoble");

// Create a custom icon for the marker
const castleIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/6161/6161670.png',  // Path to the icon image
    iconSize: [32, 32],            // Icon size
    iconAnchor: [16, 32],          // Anchor point of the icon (where the icon is attached to the marker)
    popupAnchor: [0, -32]          // Anchor point of the popup
});

const bastilleGPS = [45.198601, 5.724592];

// Create a Bastille marker with a custom icon
const bastilleMarker = L.marker(bastilleGPS, {icon: castleIcon}).addTo(map).bindPopup("The Bastille of Grenoble");

// const jdvGPS = [45.192184, 5.726669]

// Delimit the city garden with a circle, but it's not very precise...
// const jdv = L.circle(jdvGPS, {
//     color: 'green',
//     radius: 100
// }).addTo(map);

// Every time the user clicks on the Bastille marker, it will zoom on it
bastilleMarker.on('click', function() {
    // Zoom in on the Bastille marker with a zoom level of 16 (adjust as needed)
    map.setView(bastilleGPS, 16); // Latitude, longitude, zoom level
});

// Delimit the perimeter of the city garden
const jdvPerimeter = [
    [45.192890, 5.725622],
    [45.193016, 5.727075],
    [45.191364, 5.727556],
    [45.191428, 5.725975]
];

// Delimit the city garden with a polygon drawn from the garden perimeter, much more precise!
const jdv = L.polygon(jdvPerimeter, {color: 'green'}).addTo(map).bindPopup("Jardin de ville");

// GPS coordinates of the cable car
const cableCar = [45.19295, 5.726035]

// Create a line simulating the cable car between the Bastille and the City Garden
const line = L.polyline([bastilleGPS, cableCar], {
    color: 'red',
    weight: 3,
}).addTo(map);

// Calculate the distance traveled by the cable car, we use the 'toFixed' function to round to two digits after the decimal point.

const distance = bastilleMarker.getLatLng().distanceTo(cableCar).toFixed(2);

// line.bindTooltip(`Distance : ${distance} m`, { permanent: true, direction: 'center' });

// Function to handle the display of distance based on zoom level
function handleZoom() {
    if (map.getZoom() > 14) {
        // Show the tooltip if zoom > 14
        line.bindTooltip(`Distance : ${distance} m`, { permanent: true, direction: 'center' });
    } else {
        // Remove the tooltip if zoom <= 14
        line.unbindTooltip();
    }
}

// Every time the user zooms, call the above function to check whether to display the tooltip or not
map.on('zoom', handleZoom);

// GeoJSON file
const grenobleCyclePaths = 'https://data.mobilites-m.fr/api/lines/json?types=chronovelo,tempovelo,voieverte,veloamenage,velononamenage,velodifficile&epci=LaMetro'

// Load the GeoJSON file
fetch(grenobleCyclePaths)
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data).addTo(map);
    })
    .catch(error => console.error('Error loading the GeoJSON file:', error));

// Add a field for searching addresses
const search = L.Control.geocoder().addTo(map);

// Add a scale
const scale = L.control.scale().addTo(map);

// Add a legend
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');

    div.style.backgroundColor = 'rgba(250,250,250, 0.7)';  // Light gray background with 0.7 opacity
    div.style.padding = '10px';             // Add padding for spacing
    div.style.borderRadius = '5px';         // Round the corners of the legend
    div.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';  // Subtle shadow for depth effect

    // Add the HTML content of the legend
    div.innerHTML +=
        '<b>Legend</b><br>' +
        // Create a blue line for cycle paths
        '<i style="background: #3c8df8; width: 20px; height: 5px; display: inline-block; margin-right: 5px;"></i> Cycle Paths<br>' +
        // Create a red line for the cable car
        '<i style="background: red; width: 20px; height: 5px; display: inline-block; margin-right: 5px;"></i> Cable Car<br>';

    return div;
};

legend.addTo(map);

            /* =============== SOURCES =============== */

// OFFICIAL LEAFLET DOCUMENTATION : https://leafletjs.com/reference.html
// LEARN MORE ABOUT TILELAYERS : https://leafletjs.com/reference.html#tilelayer
// LEARN MORE ABOUT MAPS : https://leafletjs.com/reference.html#map
// LEARN MORE ABOUT LAYERS-CONTROL : https://leafletjs.com/examples/layers-control/
// LEARN MORE ABOUT CUSTOM ICONS : https://leafletjs.com/examples/custom-icons/
// LEARN MORE ABOUT ICONS : https://leafletjs.com/reference.html#icon
// LEARN MORE ABOUT MARKERS : https://leafletjs.com/reference.html#marker
// LEARN MORE ABOUT CUSTOM LEGENDS : https://leafletjs.com/examples/choropleth/
// LEARN MORE ABOUT POPUPS : https://leafletjs.com/reference.html#popup
// LEARN MORE ABOUT TOOLTIP : https://leafletjs.com/reference.html#tooltip
// LEARN MORE ABOUT POLYLINES : https://leafletjs.com/reference.html#polyline
// LEARN MORE ABOUT CIRCLES : https://leafletjs.com/reference.html#circle
// LEARN MORE ABOUT POLYGONS : https://leafletjs.com/reference.html#polygon

// LEARN MORE ABOUT JSON : https://fr.wikipedia.org/wiki/JavaScript_Object_Notation
// LEARN MORE ABOUT GEOJSON : https://leafletjs.com/examples/geojson/

// SMMAG OFFICIAL WEBSITE: https://smmag.fr/
// LIST OF SMMAG OPEN ACCESS DATASETS: https://grenoble-backoffice.data4citizen.com/organization/smmag
// SMMAG DATASETS FOR CYCLE PATHS IN THE GRENOBLE METROPOLITAN AREA : https://grenoble-backoffice.data4citizen.com/dataset/pistes_cyclables_de_la_metropole_de_grenoble