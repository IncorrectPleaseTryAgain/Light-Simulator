// ray.js

class Ray {

    constructor(pos, angle) {
        this.pos = createVector(pos.x, pos.y);
        this.direction = p5.Vector.fromAngle(angle);
    }

    /*
    * Name: Draw
    * Parameters: 2D Array, 2D Array
    * Return: N/A
    *
    * Description: This function checks all boundaries and wether or not the ray
    *              will intersect with it, if so then it gets the boundary closest
    *              to the source. If there are perimeter boundaries then the function
    *              includes these. After the closest boundary has been found that the ray
    *              will intersect with a line is drawn from the source to the point of 
    *              intersection
    *  
    */
    draw(boundaryList, perimeterList) {

        let closestBoundaryDistance = Infinity;
        let closestBoundaryPoint = null;
     
        for(let boundary of boundaryList) {
            
            const intersectionPoint = this.getPointOfIntersection(boundary);

            if(intersectionPoint) {
                const currDistance = p5.Vector.dist(this.pos, intersectionPoint);
                
                if(currDistance < closestBoundaryDistance){
                    closestBoundaryDistance = currDistance;
                    closestBoundaryPoint = intersectionPoint;
                }
            }
        }

        for(let perimeter of perimeterList) {
            const intersectionPoint = this.getPointOfIntersection(perimeter);

            if(intersectionPoint) {
                const currDistance = p5.Vector.dist(this.pos, intersectionPoint);
                
                if(currDistance < closestBoundaryDistance){
                    closestBoundaryDistance = currDistance;
                    closestBoundaryPoint = intersectionPoint;
                }
            }
        }

        if(closestBoundaryPoint) {
            push();

            let c = color('rgb(' +  [red(color(sourceColor)), green(color(sourceColor)), blue(color(sourceColor))].join(',') + ')');
            c.setAlpha(sourceBrightness);
            stroke(c);

            line(this.pos.x, this.pos.y, closestBoundaryPoint.x, closestBoundaryPoint.y);

            pop();
        }

    }

    /*
    * Name: Get Point Of Intersection
    * Parameters: Array of vectors
    * Return: vector
    *
    * Description: This function checks if a line starting at the source pointing 
    *              towards a specific direction will interect a boundary
    * 
    * Source: https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
    */
    getPointOfIntersection(boundary) {        
        
        //Boundary
        const x1 = boundary[0].x;
        const y1 = boundary[0].y;
        
        const x2 = boundary[1].x;
        const y2 = boundary[1].y;
        
        //Ray
        const x3 = this.pos.x;
        const y3 = this.pos.y;
        
        const x4 = this.pos.x + this.direction.x;
        const y4 = this.pos.y + this.direction.y;

        const denominator = ( ( (x1 - x2) * (y3 - y4) ) - ( (y1 - y2) * (x3 - x4) ) );

        if(denominator == 0) {
            return;
        }

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;

        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

        if(t >= 0 && t <= 1 && u >= 0) {

            const ptX = x1 + t * (x2 - x1);
            const ptY = y1 + t * (y2 - y1);

            const pointOfIntersection = createVector(ptX, ptY);

            return pointOfIntersection;
        }else {
            return;
        }

    }
};