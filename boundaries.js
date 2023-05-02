// boundaries.js


class Boundaries {
    constructor() { 
        this.boundaryList = Array();
        this.perimeterList = Array();
    }

    /*
    * Name: Add Boundary
    * Parameters: vector, vector
    * Return: N/A
    *
    * Description: This function handles adding an array containing the
    *              two endpoints of a line segment to the array containing
    *              all of the boundaries
    * 
    */
    addBoundary(pointA, pointB) {
        this.boundaryList.push([pointA, pointB]);
    }

    /*
    * Name: Remove Boundaries
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function gets the mouse position and then checks each
    *              boundary and if the mouse position is within that boundarys
    *              stroke weight then the boundary is removed
    * 
    */
    removeBoundaries() {
        let pointOfInterest = createVector(winMouseX, winMouseY);

        for(let boundary of this.boundaryList) {

            const pointA = createVector(boundary[0].x, boundary[0].y);
            const pointB = createVector(boundary[1].x, boundary[1].y);

            if(this.getDistanceFromLineSegment(pointA, pointB, pointOfInterest) < boundaryStrokeWeight) {

                const index = this.boundaryList.indexOf(boundary);

                if (index > -1) {
                    this.boundaryList.splice(index, 1);
                }
            }
        }
    }

    /*
    * Name: Clear
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function clears the list of boundaries
    *  
    */
    clear() {
        this.boundaryList = [];
    }

    /*
    * Name: Draw
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function draws all boundaries from the list
    *              of boundaries as well as from the lis of perimeter
    *              boundaries
    *
    */
    draw() {
        push();

        strokeWeight(boundaryStrokeWeight);
        stroke(BOUNDARY_GREY_SCALE, BOUNDARY_ALPHA);
        
        for(let boundary of this.boundaryList) {
            line(boundary[0].x, boundary[0].y, boundary[1].x, boundary[1].y);
        }

        for(let perimeter of this.perimeterList) {
            line(perimeter[0].x, perimeter[0].y, perimeter[1].x, perimeter[1].y);
        }

        pop();
    }

    /*
    * Name: Add Perimeter
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function adds a set of vertices to the list 
    *              of perimeter boundaries for each side of the canvas
    * 
    */
    addPerimeter() {
        const TOP_A = createVector(0, canvasHeight);
        const TOP_B = createVector(canvasWidth, canvasHeight);

        const Right_A = createVector(canvasWidth, canvasHeight);
        const Right_B = createVector(canvasWidth, 0);
        
        const LEFT_A = createVector(canvasWidth, 0);
        const LEFT_B = createVector(0, 0);
        
        const BOTTOM_A = createVector(0, 0);
        const BOTTOM_B = createVector(0, canvasHeight);

        this.perimeterList.push([TOP_A, TOP_B]);
        this.perimeterList.push([Right_A, Right_B]);
        this.perimeterList.push([LEFT_A, LEFT_B]);
        this.perimeterList.push([BOTTOM_A, BOTTOM_B]);
    }

    /*
    * Name: Remove Perimeter
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function clears the list of perimeter boundaries
    * 
    */
    removePerimeter() {
        this.perimeterList = [];
    }

    /*
    * Name: Draw Removable Boundaries
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function gets the mouse position and then draws a red
    *              boundary at each location where the mouse overlaps any 
    *              boundary stroke weight
    * 
    */
    drawRemovableBoundaries() {

        let pointOfInterest = createVector(winMouseX, winMouseY);

        for(let boundary of this.boundaryList) {

            const pointA = createVector(boundary[0].x, boundary[0].y);
            const pointB = createVector(boundary[1].x, boundary[1].y);

            if(this.getDistanceFromLineSegment(pointA, pointB, pointOfInterest) < boundaryStrokeWeight) {
                push();

                strokeWeight(boundaryStrokeWeight);
                stroke(255, 0, 0, BOUNDARY_ALPHA);
                line(pointA.x, pointA.y, pointB.x, pointB.y);

                pop();
            }
        }
    }

    /*
    * Name: Get Distance From Line Segment
    * Parameters: vector, vector, vector
    * Return: N/A
    *
    * Description: This function gets the distance a point is from
    *              a line segment
    * 
    * Source: https://stackoverflow.com/a/6877674 
    */
    getDistanceFromLineSegment(A, B, C) {
        // Line Segment: (A.x , A.y) --> (B.x , B.y)
        // Point Of Interest: (C.x , C.y)

        const AB = dist(A.x, A.y, B.x, B.y);
        const BC = dist(B.x, B.y, C.x, C.y);
        const CA = dist(C.x, C.y, A.x, A.y);

        let distance = 0;

        //True: Angle A is obtuse
        if(pow(BC, 2) > (pow(CA, 2) + pow(AB, 2))) {
            distance = CA;
        }
        //True: Angle B is obtuse
        else if(pow(CA, 2) > (pow(BC, 2) + pow(AB, 2))){
            distance = BC;
        }
        else {
            const s = (AB + BC + CA) / 2;
            distance = 2/AB * sqrt(s * (s - AB) * (s - BC) * (s - CA));
        }

        return distance;

    }

    /*
    * Name: Get Boundary List
    * Parameters: N/A
    * Return: 2D Array
    *
    * Description: This function return the private variable containing
    *              a list of all the boundary line segment endpoints
    *  
    */
    getBoundaryList() {
        return this.boundaryList;
    }

    /*
    * Name: Get Perimeter List
    * Parameters: N/A
    * Return: 2D Array
    * 
    * Description: This function return the private variable containing
    *              a list of all the perimeter boundary line segment endpoints
    * 
    */
    getPerimeterList() {
        return this.perimeterList;
    }

    /*
    * Name: Generate Random
    * Parameters: N/A
    * Return: N/A
    *
    * Description: This function generate two random endpoint locatons
    *              for a line segment and then calls a function that adds
    *              a boundary at those endpoints
    *  
    */
    generateRandom() {
        let A = createVector(random(canvasWidth), random(canvasHeight));
        let B = createVector(random(canvasWidth), random(canvasHeight));
        this.addBoundary(A, B);
    }
};