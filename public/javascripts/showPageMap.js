// logic taken from Mapbox GL JS Docs: https://docs.mapbox.com/mapbox-gl-js/guides/
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25, anchor: 'bottom-left', closeButton: false})
        .setHTML(`<p>${title}</p>`)
)
.addTo(map)