// Constants for image manipulation
const MOVE_STEP = 10; // Pixels to move in each direction
const ZOOM_STEP = 0.05; // Scaling factor for zooming
const MIN_SCALE = 0.1; // Minimum scale limit

// Initialize DOM elements and canvas context
const canvas = document.getElementById("photoCanvas");
const ctx = canvas.getContext("2d");
const image = new Image();
const errorMessage = document.getElementById("errorMessage");
const downloadButton = document.getElementById("downloadButton");
const photoUpload = document.getElementById("photoUpload");

// State variables for image manipulation
let offsetX = 0;
let offsetY = 0;
let scale = 1;

// Enable download button when image is uploaded
photoUpload.addEventListener("change", (event) => {
  handleImageUpload(event);
  downloadButton.disabled = false; // Enable button once image is uploaded
});

// Function to handle image file upload and initiate image loading
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      loadImage(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    displayError("No file selected");
  }
}

// Function to set image source and trigger draw on load
function loadImage(src) {
  image.src = src;
  image.onload = drawImage;
  image.onerror = () => displayError("Failed to load image");
}

// Function to clear canvas and draw the image with current transformations
function drawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const imgWidth = image.width * scale;
  const imgHeight = image.height * scale;
  const x = (canvas.width - imgWidth) / 2 + offsetX;
  const y = (canvas.height - imgHeight) / 2 + offsetY;

  ctx.drawImage(image, x, y, imgWidth, imgHeight);
}

// Function to move the image based on direction input
function moveImage(direction) {
  switch (direction) {
    case "up":
      offsetY -= MOVE_STEP;
      break;
    case "down":
      offsetY += MOVE_STEP;
      break;
    case "left":
      offsetX -= MOVE_STEP;
      break;
    case "right":
      offsetX += MOVE_STEP;
      break;
    default:
      displayError("Invalid move direction");
  }
  drawImage();
}

// Function to zoom the image in or out
function zoomImage(direction) {
  if (direction === "in") {
    scale += ZOOM_STEP;
  } else if (direction === "out" && scale > MIN_SCALE) {
    scale -= ZOOM_STEP;
  } else {
    displayError("Invalid zoom direction or minimum scale reached");
  }
  drawImage();
}

// Function to download the image with current transformations
function downloadImage() {
  const downloadCanvas = document.createElement("canvas");
  const downloadCtx = downloadCanvas.getContext("2d");

  downloadCanvas.width = canvas.width;
  downloadCanvas.height = canvas.height;

  downloadCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = "adjusted_photo.jpeg";
  link.href = downloadCanvas.toDataURL("image/jpeg");
  link.click();
}

// Helper function to display error messages
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.style.color = "red";
}

// Event listeners for file upload and transformations
document
  .getElementById("photoUpload")
  .addEventListener("change", handleImageUpload);
downloadButton.addEventListener("click", downloadImage);

// Event delegation for control buttons using `data-action` attributes
document.querySelectorAll(".control-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const action = event.target.getAttribute("data-action");
    if (action === "zoomIn" || action === "zoomOut") {
      zoomImage(action === "zoomIn" ? "in" : "out");
    } else {
      moveImage(action);
    }
  });
});
