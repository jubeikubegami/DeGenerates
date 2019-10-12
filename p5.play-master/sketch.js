//flappy bird-like
//mouse click or x to flap

var GRAVITY = 0.3;
var FLAP = -7;
var GROUND_Y = 450;
var MIN_OPENING = 300;
var bird, ground;
var pipes;
var gameOver;
var birdImg, pipeImg, groundImg, bgImg;
var chaChing;
var deathScream;
var jump;
var music;
var button;
// let TrumpPct = [];
var pctSum = 0;
var pctAvg;
var count = 0;

var currentCandidate = "Biden";

// let button, greeting;

function preload(){
  chaChing = loadSound ("assets/chaChing.m4a")
  deathScream = loadSound ("assets/scream.wav")
  jump = loadSound ("assets/jump.wav")
  music = loadSound ("assets/bensound-theelevatorbossanova.mp3")

  //my table is comma separated value "csv"
  //and has a header specifying the columns labels
  president_primary_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/president_primary_polls.csv', 'csv', 'header');
  president_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/president_polls.csv', 'csv', 'header');
  senate_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/senate_polls.csv', 'csv', 'header');
  house_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/house_polls.csv', 'csv', 'header');
  governor_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/governor_polls.csv', 'csv', 'header');
  president_approval_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/president_approval_polls.csv', 'csv', 'header');
  generic_ballot_polls_table = loadTable('https://projects.fivethirtyeight.com/polls-page/generic_ballot_polls.csv', 'csv', 'header');
  //the file can be remote
  //table = loadTable("http://p5js.org/reference/assets/mammals.csv",
  //                  "csv", "header");
}

function setup() {

  createCanvas(800, 600);

  updateData();

  music.play();
  birdImg = loadImage('assets/trump.png');
  pipeImg = loadImage('assets/pipe.png');
  groundImg = loadImage('assets/ground.png');
  bgImg = loadImage('assets/background.png');

  bird = createSprite(width/2, height/2, 40, 40);
  bird.rotateToDirection = true;
  // bird.velocity.x = pctAvg/5;
  // print("Velocity is now " + bird.velocity.x + " for " + currentCandidate + ".");
  updateVelocityX();
  bird.setCollider('circle', 0, 0, 20);
  bird.addImage(birdImg);

  ground = createSprite(800/2, GROUND_Y+100); //image 800x200
  ground.addImage(groundImg);

  pipes = new Group();
  gameOver = true;
  updateSprites(false);

  camera.position.y = height/2;

  //changing character to Pete Buttigieg
button = createButton("buttigieg");
button.mousePressed(changeButtigieg);
  //changing character to Kamala Harris
button = createButton("harris");
button.mousePressed(changeHarris);
  //changing character to Amy Klobuchar
button = createButton("klobuchar");
button.mousePressed(changeKlobuchar);
  //changing character to Beto O'rourke
button = createButton("orourke");
button.mousePressed(changeOrourke);
  //changing character to Donald Trump
button = createButton("trump");
button.mousePressed(changeTrump);
  //changing character to Joe Biden
button = createButton("biden");
button.mousePressed(changeBiden);
  //changing character to Corey Booker
button = createButton("booker");
button.mousePressed(changeBooker);
  //changing character to Bernie Sanders
button = createButton("sanders");
button.mousePressed(changeSanders);
  //changing character to Elizabeth Warren
button = createButton("warren");
button.mousePressed(changeWarren);
  //changing character to Andrew Yang
button = createButton("yang");
button.mousePressed(changeYang);

}



function draw() {

  if(gameOver && keyWentDown('x'))
    newGame();

  if(!gameOver) {

    if(keyWentDown('x'))
      bird.velocity.y = FLAP;

    bird.velocity.y += GRAVITY;

    if(bird.position.y<0)
      bird.position.y = 0;

    if(bird.position.y+bird.height/2 > GROUND_Y)
      die();

    if(bird.overlap(pipes))
      die();

    //spawn obstacles
    if(frameCount%60 == 0) {
      var pipeH = random(50, 300);
      var pipe = createSprite(bird.position.x + width, GROUND_Y-pipeH/2+1+100, 80, pipeH);
      pipe.addImage(pipeImg);
      pipes.add(pipe);

      //top obstacle
      if(pipeH<200) {
        pipeH = height - (height-GROUND_Y)-(pipeH+MIN_OPENING);
        pipe = createSprite(bird.position.x + width, pipeH/2-100, 80, pipeH);
        pipe.mirrorY(-1);
        pipe.addImage(pipeImg);
        pipes.add(pipe);
      }
    }

    //get rid of passed obstacles
    for(var i = 0; i<pipes.length; i++)
      if(pipes[i].position.x < bird.position.x-width/2)
        pipes[i].remove();


  }

  camera.position.x = bird.position.x + width/4;

  //wrap ground
  if(camera.position.x > ground.position.x-ground.width+width/2)
    ground.position.x+=ground.width;

  background(247, 134, 131);
  camera.off();
  image(bgImg, 0, GROUND_Y-450);
  camera.on();

  drawSprites(pipes);
  drawSprite(ground);
  drawSprite(bird);
}

function die() {
  updateSprites(false);
  gameOver = true;
  //play sound on death
  deathScream.play();
}

function newGame() {
  pipes.removeSprites();
  gameOver = false;
  updateSprites(true);
  bird.position.x = width/2;
  bird.position.y = height/2;
  bird.velocity.y = 0;
  ground.position.x = 800/2;
  ground.position.y = GROUND_Y+150;
}

function mousePressed() {
  if(gameOver)
    newGame();
  bird.velocity.y = FLAP;
  //play jump sound when click
  jump.play();
}

function changeYang(){
  //reset all variables regarding datasets, or it will be ADDED with the previous candidate.
  count = 0;
  pctSum = 0;
  pctAvg = 0;

  birdImg = loadImage('assets/yang.png');
  bird.addImage(birdImg);
  currentCandidate = "Yang";
  print("Change currentCandidate to " + currentCandidate + ".");
  // by calling "updateData()", these variables will be re-calculated after "yang" was clicked.
  updateData();
  // print("Velocity is now " + bird.velocity.x + " for " + currentCandidate + ".");
  updateVelocityX();
}

function updateData() {
  //UPDATE DATA
  print(president_polls_table.getRowCount() + ' total rows in president_polls_table');
  print(president_polls_table.getColumnCount() + ' total columns in president_polls_table');
  print("---")

  print("All percentages from " + currentCandidate + " :");
  for (let i = 0; i < president_polls_table.getRowCount(); i++) {
    if (president_polls_table.get(i,32) == currentCandidate) {
      print(president_polls_table.get(i,35));
      pctSum = float(pctSum) + float(president_polls_table.get(i,35));
      count = count + 1;
    }//all c
  }

  pctAvg = pctSum / count;
  print(currentCandidate + " percentage - Sum");
  print(pctSum);
  print(currentCandidate + " percentage - Average");
  print(pctAvg);
  print(currentCandidate + " - counts");
  print(count);

  //---
}

function updateVelocityX() {
  bird.velocity.x = pctAvg/5;
  print("Velocity is now " + bird.velocity.x + " for " + currentCandidate + ".");
}
