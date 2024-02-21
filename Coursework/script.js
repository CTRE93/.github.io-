// Importing the access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiMjIwNzE2NGUiLCJhIjoiY2xyNmR4MnZwMjBtaTJpdDM3eGl5YXcxcCJ9.Yx17DbOwNeutCo877cy5UQ";

// Define a map object by initialising a Map from Mapbox
const map = new mapboxgl.Map({
  container: "map",

  // Importing the style URL.
  style: "mapbox://styles/2207164e/cls99ywtk01be01pl85o33qlk"
});

// Creating the a hover function
map.on("load", () => {
  map.addSource("hover", {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] }
  });

  // Defining the line and width of each polygon selection
  map.addLayer({
    id: "dz-hover",
    type: "line",
    source: "hover",
    layout: {},
    paint: {
      "line-color": "black",
      "line-width": 1
    }
  });
  map.on("click", (event) => {
    const dzone = map.queryRenderedFeatures(event.point, {
      layers: ["reprojectedbattlefields-anskms"]
    });

    // Date is in the format "YYYY-MM-DD"
    const originalDate = dzone[0].properties.Date;
    const parsedDate = new Date(originalDate);

    // Format the date (e.g., DD-MM-YYYY)
    const formattedDate = `${parsedDate.getDate() + 1}-${
      parsedDate.getMonth() + 1
    }-${parsedDate.getFullYear()}`;

    // Getting the attributes from the file
    document.getElementById("pd").innerHTML = dzone.length
      ? `<h3>${dzone[0].properties.DES_TITLE}</h3>
     <p>Location: <strong>${dzone[0].properties.LOCAL_AUTH}</strong></p>
     <p>Date: <strong>${formattedDate}</strong></p>
     <p>Find out more information at: <strong><a href="${dzone[0].properties.LINK}" target="_blank">${dzone[0].properties.LINK}</a></strong></p>`
      : "";

    map.getSource("hover").setData({
      type: "FeatureCollection",
      features: dzone.map(function (f) {
        return { type: "Feature", geometry: f.geometry };
      })
    });
  });

  // Changing the cursor to a pointer when over a polygon
  map.on("mousemove", "reprojectedbattlefields-anskms", function (e) {
    map.getCanvas().style.cursor = "pointer";
  });

  // Stop being a pointer when off a polygon
  map.on("mouseleave", "reprojectedbattlefields-anskms", function (e) {
    map.getCanvas().style.cursor = "";
  });
});

// Initialize the geocoder
const geocoder = new MapboxGeocoder({
  // Set the access token
  accessToken: mapboxgl.accessToken,
  // Set the mapbox-gl instance
  mapboxgl: mapboxgl,
  // Do not use the default marker style
  marker: false,
  // Placeholder text for the search bar
  placeholder: "Search for places in Scotland",
  // Coordinates of for Scotland
  proximity: {
    longitude: 55.8642,
    latitude: 4.2518
  }
});

// Location of the Geocoder
map.addControl(geocoder, "top-left");
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserHeading: true
  }),
  "top-left"
);

map.addControl(new mapboxgl.NavigationControl(), "top-left");