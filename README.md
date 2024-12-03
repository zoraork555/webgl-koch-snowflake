# WebGL Koch Snowflake
This project uses a recursive function to generate a Koch snowflake fractal.

## Explanation
The depth of the snowflake is defined under global variable "Iterations" which can now be changed through the html page's input slider. The initial triangle's points are defined by "Vertices" 0, 1, and 2. WebGL is used in the generation, and the parent file is snowflake.html. A snowflake with 0 Iterations will generate a triangle, one with 1 Iteration will generate a star of David, etc. The following chart is an explanation of the naming scheme for variables within the code.

                . P3
               / \
     P1    P2 /   \ P4    P5         Koch Segment to show naming scheme of variables
       .____./     \.____.

## Files
snowflake.html handles all of the formatting and input for the html page.  
snowflake.js utilizes the WebGL tools to calculate all vertices for the snowflake and render them.  

## Running
When the file is run with all files in this repository, it should work. The html file can be opened in any web browser.  