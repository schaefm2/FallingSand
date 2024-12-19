function make2darray(cols, rows){
  let arr = new Array(cols);
  for(let i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
    for(let j = 0; j < arr[i].length; j++){
      arr[i][j] = 0;
    }
    
  }
  
  return arr;
}

let grid;
let w = 5;
let cols, rows;
let box = 3;
let sandHeight; //height of the sand at a col i

let hue = 200;
let time = 1;

function setup() {
  createCanvas(1000, 500);
  colorMode(HSB, 360, 255, 255);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2darray(cols, rows);
  
  sandHeight = new Array(cols - 1);
  for(let i = 0; i < cols; i++){
    //grid[i][0] = 1;
    sandHeight[i] = rows;
  }
  console.log(sandHeight);
  
  
}

function draw() {
  
  background(0);
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      noStroke();
      
      if(grid[i][j] > 0){
        fill(grid[i][j] % 360, 200, 200);
        let x = i * w;
        let y = j * w;
        square(x , y , w);
      }
    }
  }
  
  let nextgrid = make2darray(cols, rows);
  for(let i = cols - 1; i > -1; i--){
    for(let j = rows -1; j > -1; j--){
      let state = grid[i][j];

      if(state > 0){
        
        let below = grid[i][j + 1];
        let currentState = grid[i][j];
        //let row = j + floor(difference/10);
        if(below === 0 && j < rows - 1){
          nextgrid[i][j] = 0;
          
          let difference = time - currentState;
          let fallingRow = j + floor(difference/5);
          console.log("falling to row " + fallingRow);
          console.log("sandheight: " + sandHeight[i]);
          //sconsole.log(fallingRow);
          
          // check to make sure we dont skip through layer
          if(fallingRow >= sandHeight[i]){
            console.log("We set a new sandheight")
            nextgrid[i][sandHeight[i] - 1] = currentState;
            sandHeight[i] = sandHeight[i] - 1;

            
            //console.log(sandHeight[i]);
          }
          else{
            nextgrid[i][fallingRow] = currentState;
          }

          grid[i][j] =0;
          
          
        }
        else{
          //need something for sides
          // needs to fall to the sides every time
          // wont fall to the side when unless there are three under it.
          
          let dir = random([-1, 1])
          let left, right;
          if (i + dir >= 0 && i + dir< cols){
            left = grid[i + dir][j +1];
          }
          if (i - dir >= 0 && i - dir < cols ){
            right = grid[i - dir][j + 1];
          }
          if (left === 0){
            nextgrid[i + dir][j + 1] = currentState;
            sandHeight[i + dir] = j + 1;
          }
          else if(right === 0){
            nextgrid[i - dir][j + 1] = currentState;
            sandHeight[i - dir] = j + 1;
          }
          else{
            //if we stay in place here then this our sandHeight that we store
            if(grid[i][j -1] === 0 ){

              sandHeight[i] = j;
            }

            nextgrid[i][j] = currentState;
          }
          
        }
      }
    }
  }
  grid = nextgrid;
  time += 1;
  
}

function mouseDragged(){
  let col = Math.floor(mouseX / w);
  let row = Math.floor(mouseY / w);
  
  console.log("PLACE A NEW ONE HERE");
  
  for (let i = -box; i < box; i++){
    for(let j = - box; j < box; j++){
      if(random(1) < 0.25 ){

        let newCol = col + i;
        let newRow = row + j;
        if (grid[newCol][newRow] >0 ){
          continue;
        }
        grid[newCol][newRow] = time;
      }
    }
  }
    
  


}