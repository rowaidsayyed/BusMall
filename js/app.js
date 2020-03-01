'use strict';

// Global variables
var divImages = document.getElementById('images');
var divcounts = document.getElementById('counts');
var imagesName = ['bag','chair','pen','shark','water-can','banana','bathroom','boots','breakfast','bubblegum','cthulhu','dog-duck','dragon','pet-sweep','scissors','tauntaun','wine-glass','sweep','usb'];
var imagegif = ['usb'];
var imagepng = ['sweep'];

var rounds = 0; // number of rounds want to go (lab-11 = 25 round)
var allObj = [];
var numOfImg = 3;
var randArr = [];
var roundNum = 0;

var startButton = document.getElementById('startButton');
var form = document.getElementById('form');


// constructor function
function Bus(name){
  this.name = name;
  this.path = `img/${name}.jpg`;
  this.count = 0;
  this.shown =0;
  allObj.push(this);
  this.imgg();
}

Bus.prototype.imgg=function(){
  for(let i = 0; i<imagegif.length;i++){
    if(this.name === imagegif[i]){
      this.path = `img/${this.name}.gif`;
    }
    if(this.name === imagepng[i]){
      this.path = `img/${this.name}.png`;
    }
  }
};


// make instance  Bus object
for(let i = 0;i<imagesName.length;i++){
  new Bus(imagesName[i]);
}


/**********************************Form (start/restart) ********************************** */
form.addEventListener('submit',updateImage);

function updateImage(e){
  e.preventDefault();
  if( startButton.value === 'start'){
    rounds = parseInt(e.target.numOfRound.value);
    numOfImg = parseInt(e.target.numOfImg.value);
    displayImages();
    form.reset();
    startButton.value = 'restart';
  }
  else{
    var child = divImages.lastElementChild;
    while (child) {
      divImages.removeChild(child);
      child = divImages.lastElementChild;
    }
    divcounts.textContent='';
    rounds = parseInt(e.target.numOfRound.value);
    numOfImg = parseInt(e.target.numOfImg.value);
    form.reset();

    for(let i =0;i<allObj.length;i++){
      allObj[i].count=0;
      allObj[i].shown=0;
    }
    randArr = [];
    roundNum=0;
    displayImages();

    divImages.addEventListener('click',clickupdate);
  }

}
/***************************************************************************** */

// function to display random images
function displayImages(){
  for(let i = 0;i<numOfImg ;i++){
    var image = document.createElement('img');
    var rand = random(0,imagesName.length-1);

    while(randArr.includes(rand)){
      rand = random(0,imagesName.length-1);
    }
    randArr.push(rand);

    allObj[rand].shown += 1;
    image.src = allObj[rand].path;
    image.alt = allObj[rand].name;
    divImages.appendChild(image);
  }
}


/*******************************Click event Listener******************************** */
divImages.addEventListener('click',clickupdate);

function clickupdate(e){
  roundNum++;
  allObj[imagesName.indexOf(e.target.alt)].count += 1;
  if(roundNum === rounds){
    divImages.removeEventListener('click',clickupdate);
    displayCount();
  }
  if(e.target.src){
    var child = divImages.lastElementChild;
    while (child) {
      divImages.removeChild(child);
      child = divImages.lastElementChild;
    }
    displayImages();
    for(let i =0;i<numOfImg;i++){
      randArr.shift();
    }
  }
}
/**************************************************************************************** */

// function to display number of (votes and shown) for each img
function displayCount(){
  for(let i = 0;i<allObj.length;i++){
    var liEl = document.createElement('li');
    divcounts.appendChild(liEl);
    liEl.textContent = `${allObj[i].name} had ${allObj[i].count} votes and was shown ${allObj[i].shown} times`;
  }}



// function for random numbers
function random(min,max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
