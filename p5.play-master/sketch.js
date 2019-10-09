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
  print(president_primary_polls_table.getRowCount() + ' total rows in president_primary_polls_table');
  print(president_primary_polls_table.getColumnCount() + ' total columns in president_primary_polls_table');

  print(president_polls_table.getRowCount() + ' total rows in president_polls_table');
  print(president_polls_table.getColumnCount() + ' total columns in president_polls_table');

  print(president_approval_polls_table.getRowCount() + ' total rows in president_approval_polls_table');
  print(president_approval_polls_table.getColumnCount() + ' total columns in president_approval_polls_table');

  print(senate_polls_table.getRowCount() + ' total rows in senate_polls_table');
  print(senate_polls_table.getColumnCount() + ' total columns in senate_polls_table');

  print(house_polls_table.getRowCount() + ' total rows in house_polls_table');
  print(house_polls_table.getColumnCount() + ' total columns in house_polls_table');

  print(governor_polls_table.getRowCount() + ' total rows in governor_polls_table');
  print(governor_polls_table.getColumnCount() + ' total columns in governor_polls_table');

  print(generic_ballot_polls_table.getRowCount() + ' total rows in generic_ballot_polls_table');
  print(generic_ballot_polls_table.getColumnCount() + ' total columns in generic_ballot_polls_table');

  print(president_primary_polls_table.getColumn('answer'));
  
  createCanvas(800, 600);

  music.play();
  birdImg = loadImage('assets/biden.png');
  pipeImg = loadImage('assets/pipe.png');
  groundImg = loadImage('assets/ground.png');
  bgImg = loadImage('assets/background.png');

  bird = createSprite(width/2, height/2, 40, 40);
  bird.rotateToDirection = true;
  bird.velocity.x = 4;
  bird.setCollider('circle', 0, 0, 20);
  bird.addImage(birdImg);

  ground = createSprite(800/2, GROUND_Y+100); //image 800x200
  ground.addImage(groundImg);

  pipes = new Group();
  gameOver = true;
  updateSprites(false);

  camera.position.y = height/2;
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

    //spawn pipes
    if(frameCount%60 == 0) {
      var pipeH = random(50, 300);
      var pipe = createSprite(bird.position.x + width, GROUND_Y-pipeH/2+1+100, 80, pipeH);
      pipe.addImage(pipeImg);
      pipes.add(pipe);

      //top pipe
      if(pipeH<200) {
        pipeH = height - (height-GROUND_Y)-(pipeH+MIN_OPENING);
        pipe = createSprite(bird.position.x + width, pipeH/2-100, 80, pipeH);
        pipe.mirrorY(-1);
        pipe.addImage(pipeImg);
        pipes.add(pipe);
      }
    }

    //get rid of passed pipes
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
