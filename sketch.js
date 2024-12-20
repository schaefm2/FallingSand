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
let w = 5; // pixel width of each square
let cols, rows;
let box = 3;
let sandHeight; //height of the sand at a col i

let hue = 200;
let time = 1;
let osc;
let freq = 0;
let soundStart = true;

let dropRate = .01;
function setup() {
  let canvas = createCanvas(1000, 500);
  canvas.position((windowWidth - width)/2, (windowHeight - height)/2);
  colorMode(HSB, 360, 255, 255); //the rainbows
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2darray(cols, rows);
  
  sandHeight = new Array(cols - 1);
  for(let i = 0; i < cols; i++){
    sandHeight[i] = rows;
  }
  console.log("Sand height and grid initialized");  

  osc = new p5.Oscillator('sin');
  osc.freq(freq);
  osc.amp(.05);
  
}

function draw() {

  //sound stuff
  if(!mouseIsPressed){
    if (freq > 0){
      freq -= .5;
    }
    else{
      osc.stop();
      soundStart = true;
    }
  }
  else{
    if(soundStart){
      osc.start();
      soundStart = false;
    }
  }

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
          
          // check to make sure we dont skip through layer
          if(fallingRow >= sandHeight[i]){
            nextgrid[i][sandHeight[i] - 1] = currentState;
            sandHeight[i] = sandHeight[i] - 1;
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
  osc.freq(freq);

}

function mouseDragged(){
  
  dropRate = 0.000005*freq*freq;
  if(freq < 200){
    freq += .5;
  }

  let col = Math.floor(mouseX / w);
  let row = Math.floor(mouseY / w);
  
  for (let i = -box; i < box; i++){
    for(let j = - box; j < box; j++){
      if(random(1) <  dropRate){

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