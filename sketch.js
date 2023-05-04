/*  Michael Steenkamp
*   29/04/2023
*   Light Simulator
*
*   Language: 
*           JavaScript
*   Library:
*           p5.js
*   Sources:
*           https://www.youtube.com/watch?v=TOEi6T2mtHo&t=1530s
*           https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection 
*           https://stackoverflow.com/a/6877674
*   Description:
*              This program allows the user to draw boundaries on the canvas.
*              The user is then able to simulate how light would react to those
*              bariers.
*/

/* GLOBAL VARIABLES */
//Canvas
let canvasWidth = 0; //float
let canvasHeight = 0; //float

//Boundary
const BOUNDARY_GREY_SCALE = 0; //float
const BOUNDARY_ALPHA = 255; //float
let boundaryStrokeWeight = 5; //float

//Source
let sourceBrightness = 145; //float
let sourceColor = "#ffffff"; //string

//Ray
let rayStrength_Light = true; //boolean
let rayStrength_Dense = false; //boolean
let rayStrength_Extreme = false; //boolean

/* EVENT FUNCTIONS */
//Settings

/*
* Name: Boundary Perimeter
* Parameters: N/A
* Return: N/A
*
* Description: This function dictates whether a boundary perimeter
*              should be added depending on the value of the checkbox.
* 
* Trigger: html checkbox
*/
function event_settings_boundaryPerimeter() {
  if(document.getElementById("input_boundaryPerimeter").checked) {
    this.boundaries.addPerimeter();
  }else {
    this.boundaries.removePerimeter();
  }
}

/*
* Name: Ray Strength
* Parameters: N/A
* Return: N/A
*
* Description: This function determines which ray stregth radio is active
* 
* Trigger: html radio
*/
function event_settings_rayStrength() {
  rayStrength_Light = document.getElementById("input_rayStrength_Light").checked;
  rayStrength_Dense = document.getElementById("input_rayStrength_Dense").checked; 
  rayStrength_Extreme = document.getElementById("input_rayStrength_Extreme").checked;
}

/*
* Name: Boundary Stroke Weigth
* Parameters: N/A
* Return: N/A
*
* Description: This function sets the boundary stroke weight depending on the range slider,
*              it also updates the label next to the slider.
* 
* Trigger: html range slider
*/
function event_settings_boundaryStrokeWeight() {
  boundaryStrokeWeight = document.getElementById("input_boundaryStrokeWeight").value;
  document.getElementById("output_boundaryStrokeWeight").innerHTML = boundaryStrokeWeight;

}

/*
* Name: Source Brightness
* Parameters: N/A
* Return: N/A
*
* Description: This function sets the source brightness depending on the range slider,
*              it also updates the label next to the slider. 
* 
* Trigger: html range slider
*/
function event_settings_sourceBrightness() {
  sourceBrightness = document.getElementById("input_sourceBrightness").value;
  document.getElementById("output_sourceBrightness").innerHTML = sourceBrightness;
}

/*
* Name: Source Color
* Parameters: N/A
* Return: N/A
*
* Description: This function sets the source color depending on the color chosen.
* 
* Trigger: html color picker
*/
function event_settings_sourceColor() {
  sourceColor = document.getElementById("input_sourceColor").value;
}


//Actions

/*
* Name: Inserting Boundary
* Parameters: N/A
* Return: N/A
*
* Description: This function triggers the pause code brach in the draw function,
*              as well as setting the mode to inserting boundary
* 
* Trigger: html button
*/
function event_action_insertboundary() {

  if(this.removeBoundaries) {
    this.removeBoundaries = false;
  }

  if(this.insertingBoundary) {
    this.pause = false;
    this.insertingBoundary = false;
  } else {
    this.pause = true;
    this.insertingBoundary = true;
  }
}

/*
* Name: Removing Boundary
* Parameters: N/A
* Return: N/A
*
* Description: This function triggers the pause code brach in the draw function,
*              as well as setting the mode to removing boundary
* 
* Trigger: html button
*/
function event_action_removeboundary() {

  if(this.insertingBoundary) {
    this.insertingBoundary = false;
  }

  if(this.removingBoundary) {
    this.pause = false;
    this.removingBoundary = false;
  } else {
    this.pause = true;
    this.removingBoundary = true;
  }
}

/*
* Name: Generate Random
* Parameters: N/A
* Return: N/A
*
* Description: This function calls a function from the boundaries class instence
*              to create a boundary at a random location within the canvas
* 
* Trigger: html button
*/
function event_action_generateRandom() {
  this.boundaries.generateRandom();
}

