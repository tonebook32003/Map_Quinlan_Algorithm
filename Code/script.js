document.getElementById('togglePacCard').addEventListener('click', function () {
    // Lấy phần tử pac-card
    var pacCard = document.getElementById('pac-card');

    // Toggle lớp CSS "minimized" trên pac-card
    pacCard.classList.toggle('minimized');
});

var mapOptions = {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
    zoomControl: true, // Show default zoom controls
    zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL, // Change the style of zoom control
    },
};
map = new google.maps.Map(document.getElementById('map'), mapOptions);
var mapOptions = {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
    mapTypeControl: true, // Show default map type control
    mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR, // Change the style of map type control
        position: google.maps.ControlPosition.BOTTOM_LEFT, // Change the position of the map type control
    },
};

map = new google.maps.Map(document.getElementById('map'), mapOptions);

