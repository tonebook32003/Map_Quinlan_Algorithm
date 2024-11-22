
var map;
var directionsService;
var directionsRenderer;
var array = [];

const fileInput = document.querySelector('input[name="file"]');

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
        const data = reader.result;
        array = data.split('|');
        directions();
        // GTS();
    };
});

function directions() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: { lat: 10.801720556370942, lng: 106.65530426171239 },
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById("panel1"),
    });

    directionsRenderer.addListener("directions_changed", function () {
        computeTotalDistance(directionsRenderer.getDirections());
    });

    const waypoints = getOptimizedWaypoints();

    displayRoute(waypoints);
}

function applyGTS(waypoints) {
    const optimizedWaypoints = [waypoints[0]]; // Bắt đầu từ điểm xuất phát

    let cost = 0;
    let v = waypoints[0]; // V là đỉnh hiện tại đang làm việc


    for (let k = 1; k < waypoints.length; k++) {
        const unusedWaypoints = waypoints.filter((point) => {
            return !optimizedWaypoints.includes(point);
        });

        let w;

        for (let i = 0; i < unusedWaypoints.length; i++) {
            minCost = getCost(v, unusedWaypoints[i]).then((currentCost) => {
                cost += currentCost
            }); // Hàm tính chi phí từ V đến W
            w = unusedWaypoints[i];
        }
        // Thêm cung (V, W) vào Tour và cập nhật chi phí
        optimizedWaypoints.push(w);
        // Đặt W là đỉnh hiện tại để xét bước kế tiếp
        v = w;
    }

    return optimizedWaypoints;
}



function displayRoute(waypoints) {
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const intermediateWaypoints = waypoints.slice(1, -1);

    const request = {
        origin: origin,
        destination: destination,
        waypoints: intermediateWaypoints.map((waypoint) => ({ location: waypoint })),
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
    };
    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("Yêu cầu hướng dẫn đường thất bại do " + status);
        }
    });
}

function computeTotalDistance(result) {
    let total = 0;
    const myroute = result.routes[0];

    if (!myroute) {
        return;
    }

    for (let i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000;
    var id = document.getElementById('tong');
    id.innerHTML = "Tổng quãng đường: " + total + " km";
}

function getOptimizedWaypoints() {
    var value = document.getElementById('pac-input').value
    var value1 = document.getElementById('pac-input1').value

    if (value != "" && value1 != "" && value !== value1) {
        if (!array.includes(value) && !array.includes(value1)) {
            array.push(value)
            array.push(value1)
        }
    }

    if (array.length === 0) {
        alert("dữ liệu chua nhập đủ")
        window.onload()
    }
    return array;
}

function getOptimizedWaypoints1() {
    // ... code hiện tại ...
    var value = document.getElementById('pac-input').value
    var value1 = document.getElementById('pac-input1').value
    if (value != "" && value1 != "" && value !== value1) {
        if (!waypoints.includes(value) && !waypoints.includes(value1)) {
            waypoints.push(value)
            waypoints.push(value1)
        }
    }

    // Sử dụng thuật toán GTS để tối ưu hóa thứ tự của các điểm trung gian
    const optimizedWaypoints = applyGTS(waypoints);
    return optimizedWaypoints;
}
function getOptimizedWaypoints2() {

    // Sử dụng thuật toán GTS để tối ưu hóa thứ tự của các điểm trung gian
    const optimizedWaypoints = applyGTS(array);
    return optimizedWaypoints;
}
function getCost(origin, destination) {
    const directionsService = new google.maps.DirectionsService();

    // Tạo một yêu cầu hướng dẫn từ origin đến destination
    const request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
    };
    // Gửi yêu cầu hướng dẫn và tính toán chi phí
    return new Promise((resolve, reject) => {
        directionsService.route(request, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                const route = response.routes[0];
                let bestCost = Infinity;

                // Tìm chi phí tốt nhất từ các tuyến đường có thể
                for (let i = 0; i < route.legs.length; i++) {
                    const leg = route.legs[i];
                    let totalDistance = leg.distance.value;

                    const costPerMeter = 0.1; // Giả sử chi phí là 0.1 đơn vị tiền tệ cho mỗi mét
                    const cost = totalDistance * costPerMeter;

                    if (cost < bestCost) {
                        bestCost = cost;
                    }
                }
                resolve(bestCost);
            } else {
                reject("Không tìm thấy đường đi. Lỗi: " + status);
            }
        });
    });

}
const waypoints = [];
function GTS() {
    const optimizedWaypoints = getOptimizedWaypoints1();
    // const optimizedWaypoints = getOptimizedWaypoints2();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const mapOptions = {
        center: { lat: 10.801720556370942, lng: 106.65530426171239 },
        zoom: 12,
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    directionsRenderer.setMap(map);

    // Create a directions request
    const request = {
        origin: optimizedWaypoints[0],
        destination: optimizedWaypoints[optimizedWaypoints.length - 1],
        waypoints: optimizedWaypoints.slice(1, -1).map((waypoint) => ({ location: waypoint })),
        travelMode: google.maps.TravelMode.DRIVING,
        avoidTolls: true,
    };
    // Send the directions request and display the result on the map
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);
        } else {
            console.log("Failed to find the route. Error: " + status);
        }
    });
}