/*
* Name: Clear Canvas
* Parameters: N/A
* Return: N/A
*
* Description: This function calls a fruntion from the boundares instance
*              that clears the canvas from any boundaries
*
* Trigger: html button 
*/
function event_action_clearcanvas() {
  this.boundaries.clear();
}

/*
* Name: Done
* Parameters: N/A
* Return: N/A
*
* Description: This function triggers the non-pause branch in the draw function
*              as well as setting the mode back to default
* 
* Trigger: html button
*/
function event_action_done() {
  this.pause = false;

  this.insertingBoundary = false;
  this.removeBoundaries = false;
}


//Overloaded

/*
* Name: Window Resized
* Parameters: N/A
* Return: N/A
*
* Description: This function changes the canvas dimentions to fit the
*              new window size as well as redrawing the background and
*              re-initializing the draw function
* 
* Trigger: window size changes
*/
function windowResized() {

  this.boundaries.windowResize(document.getElementById("canvas").offsetWidth, document.getElementById("canvas").offsetHeight);

  canvasWidth = document.getElementById("canvas").offsetWidth;
  canvasHeight = document.getElementById("canvas").offsetHeight;

  resizeCanvas(canvasWidth, canvasHeight, true);
  drawBackground();

  //Resize perimeter
  if(document.getElementById("input_boundaryPerimeter").checked) {
    this.boundaries.removePerimeter();
    this.boundaries.addPerimeter();
  }

  draw();
}

/*
* Name: Mouse Pressed
* Parameters: N/A
* Return: N/A
*
* Description: This function handels the insertation and removal of boundaries.
*
*              When inserting a new boundary this function sets the value for
*              for both enpoints of the line segment. It also calls a function
*              from the boundaries instance that adds the line segment connecting
*              those two endpoints as a new boundary.
* 
*              When removing a boundary this function makes sure the mouse is 
*              within the canvas and then calls a function from the boundaries
*              instance that handles the removal of boundaries.
*
* Trigger: any mouse button pressed
*/
function mousePressed() {
  if(this.insertingBoundary) {
    if(winMouseX <= canvasWidth) {
      if(this.currPointIndex == 1) {

        this.pointA = createVector(winMouseX, winMouseY);
        this.currPointIndex++;

      }else if(this.currPointIndex == 2) {

        this.pointB = createVector(winMouseX, winMouseY);
        this.boundaries.addBoundary(this.pointA, this.pointB);
        this.currPointIndex = 1;

      }else {
        this.currPointIndex = 1;
      }
    }
  }
  else if(this.removingBoundary) {

    if(winMouseX <= canvasWidth) {
      this.boundaries.removeBoundaries();
    }

  }
}


//Draw

/*
* Name: Draw Insert Boundary Pos UI
* Parameters: N/A
* Return: N/A
*
* Description: This function and its TWO nested functions together
*              handle the functionality for the UI generated when
*              the mouse is on top of the canvas and the inserting
*              boundary mode is triggered
*
* Preview: (mouseX , mouseY)
*/
function drawInsertBoundaryPosUI() {
  push();

  stroke(0);
  fill(0);
  textAlign(CENTER, CENTER);

  if(winMouseX <= canvasWidth) {
    drawCoordinates(mousePosToString());
    ellipse(winMouseX, winMouseY, 5);
  }

  
  /*
  * Name: Mouse Pos To String
  * Parameters: N/A
  * Return: string
  *
  * Description: This function formats and returns the position
  *              of the mouse on the canvas
  * 
  */
  function mousePosToString() {
    return "(" +  winMouseX + " , " + winMouseY + ")";
  }

  
  /*
  * Name: Draw Coordinates
  * Parameters: string
  * Return: N/A
  *
  * Description: This function draws the mouse position onto the canvas
  *              and handles UI offset once the mouse gets to a certain
  *              range from the edges of the canvas
  * 
  */
  function drawCoordinates(pos) {

    if(winMouseX < 23) {
      if(winMouseY < 14) {
        text(pos, winMouseX + 30, winMouseY + 15);
      }else {
        text(pos, winMouseX + 30, winMouseY - 10);
      }
    }else if(winMouseY < 24) {
      if(winMouseX > canvasWidth - 25) {
        text(pos, winMouseX - 30, winMouseY + 15);
      } else {
        text(pos, winMouseX, winMouseY + 15);
      }
    }else if(winMouseX > canvasWidth - 25) {
      text(pos, winMouseX - 30, winMouseY - 15);
    }else {
      text(pos, winMouseX, winMouseY - 15);
    }
  }

  pop();
}

