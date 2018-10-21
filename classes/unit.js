//handles syntax for a generic unit on the field
var enemyAI=require('./ai.js');
var tools=require('./tools');
var battle =require('./battle.js');
var skill=require('./skill.js');
var skillTable=require('./dom/skillTable.js')
var tileWidth=tools.tileWidth;
var unit = function (game){
    this.spriteframe;
    this.hpBar;
    this.spBar;


    this.name;
    this.hp;
    this.sp;
    this.movement;

    //battle stats
    this.atk;
    this.def;

    //x and y coordinates in the grid (multiplied by 50) 10x16
    this.x;
    this.y;

    this.infotext;
    this.infoswitch = false;
    this.movedone = true;

    //movepanel = game.add.group();
    this.tempmovepanel;
    this.tempgrid;

    this.inMenu = false;
    this.hasTurn = true;

    //turn control variables
    // turn is over after 1 move and 1 attack action, or on 'wait' action
    this.moved = false;
    this.attacked = false;

    this.isEnemy = false;
    this.isAlly = true;



    //contains this unit's skills
    this.skillList = new Array();

    this.getType = function (){
        return "unit";
    };

    this.dumpSkillNames = function (){
        for (var i = 0; i< this.skillList.length;i++){
           console.log (this.skillList[i].name);
        }
    };

    //disables movement controls for this unit, turn on AI

    this.create = function (name,sprite, hp, sp, movement,x,y, enemy, atk, def){
        //constructor for a generic unit sprite
        this.name = name;
        this.hp = hp;
        this.maxhp = hp;
        this.sp = sp;
        this.maxsp = sp;
        this.movement = movement;

        this.atk = atk;
        this.def = def;

        this.x = x;
        this.y = y;
        if (enemy == 1){
            this.isEnemy = true;
            this.isAlly = false;
        }
        //draw the enemy tile under

        this.spriteframe = game.add.sprite ((this.x-0.5) * tileWidth, (this.y-1) * tileWidth,sprite);
        //this.spriteframe = game.add.isoSprite(this.x/50 * tileWidth, this.y/50 * tileWidth, 25, sprite, 0);
        this.spriteframe.anchor.set (0.5,0);
        // this.x = x*60;
        // this.y = y*60;

        isoGroup.add(this.spriteframe);
        unitSpriteGroup.add(this.spriteframe);

        game.physics.arcade.enable (this.spriteframe);
        //this.spriteframe.body.gravity.y = 300;
        //this.spriteframe.collideWorldBounds = true;


        //create on click functions
        if (!this.isEnemy) {
            this.spriteframe.inputEnabled = true;
            this.spriteframe.events.onInputDown.add(this.click, this);
        }else{
            this.spriteframe.inputEnabled = true;
            this.spriteframe.events.onInputDown.add(this.enemyClick, this);
            this.spriteframe.tint = 0xff644f;
        }
        this.spriteframe.body.moves = false;
        //update global grid object
        grid[x][y] = this;
    };

    this.showMenu = function (){
        //set marker here to reverse gamestate.
        _menu.drawUnitMenu(this);
    };

    this.moveAction = function (){
        //this.infotext = game.add.text (this.x+50,this.y+10,this.name + " Hp: "+this.hp + " Mv: " + this.movement);
        //this.infotext.fill = "#ff0044";
        this.infoswitch = true;skillTable.change();
        if (movepanel != undefined){
            //remove move panels on other units
        }
        this.setTempGrid ();

        movepanel = game.add.group();
        this.moveArray = new Array();
        this.movePathFind (this.x*tileWidth,this.y*tileWidth,this.movement,'x',new Array());
        movepanel.setAll ('inputEnabled',true);
        //movepanel.setAll ('alpha',0.3);
        movepanel.callAll ('events.onInputDown.add','events.onInputDown',this.move,this);

    };

    this.setTempGrid = function (){
        this.tempgrid = new Array (16);
        for (var i =0; i< 16;i++){
            this.tempgrid[i] = new Array (10);
        }
    };
    this.click = function (){
        //on click any unit
        if (this.movedone && this.hasTurn && !this.inMenu && !lock){
            if (!this.infoswitch){
                this.showMenu();
            }else{
                //this.infotext.destroy();
                movepanel.destroy();
                this.infoswitch = false;
            }
        }
    };

    this.enemyClick = function (){

    };

    this.movePathFind = function (x,y,tempmv,dir,moveArray){
        //recursively check squares around the user until move is 0
        //TODO: also save the path for that panel for future moves

        //check this x,y
        if (tempmv > 0){
            //check that this grid is not itself
            if (this.x*tileWidth == x && this.y*tileWidth == y){
                //check up,left,right,down = skip pushing to the movearray here
                this.movePathFind(x+60,y,tempmv,'e',moveArray);
                this.movePathFind(x-60,y,tempmv,'w',moveArray);
                this.movePathFind(x,y-60,tempmv,'s',moveArray);
                this.movePathFind(x,y+60,tempmv,'n',moveArray);

            }
            else if ((tools.checkGrid(x/60,y/60))){
                //this panel is empty, add move panel here
                //check if we already have a movepanel here though

                var moveArrayCopy = new Array ();
                for (var i =0; i< moveArray.length; i++){
                    moveArrayCopy.push(moveArray[i]);
                }
                moveArrayCopy.push(dir);
                if (this.tempgrid[x/60][y/60] == undefined){
                    //movepanel.create (x,y,'trans');
                    // panel = game.add.isoSprite(x/60 * tileWidth, y/60 * tileWidth, 3, 'tile', 0, movepanel);
                    //panel = game.add.sprite((x/60-1) * tileWidth, (y/60-1) * tileWidth,  'tile',null, movepanel);
                    panel=movepanel.create((x/60-1) * tileWidth, (y/60-1) * tileWidth,  'tile');
                    // panel.anchor.set(0.5, 0);
                    panel.alpha = 0.3;
                    panel.tint = 0x9bc1ff;
                    //panel.anchor.set(0.5, 0);
                    //save how we got to this panel onto the tempgrid
                    this.tempgrid[x/60][y/60] = moveArrayCopy;
                }else{
                    if (moveArrayCopy.length < this.tempgrid[x/60][y/60].length){
                        this.tempgrid[x/60][y/60] = moveArrayCopy;
                    }
                }

                tempmv -=1;
                if (tempmv > 0){
                    //check up,left,right,down
                    this.movePathFind(x+60,y,tempmv,'e',moveArrayCopy);
                    this.movePathFind(x-60,y,tempmv,'w',moveArrayCopy);
                    this.movePathFind(x,y-60,tempmv,'s',moveArrayCopy);
                    this.movePathFind(x,y+60,tempmv,'n',moveArrayCopy);

                }
            }
            else{
            }
        }

    };

    movepanelInputAdd =function (){
        movepanel.inputEnabled = true;
        movepanel.alpha = 0.2;
        //   movepanel.events.onInputDown.add(this.move,self);

    };


    this.move = function (event){
        //move the player depending on which movepanel was picked (panel in mouse event)
        //game.add.text (0,0,"x:"+event.x+"y:"+event.y);
        //   this.spriteframe.body.velocity.x= 150;
        this.infoswitch = false;
        //destroy the old element in grid
        //determine destination x and destination y (in iso), convert
        var destx = event.x;
        var desty = event.y;
        //var testtext = game.add.text (0,0,"x:"+this.spriteframe.x+"dx:"+destx);
        console.log ('event pos: ' + destx + ' ' + desty);

        //game.iso.unproject(game.input.activePointer.position, cursorPos);

        console.log ('cursor pos: ' + cursorPos.x + ' ' + cursorPos.y);
        //var pathMoveArray = this.tempgrid[destx][desty];
        movepanel.forEach(function (tile) {
            // var inBounds = tile.bounds.containsXY(cursorPos.x, cursorPos.y);
            // console.log (inBounds);
            // // If it does, do a little animation and tint change.
            var inBounds=tools.containsXY(tile,cursorPos.x, cursorPos.y)
            if (inBounds) {
                selectedTile = tile;
                tile.tint = 0x86bfda;
            }
            // If not, revert back to how it was.
        });

        if (selectedTile !== undefined && tools.checkGrid(selectedTile.position.x/tileWidth+1,selectedTile.position.y/tileWidth+1)) {
            movepanel.destroy();

            //console.log ("grid: " + grid[selectedTile.isoX/tileWidth][selectedTile.isoY/tileWidth]);
            //this.tempmovepanel = game.add.sprite (event.x,event.y,'trans');
            //this.tempmovepanel.alpha = 0.5;

            this.movedone = false;

            this.moveTween(selectedTile);
        }
    };



    this.moveTween = function (selectedTile){
        var tile = selectedTile
        //console.log("tile", selectedTile)
        var isoBaseSize = 32;
        var tween = game.add.tween(this.spriteframe)
            .to(
                { z: 60, x: ((tile.position.x/tileWidth+0.5)*tileWidth), y: (tile.position.y) },
                200,
                Phaser.Easing.Quadratic.InOut,
                false
            ,250)
        var tween2 = game.add.tween(this.spriteframe).to(
            { z: 25 },
            350,
            Phaser.Easing.Bounce.Out,
            false
        );

        tween2.onComplete.add(function (){
            this.movedone = true;
            //this.updateGrid ();
            lock = false;
            this.moved = true;
            this.updateGrid(selectedTile);
            _menu.drawUnitMenu (this);
            //move action is done
        },this);

        tween.chain(tween2);
        tween.start()
    };


    this.updateGrid = function(tile){
        //update the global grid to reflect our move
        delete grid[this.x][this.y];

        this.x = (tile.position.x+tileWidth)/tileWidth;
        this.y = (tile.position.y+tileWidth)/tileWidth;

        // console.log ('converted old:' + tile.isoX/tileWidth + ' ' + tile.isoY/tileWidth);
        // console.log ('new x: ' + this.x + 'new y: ' + this.y);

        grid[this.x][this.y] = this;
        tile.selected = false;
        tile.tint = 0xffffff;
        game.iso.simpleSort(unitSpriteGroup);
    };

    this.updateStatus = function(){
       //update the status of this unit, if HP is 0 it is dead
        if (this.hp <=0 ) {
            //we need to destroy this from our enemies/allies array too
            if (this.isEnemy){
                //delete both the ai and the enemy
                var index = enemies.indexOf (this);
                enemies.splice (index, 1);
                enemeyAi.splice (index,1);
            }else{
                var index = allies.indexOf (this);
                console.log ("wew: " + index);
                allies.splice (index, 1);
            }
            this.spriteframe.destroy();
            delete grid[this.x][this.y];

            console.log (allies);
            console.log(enemies);
        }
    };

    this.setTurnOver = function (){
        this.hasTurn = false;
        if (this.isEnemy){
            this.spriteframe.tint = 0x702e2e;
            checkEnemyTurnOver();
        }else{
            this.spriteframe.tint = 0x777777;
            checkAllyTurnOver();
        }
    };

    this.refreshTurn = function (){
        this.hasTurn = true;
        this.attacked = false;
        this.moved = false;
        if (this.isEnemy){
            this.spriteframe.tint = 0xff644f;
        }else {
            this.spriteframe.tint = 0xFFFFFF;
        }
    };
};
module.exports =unit;
