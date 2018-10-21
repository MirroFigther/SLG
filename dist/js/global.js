var isoGroup, cursorPos, cursor, unitSpriteGroup;


var tileWidth = 60;
//
//
//
var global = "scope test";
var grid = []; //this is the 2d array that holds all the map data! (10x16)

var _battle;

var skill;

//since there can only be one movepanel at a time, decare it here
var movepanel;
var attackpanel;

//global lock
var lock = false;
var pausing = false; //if true, disables input until it's false

//generic menu object handles our unit options and title screen
var _menu;

//ally and enemy arrays determine the turn pacing
var allies = [];
var enemies = [];
var enemeyAi = [];


var allyTurn = false;
var enemyTurn = false;
var turn = 0;

var game;