/*
* Name: Draw Imaginary Boundary
* Parameters: N/A
* Return: N/A
*
* Description: This function draws a dashed line that is a preview of where
*              the new boundary would be placed
* 
*/
function drawImaginaryBoundary() {
  push();

  strokeWeight(boundaryStrokeWeight);
  stroke(BOUNDARY_GREY_SCALE);
  drawingContext.setLineDash([5, 15]);

  line(this.pointA.x, this.pointA.y, winMouseX, winMouseY);

  pop();
}

/*
* Name: Draw Background
* Parameters: float, float
* Return: N/A
*
* Description: This function handles drawing the canvas background
* 
*/
function drawBackground(colorMultiplier = 1, alphaMultiplier = 1) {
  const R = 100 * colorMultiplier;
  const G = 100 * colorMultiplier;
  const B = 100 * colorMultiplier;
  const A = 255 * alphaMultiplier;
  
  background(R, G, B, A);
}

/*
* Name: Setup
* Parameters: N/A
* Return: N/A
*
* Description: This functions handles the creation of both the 
*              boundaries and source class instances. It also
*              creates the canvas and calls TWO nested functions
*              that initialize any other private and
*              html element specific variables
* 
*/
function setup() {

  //Class Instances
  this.boundaries = new Boundaries();
  this.source = new Source();

  canvasWidth = document.getElementById("canvas").offsetWidth;
  canvasHeight = document.getElementById("canvas").offsetHeight;

  createCanvas(canvasWidth, canvasHeight);

  initializeDocument();
  initiaizePrivateVariables();

  
  /*
  * Name: Initialize Document
  * Parameters: N/A
  * Return: N/A
  *
  * Description: This function initializes any html specific variables
  * 
  */
  function initializeDocument() {
    document.getElementById("input_boundaryPerimeter").checked = true;
    this.event_settings_boundaryPerimeter();
  
    document.getElementById("input_rayStrength_Light").checked = rayStrength_Light;
    document.getElementById("input_rayStrength_Dense").checked = rayStrength_Dense;
    document.getElementById("input_rayStrength_Extreme").checked = rayStrength_Extreme; 
  
    document.getElementById("input_boundaryStrokeWeight").value = boundaryStrokeWeight;
    document.getElementById("output_boundaryStrokeWeight").innerHTML = boundaryStrokeWeight;
  
    document.getElementById("input_sourceBrightness").innerHTML = sourceBrightness;
    document.getElementById("output_sourceBrightness").value = sourceBrightness;
  
    document.getElementById("input_sourceColor").value = sourceColor;
  
  }

  /*
  * Name: Initialize Private Variables
  * Parameters: N/A
  * Return: N/A
  *
  * Description: This function initializes the private variables
  * 
  */
  function initiaizePrivateVariables() {

    //Actions
    this.pause = false;
  
    //Insert Boundary
    this.insertingBoundary = false;
    this.currPointIndex = 1;
    this.pointA = 0;
    this.pointB = 0;
  
    //Removing Boundary
    this.removingBoundary = false;
  }

}

/*
* Name: Draw
* Parameters: N/A
* Return: N/A
*
* Description: This function handles what is seen on the canvas
*              when the mode 'pause' is true or false.
*
*              When the 'pause' mode is active then the function
*              handles the inserting and removing boundary modes
*              depending on which one is active.
*
*              When the 'pause' mode is inactive then the function
*              calls functions from both the source and boundaries
*              instances which draw the boundaries, rays, and source.
* 
*/
function draw() {

  if(this.insertingBoundary && this.removeBoundaries) {

    this.pause = false;
    this.insertingBoundary = false;
    this.removeBoundaries = false;

  }
  
  if(!pause) {

    drawBackground();

    if(winMouseX < canvasWidth) {
      this.source.setPos(winMouseX, winMouseY);
      this.source.draw(this.boundaries.getBoundaryList(), this.boundaries.getPerimeterList());
    }

    this.boundaries.draw();

  }else {

    drawBackground(1.5, 1);

    this.boundaries.draw();

    if(this.insertingBoundary) {

      this.drawInsertBoundaryPosUI();

      if(this.currPointIndex == 2) {
        this.drawImaginaryBoundary();
      }

    }
    else if(this.removingBoundary) {
      this.boundaries.drawRemovableBoundaries();
    }
  }
}
