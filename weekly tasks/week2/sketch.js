let currentColor;
let isErasing = false;
let brushSize = 10;
let bgColor = 255;

function setup() {
  createCanvas(800, 600);
  background(bgColor);
  currentColor = color(0, 0, 0);
}

function draw() {
  fill(0);
  noStroke();
  textSize(16);
  text("C: Change color | E: Eraser | B: Brush | Space: Clear", 20, 30);
  text("Current: " + (isErasing ? "Eraser" : "Brush"), 20, 55);
  
  if (!isErasing) {
    fill(currentColor);
    rect(20, 65, 30, 30);
  }
  
  if (mouseIsPressed) {
    if (isErasing) {
      stroke(bgColor);
      strokeWeight(brushSize);
    } else {
      stroke(currentColor);
      strokeWeight(brushSize);
    }
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function keyPressed() {
  if (key === 'e' || key === 'E') {
    isErasing = true;
  }
  if (key === 'b' || key === 'B') {
    isErasing = false;
  }
  
  if (key === 'c' || key === 'C') {
    currentColor = color(random(255), random(255), random(255));
    isErasing = false;
  }

  if (key === ' ') {
    background(bgColor);
  }
  
  if (key === '+' || key === '=') {
    brushSize = min(brushSize + 2, 30);
  }
  if (key === '-' || key === '_') {
    brushSize = max(brushSize - 2, 2);
  }
}

