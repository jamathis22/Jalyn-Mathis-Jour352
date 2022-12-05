$(document).ready(function () {
    drawMap("bob_s_mini_mart", 9)
});


$("button").click(function () {
    $("button").removeClass("active")
    $(this).addClass("active")
    var value = $(this).val()
    console.log(value)
    if (value == "west_virginia") {
        drawMap("bob_s_mini_mart", 9)
    } else if (value == "rhode_island") {
        drawMap("cumberland_farms", 12)
    } else if (value == "illinois") {
        drawMap("lucky_mart", 12)
    } else if (value == "colorado") {
        drawMap("daytona_mart", 11)
    } else if (value == "chicago") {
        drawMap("bi_rite_deli", 10)
    } else if (value == "michigan") {
        drawMap("diamond_dot_market", 11)
    } else if (value == "maryland") {
        drawMap("express_mart", 11)
    } else if (value == "florida") {
        drawMap("grand_central_station", 11)
    } else if (value == "arkansas") {
        drawMap("kwik_chek_iii", 11)
    }
});

$("button").hover(function () {
    $("button").css("opacity", 0.5)
    $(this).css("opacity", 1)
},
    function () {
        $(this).css("opacity", 0.5)
        $(".active").css("opacity", 1)
    })


var geojson;

var marker;

var legend;

var map = L.map('map', {
    scrollWheelZoom: false,
    // doubleClickZoom: false
}).setView([38.728671, -79.972005], 9);

var osmLayer = new L.TileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWFkaXR0YW1iZSIsImEiOiJja3YxMXNzNjI3c2RhMnFxNnFqajZqdnZwIn0.a9gwkXW78sxu51NyWADROA', {
    id: 'mapbox/light-v10',
    // maxZoom: 12,
    // minZoom: 3,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
});

map.addLayer(osmLayer)

function getColor(d) {
    colors = ["#e9e8ea", "#990000"]
    const scale = chroma.scale(colors).domain([minValue, maxValue]);
    return scale(d).hex();
}

function getStyle(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: '#0a0a0a',
        fillOpacity: 0.8,
        fillColor: getColor(feature.properties["percent_visits"])
    };
}
function myFun(aadit) {
    console.log(aadit)
}

function drawMap(storeName, zoom) {
    console.log(storeName)
    if (geojson) {
        geojson.clearLayers();
    }
    if (marker) {
        map.removeLayer(marker);
    }
    if (legend) {
        map.removeControl(legend)
    }

    d3.json(`store_geojsons/${storeName}.geojson`).then(function (data) {
        var storeName = (data.features[0].properties.location_name);
        var cityName = (data.features[0].properties.city);
        var stateName = (data.features[0].properties.region);
        var streetName = (data.features[0].properties.street_address);
        var totalPercentVisits = (Math.round((data.features[0].properties.sum) * 100) / 100).toFixed(0).toLocaleString("en-US");
        // var totalPercentVisits = (data.features[0].properties.sum)
        // var sales = (data.features[0].properties.sales)
        console.log(data.features[0].properties)
        d3.selectAll(".store-name")
            .text(storeName)

        d3.selectAll(".store-loc")
            .text(`${cityName}, ${stateName}`)

        d3.select("#store-sales")
            .text("TK")

        d3.select("#total-percent-visits")
            .text(totalPercentVisits)

        d3.select("#store-address")
            .text(streetName)

        var arrayItems = []
        for (num in data.features) {
            var eachItem = data.features[num].properties["percent_visits"]
            arrayItems.push(eachItem)
        }

        minValue = Math.min(...arrayItems)
        maxValue = Math.max(...arrayItems)

        var storeLat = data.features[0].properties["latitude"]
        var storeLon = data.features[0].properties["longitude"]

        console.log("min:", minValue)
        console.log("max:", maxValue)

        geojson = L.geoJson(data, {
            style: getStyle,
        }).on('mouseover', function (e) {
            var visitors = (Math.round((e.sourceTarget.feature.properties.percent_visits) * 100) / 100).toFixed(2).toLocaleString("en-US")
            d3.select("#visitorPercentage")
                .text(`Customers from this tract: ${visitors}%`)
            console.log("percent visitors from here:", e.sourceTarget.feature.properties.percent_visits);
        }).on('mouseout', function (e) {
            d3.select("#visitorPercentage")
                // .select("p")
                .html("")

            d3.select("#visitorPercentage").append("p").append('i')
                .text(`Hover over a census tract to see the percentage of visitors who came to ${storeName} from a particular neighborhood.`)
        }).addTo(map)

        map.flyTo([storeLat, storeLon], zoom, { animate: false });
        marker = L.circleMarker([storeLat, storeLon], {
            stroke: true,
            color: '#fbd603',
            weight: 1,
            opacity: 1,
            radius: 6,
            fill: true,
            fillOpacity: 0.8,
        }).addTo(map).bindPopup(storeName);

        // LEGEND
        legend = L.control({ position: 'bottomright' });

        legend.onAdd = function (map) {

            var div = L.DomUtil.create('div', 'info legend');

            let formatted_minValue = (Math.round(minValue * 100) / 100).toFixed(2).toLocaleString("en-US");
            let formatted_maxValue = (Math.round(maxValue * 100) / 100).toFixed(2).toLocaleString("en-US");

            var textLegend = `<div class="legend legend-horizontal">
                    <div><span class="legend-box x"></span> <span class="legend-value">${formatted_minValue}%</span></div>
                    <div><span id="colorBox" class="legend-box y"></span> <span class="legend-value">${formatted_maxValue}%</span></div>
                    </div>`

            div.innerHTML = textLegend;
            return div;
        };
        legend.addTo(map);
    })
}

$(document).ready(function () {
    var pymChild = new pym.Child({ id: "foot-traffic-graphic" });
});
