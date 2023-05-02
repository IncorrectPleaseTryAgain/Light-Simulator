// source.js

/* GLOBAL VARIABLES */
const FOV = 360;
const ANGLE_SIZE_Light = 1;
const ANGLE_SIZE_DENSE = 0.1;
const ANGLE_SIZE_EXTREME = 0.05;
const DIAMETER = 10;

class Source {

    constructor() {this.pos = { } }

    /*
    * Name: Set Pos
    * Parameters: float, float
    * Return: N/A
    *
    * Description: This function sets the position of the source
    * 
    */
    setPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;            
    }

    /*
    * Name: Draw
    * Parameters: 2D Array, 2D Array
    * Return: N/A
    *
    * Description: This function handles drawing the source
    *              and the rays with the help of a SINGLE 
    *              nested function
    *  
    */
    draw(boundaryList, perimeterList) {
        push();

        noStroke();
        let c = color('rgb(' +  [red(color(sourceColor)), green(color(sourceColor)), blue(color(sourceColor))].join(',') + ')');
        c.setAlpha(sourceBrightness);
        fill(c);

        ellipse(this.pos.x, this.pos.y, DIAMETER);
        drawRays(this.pos);

        pop();

        /*
        * Name: Draw Rays
        * Parameters: vector
        * Return: N/A
        *
        * Description: This function creates a new ray instance at a cetain angle(Angle Size)
        *              for a certain angle range(FOV) depending on the ray strength mode
        * 
        */
        function drawRays(sourcePos) {

            if(rayStrength_Dense) {
                for(let a = 0; a < FOV; a += ANGLE_SIZE_DENSE) {
                    new Ray(sourcePos, radians(a)).draw(boundaryList, perimeterList);
                }
            }else if(rayStrength_Extreme) {
                for(let a = 0; a < FOV; a += ANGLE_SIZE_EXTREME) {
                    new Ray(sourcePos, radians(a)).draw(boundaryList, perimeterList);
                }
            }else {
                for(let a = 0; a < FOV; a += ANGLE_SIZE_Light) {
                    new Ray(sourcePos, radians(a)).draw(boundaryList, perimeterList);
                }
            }
        }
    }
};