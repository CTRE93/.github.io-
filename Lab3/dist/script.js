// The value for 'accessToken' begins with 'pk...'
mapboxgl.accessToken =
  "pk.eyJ1IjoiMjIwNzE2NGUiLCJhIjoiY2xyNmR4MnZwMjBtaTJpdDM3eGl5YXcxcCJ9.Yx17DbOwNeutCo877cy5UQ";

const map = new mapboxgl.Map({
  container: "map", // container element id
  style: "mapbox://styles/mapbox/light-v10",
  center: [-0.824148, 54.319177],
  zoom: 8
});

const data_url =
  "https://api.mapbox.com/datasets/v1/2207164e/clrqekhct25i51umprkvqyvbt/features?access_token=pk.eyJ1IjoiMjIwNzE2NGUiLCJhIjoiY2xyNmR4MnZwMjBtaTJpdDM3eGl5YXcxcCJ9.Yx17DbOwNeutCo877cy5UQ";

map.on("load", () => {
  map.addLayer({
    id: "crimes",
    type: "circle",
    source: {
      type: "geojson",
      data: data_url
    },
    paint: {
      "circle-radius": 7,
      "circle-color": "#eb4d4b",
      "circle-opacity": 0.8
    }
  });

  //Slider interaction code goes below
  //Slider interaction code goes below

  document.getElementById("slider").addEventListener("input", (event) => {
    //Get the month value from the slider
    const month = parseInt(event.target.value);

    // get the correct format for the data
    if (month >= 8) {
      year = "2022-";
    } else {
      year = "2023-";
    }
    formatted_month = year + ("0" + month).slice(-2);
    console;
    //Create a filter
    filterMonth = ["==", ["get", "Month"], formatted_month];
    filterType = ["!=", ["get", "Crime type"], "placeholder"];
    //set the map filter
    map.setFilter("crimes", ["all", filterMonth]);

    // update text in the UI
    document.getElementById("active-month").innerText = month;
  });
  //Radio button interaction code goes below
  document.getElementById("filters").addEventListener("change", (event) => {
    const type = event.target.value;
    console.log(type);
    // update the map filter
    if (type == "all") {
      filterType = ["!=", ["get", "Crime type"], "placeholder"];
    } else if (type == "shoplifting") {
      filterType = ["==", ["get", "Crime type"], "drugs"];
    } else if (type == "drugs") {
      filterType = ["==", ["get", "Crime type"], "Drugs"];
    } else {
      console.log("error");
    }
    map.setFilter("crimes", ["all", filterMonth, filterType]);
  });
});