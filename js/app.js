'use strict';

// Global variables
var divImages = document.getElementById('images');
var divcounts = document.getElementById('counts');
var imagesName = ['bag','chair','pen','shark','water-can','banana','bathroom','boots','breakfast','bubblegum','cthulhu','dog-duck','dragon','pet-sweep','scissors','tauntaun','wine-glass','sweep','usb'];
var imagegif = ['usb']; // Array for Gif pictures type
var imagepng = ['sweep']; // Array for Png pictures type
var rounds = 0; // number of rounds want to go (lab-11 = 25 round)
var allObj = []; // Array for objects
var numOfImg = 3; //initial value for images want to display
var randArr = []; // Array for random index for images
var roundNum = 0; // number of rounds with initial value = 0
var shownnn =[];
var startButton = document.getElementById('startButton');
var form = document.getElementById('form');


// constructor function
function Bus(name){
  this.name = name;
  this.path = `img/${name}.jpg`;
  this.count = 0;
  this.shown =0;
  allObj.push(this);
  shownnn.push(this.shown);
  this.imgg();
}

Bus.prototype.imgg=function(){
  // Check if image name is inside Gif or Png arrays to change its path
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
getItem();

/**********************************Form (start/restart) ********************************** */
form.addEventListener('submit',updateImage);

function updateImage(e){
  e.preventDefault();
  // setItem();    //to setItem every round not at the last one only
  for(let i =0;i<allObj.length;i++){
    allObj[i].count=0;
    allObj[i].shown=0;
  }
  if( startButton.value === 'start'){
    rounds = parseInt(e.target.numOfRound.value);
    numOfImg = parseInt(e.target.numOfImg.value);
    displayImages();
    form.reset();
    startButton.value = 'restart';
  }
  else{
    // delete previous images to display new one
    var child = divImages.lastElementChild;
    while (child) {
      divImages.removeChild(child);
      child = divImages.lastElementChild;
    }
    divcounts.textContent='';
    rounds = parseInt(e.target.numOfRound.value);
    numOfImg = parseInt(e.target.numOfImg.value);
    form.reset();

    // reset variables to initial values
    // for(let i =0;i<allObj.length;i++){
    //   allObj[i].count=0;
    //   allObj[i].shown=0;
    // }
    randArr = [];
    roundNum = 0;
    displayImages();

    divImages.addEventListener('click',clickupdate);
  }

}
/*****************************display random images************************************ */

// function to display random images
function displayImages(){
  for(let i = 0;i<numOfImg ;i++){
    var image = document.createElement('img');
    var rand = random(0,imagesName.length-1);

    // check if img repeated or not(same round and previous round)
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
    // remove images
    var imagesDisplayed = divImages.lastElementChild;
    while (imagesDisplayed) {
      imagesDisplayed.parentNode.removeChild(imagesDisplayed);
      imagesDisplayed = divImages.lastElementChild;
    }
    return;
  }
  if(e.target.src){
    var child = divImages.lastElementChild;
    while (child) {
      // divImages.removeChild(child);
      child.parentNode.removeChild(child);
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
  }
  drawCharts();
  drawPi();
  setItem();
}



// function for random numbers
function random(min,max){
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


/**************************************Local Storage*********************************** */
//set Item function
function setItem(){
  for(let i = 0 ; i < imagesName.length;i++){
    shownnn[i] += allObj[i].shown;
    allObj[i].shown = shownnn[i];
    allObj[i].count = 0;
  }
  localStorage.setItem('views',JSON.stringify(allObj));
}

// get Item function
function getItem(){
  if (localStorage.getItem('views') !== null){

    allObj = JSON.parse(localStorage.getItem('views'));
    for(let i = 0 ; i < imagesName.length;i++){
      shownnn.push(allObj[i].shown);
    }
  }
}

/*************************************Charts*********************************** */
// Bar chart

function drawCharts(){
  var clicksvar = [];
  var shownvar = [];
  for(let i= 0;i<imagesName.length;i++ ){
    clicksvar.push(allObj[i].count);
    shownvar.push(allObj[i].shown);
  }
  var ctx =document.getElementById('idChart').getContext('2d');
  // eslint-disable-next-line no-undef
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: imagesName,
      datasets: [{
        label: '# of Votes ',
        data: clicksvar,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2
      },{
        label: '# of Views',
        data: shownvar,
        backgroundColor: 'red',
        borderColor: 'black',
        borderWidth: 2
      }]
    },
    options:{
      legend: {
        labels: {
          fontColor: 'white',
          fontSize: 18
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: 'white',
            fontSize: 18,
            stepSize: 1,
            beginAtZero: true
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: 'white',
            fontSize: 14,
            stepSize: 1,
            beginAtZero: true
          }
        }]
      }
    }
  });
}

// pi Chart
function drawPi(){
  var colors = [
    '#F7464A',
    '#46BFBD',
    '#FDB45C',
    '#FDB35C',
    '#FDB44C',
    '#FDB43C',
    '#FDB42C',
    '#F1B41C',
    '#FDB30E',
    '#FDB35C',
    '#FDB34C',
    '#FDB25C',
    '#FDB15C',
    '#FDB05C',
    '#FD945C',
    '#F04578',
    '#FD745C',
    '#FD645C',
    '#FD445C',
    '#FD545C',
    '#FD345C'];
  var clicksvar = [];
  var shownvar = [];
  for(let i= 0;i<imagesName.length;i++ ){
    clicksvar.push(allObj[i].count);
    shownvar.push(allObj[i].shown);
  }
  var ctx = document.getElementById('chart-area').getContext('2d');

  var data = {
    labels: imagesName,
    datasets: [
      { data: clicksvar,
        backgroundColor: colors,
        borderColor:	'black',
        borderWidth: 2,
        hoverBorderWidth: 10},
      {
        data: shownvar,
        fill: true,
        backgroundColor: colors,
        borderColor:	'pink',
        borderWidth: 2,
        hoverBorderWidth: 10}
    ]};


  var options = {
    title: {
      display: true,
      text: 'Chart for clicks(outer circle) and views(inner circle)  ',
      position: 'top',
      fontColor: 'black',
      fontSize: 20
    },
    legend: {
      display: true,
      position: 'right',
      labels: {
        boxWidth: 20,
        fontColor: 'red',
        padding: 15
      },
      rotation: -0.7 * Math.PI,
    }
  };

  // Chart declaration:
  // eslint-disable-next-line no-undef
  new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  });
}
