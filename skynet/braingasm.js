"use strict";
// Array of nude count per layer
// Example: [2,1,1] would be 2 nodes in the 1st layer, 1 in the 2nd layer and 1 in the 3rd
var layer_nodes = [2,2];

var learning_curve = 0.2;

// This bad boy is complicated, but essentially all it does is figure out how many connections there are between the nodes
// Example: [2, 4, 5] = (2*4 + 4*5) = 28 connections
var weight_count = layer_nodes.reduce((accu, val, idx, src) => (accu + src[idx] * src[idx-1]) - (src[0]/(src.length - 1)));

var weight_array = range(weight_count).map(val => {return Math.random() * (2) - 1});

var ccenter = {x: document.documentElement.clientWidth/2, y: document.documentElement.clientHeight/2};

var buddies = range(20).map(_ => {return build_buddies(weight_count, learning_curve, weight_array)});

function myloop() {
  var context = document.getElementById("c").getContext("2d");
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#000000";
  context.fillRect(0, 0, ccenter.x*2, ccenter.y*2);
  for(let i = 0; i < buddies.length; i++) {
    let actual_x = buddies[i].x + ccenter.x/10;
    let actual_y = buddies[i].y + ccenter.y/10;
    let color = Math.random() * 3 <= 1 ? "red" : (Math.random() * 2 <= 1 ? "green" : "blue");
    context.fillStyle = color;
    context.fillRect(actual_x, actual_y, actual_x, actual_y);
  }
  buddies = range(buddies.length).map(_ => {return build_buddies(weight_count, learning_curve, weight_array)});
}

function build_buddies(count, learning_curve, input_weights, position = {x: 0, y: 0}) {
  let output_weights = [];
  if(input_weights) {
    console.log(input_weights);
    for(let i = 0; i < count; i++) {
      let rand_weight = Math.random() * (2) - 1;
      let dif = (input_weights[i] > 0) ? (input_weights[i] - (Math.random() * learning_curve)) : (input_weights[i] + (Math.random() * learning_curve));
      output_weights.push(dif);
    }
    weight_array = output_weights;
  }
  return new Buddy(output_weights);
}

function Buddy(weights = [1,1]) {
  // this.prev_x = position.x;
  // this.prev_y = position.y;
  
  this.x = (weights[0] * document.documentElement.clientWidth/2);
  this.y = (weights[1] * document.documentElement.clientHeight/2);
  
}

Buddy.prototype = {
  constructor: Buddy,
  alive: true,
  isBest: false,
  color: "blue"
};

// Sigmoid logistic function, google sigmoid to learn more
const sigmoid = (x, a = 1) => {
  return (1/(1+Math.pow(Math.E, -a*x)));
};

// Takes a number and returns an array that is the same length
// Example: input_num = 28; ouput_array.length = 28
function range(high, low = 0) {
  let temp = [];
  for(let i = low; i < high; i++) {
    temp.push(i);
  }
  return temp;
}

window.onload = () => setInterval(myloop, 350);
