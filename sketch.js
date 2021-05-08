//Create variables here
var dog,happyDog;
var database;
var foodS,foodStock;
var garden,fedTime,lastFed,currentTime,feed,addFood,foodObj,gameState,readState;

function preload()
{
	dogImage= loadImage("dogImg.png");
  happyDogImage= loadImage("dogImg1.png");
  sadDog=loadImage("images/Dog.png");
  garden=loadImage("images/Garden.png");
  washroom=loadImage("images/WashRoom.png");
  bedroom=loadImage("images/BedRoom.png");
}

function setup() {
  database = firebase.database();

  createCanvas(500, 500);
  
  dog=createSprite(250,250,20,20);
  dog.addImage(dogImage);
  dog.scale=0.2;
  foodObj= new Food();
  foodStock=database.ref('food');
    foodStock.on("value",readStock);
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })
  feed=createButton("Press To Feed The Dog");
  feed.position(100,200);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food")
  addFood.position(200,200);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46,139,87);
  currentTime=hour();

  if(currentTime==(lastFed+1)){
    update("playing");
    foodObj.garden;
  }
  else if(currentTime==(lastFed+2)){
    update("sleeping");
    foodObj.bedroom;
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom;
  }
  else{
    update("hungry");
    feedObj.display();
  }
  if(gameState != "hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDogImage);
    dog.scale=0.2;
  }

  drawSprites();
  fill("white");
  textSize(15);
  stroke("black");
  text("Food Remaining: "+foodS,170,200);
  text("Note: Press Up Arrow Key To Feed Him Milk",130,10);
  //add styles here

}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }

  database.ref('/').update({
    food:x
  })
}

function readStock(data){
  foodS=data.val();
  foodObj.updatefoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}