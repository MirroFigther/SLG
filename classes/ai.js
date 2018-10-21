
var tools=require('./tools');
var unit= require('./unit.js');
var battle =require('./battle.js');
var menu=require('./menu.js');
var skill=require('./skill.js');
// var global=require('./global.js')
// var isoGroup=global.isoGroup;var cursorPos=global.cursorPos;
// var cursor=global.cursor;var unitSpriteGroup=global.unitSpriteGroup;
var enemyAI = function (unit){
    //class for controlling enemy ai
    var MoveActions = new Array ();
    var MoveToX;
    var MoveToY;
    var AttackActions = new Array ();
    //points decide whether this action is actually good
    var points = 0;

    var movepanel;

    this.count;
    this.tempgrid = new Array (10);
    for (var i =0; i< 10;i++){
        this.tempgrid[i] = new Array (16);
    }


    this.reinitiate = function () {
        MoveActions = new Array ();
        AttackActions = new Array ();
        //points decide whether this action is actually good
        points = 0;

        this.tempgrid = new Array (10);
        for (var i =0; i< 10;i++){
            this.tempgrid[i] = new Array (16);
        }
        movetween = null;
    };

    this.action = function (){

    };

    this.aiMovement = function (count){
        if (unit.spriteframe !== undefined) {
            this.count = count;
            //a dummy movepathfinder to check each move (don't draw the panels)
            movepanel = game.add.group();
            this.movePathFind(unit.x*tileWidth, unit.y*tileWidth, unit.movement, 'x', new Array(), 0);
            this.enemyAction();
        }
    };

    this.movePathFind = function (x,y,tempmv,dir,moveArray, temppoints){
        if (tempmv > 0){
            //check that this grid is not itself
            if (unit.x*tileWidth == x && unit.y*tileWidth == y){
                //stand still, attack?
                this.attackAction(x,y,temppoints);
                this.tempgrid[x/tileWidth][y/tileWidth] = 'x';
                //check up,left,right,down = skip pushing to the movearray here
                this.movePathFind(x + tileWidth, y, tempmv, 'e', moveArray, temppoints);
                this.movePathFind(x - tileWidth, y, tempmv, 'w', moveArray, temppoints);
                this.movePathFind(x, y - tileWidth, tempmv, 's', moveArray, temppoints);
                this.movePathFind(x, y + tileWidth, tempmv, 'n', moveArray, temppoints);
            }
            else if ((tools.checkGrid(x/tileWidth,y/tileWidth))){
                //this panel is empty, add move panel here
                //check if we already have a movepanel here though
                var moveArrayCopy = new Array ();
                for (var i =0; i< moveArray.length; i++){
                    moveArrayCopy.push(moveArray[i]);
                }
                moveArrayCopy.push(dir);
                if (this.tempgrid[x/tileWidth][y/tileWidth] == undefined){
                    //panel = game.add.isoSprite(x/tileWidth * tileWidth, y/tileWidth * tileWidth, 3, 'tile', 0, movepanel);
                    panel =movepanel.create((x/60-1) * tileWidth, (y/60-1) * tileWidth,  'tile');

                    //panel.anchor.set(0.5, 0);
                    panel.alpha = 0.3;
                    panel.tint = 0xe8694c;
                    this.tempgrid[x/tileWidth][y/tileWidth] = moveArrayCopy;
                    this.attackAction(x,y,temppoints);
                }else{
                    if (moveArrayCopy.length < this.tempgrid[x/tileWidth][y/tileWidth].length){
                        this.tempgrid[x/tileWidth][y/tileWidth] = moveArrayCopy;
                        this.attackAction(x,y,temppoints);
                    }
                }

                tempmv -=1;
                if (tempmv > 0){
                    //check up,left,right,down
                    this.movePathFind(x+tileWidth,y,tempmv,'e',moveArrayCopy, temppoints);
                    this.movePathFind(x-tileWidth,y,tempmv,'w',moveArrayCopy, temppoints);
                    this.movePathFind(x,y-tileWidth,tempmv,'s',moveArrayCopy, temppoints);
                    this.movePathFind(x,y+tileWidth,tempmv,'n',moveArrayCopy, temppoints);

                }
            }
            else{
            }
        }

    };


    this.calculateAttackPoints =function (ally){
            var attackpoints = 0;
            if ((unit.atk - ally.def) > ally.hp){
                attackpoints += 99999;
            }else{
                attackpoints += (unit.atk - ally.def)*100;
            }
            return attackpoints;
    };

    this.attackAction = function (x,y, temppoints){
        //try attacking in all directions at this x and y
        temppoints += calculateNearestAlly(x,y); // add the movement points
        var attackdir;
        if (tools.checkGridExists(x/tileWidth +1,y/tileWidth) && grid[x/tileWidth+1][y/tileWidth].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/tileWidth+1][y/tileWidth]);
            attackdir = 'e';
        }else if (tools.checkGridExists(x/tileWidth-1,y/tileWidth) && grid[x/tileWidth-1][y/tileWidth].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/tileWidth-1][y/tileWidth]);
            attackdir = 'w';
        }else if (tools.checkGridExists(x/tileWidth,y/tileWidth + 1) && grid[x/tileWidth][y/tileWidth+1].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/tileWidth][y/tileWidth+1]);
            attackdir = 'n';
        }else if (tools.checkGridExists(x/tileWidth,y/tileWidth - 1) && grid[x/tileWidth][y/tileWidth -1].isAlly){
            temppoints += this.calculateAttackPoints(grid[x/tileWidth][y/tileWidth-1]);
            attackdir = 's';
        }else{
            attackdir = 'x';
            temppoints += 5;
        }


        if (temppoints >= points){
            points = temppoints ;
            MoveActions = this.tempgrid [x/tileWidth][y/tileWidth];
            MoveToX = x/tileWidth;
            MoveToY = y/tileWidth;
            AttackActions = attackdir;
        }

    };

    this.enemyAction = function (){
        //executes the actions in movearray
        lock = true;

        isoGroup.forEach(function (tile) {

            var inBounds = (tile.position.x/tileWidth == MoveToX && tile.position.y/tileWidth == MoveToY-1);
            // var inBounds = tools.containsXY(tile,cursorPos.x, cursorPos.y)
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                selectedTile = tile;
                tile.tint = 0x86bfda;
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
                tile.tint = 0xffffff;
            }
        });
        this.moveTween(selectedTile);

    };

    this.moveTween = function (selectedTile){
        var tile = selectedTile
        var isoBaseSize = 32;

        var tween = game.add.tween(unit.spriteframe)
            .to(
                { z: 60, x: (tile.position.x-0.5*tileWidth), y: (tile.position.y) },
                200,
                Phaser.Easing.Quadratic.InOut,
                false
                ,250)
        var tween2 = game.add.tween(unit.spriteframe).to(
            { z: 25 },
            350,
            Phaser.Easing.Bounce.Out,
            false
        );

        tween2.onComplete.add(function (){
            //update the global grid to reflect our move
            delete grid[unit.x][unit.y];

            unit.x =  selectedTile.position.x/tileWidth;
            unit.y =  selectedTile.position.y/tileWidth+1;

            grid[unit.x][unit.y] = unit;

            lock = false;
            selectedTile.selected = false;
            selectedTile.tint = 0xffffff;

            if (AttackActions == 'e'){
                _battle.normalAttack(unit,grid[unit.x + 1][unit.y], this.count);
            }else if (AttackActions == 'w'){
                _battle.normalAttack(unit,grid[unit.x - 1][unit.y], this.count);
            }else if (AttackActions == 'n'){
                _battle.normalAttack(unit,grid[unit.x][unit.y + 1], this.count);
            }else if (AttackActions == 's'){
                _battle.normalAttack(unit,grid[unit.x][unit.y - 1], this.count);
            }else{
                enemyTriggerAi(this.count +=1);
            }


            this.reinitiate();

            movepanel.destroy();
            //enemyTriggerAi(this.count +=1);
            unit.setTurnOver();
            //debugPrintGrid();
        },this);

        tween.chain(tween2);
        tween.start()
    };

    calculateNearestAlly = function (x,y){
        var nearest = 9999;
        for (var i = 0;i < 10; i++){
            for (var j = 0; j < 16; j++){
                if (grid[i][j] !== undefined && grid[i][j].isAlly){
                    var distance = Math.sqrt (Math.pow((x/tileWidth - i),2) + Math.pow((y/tileWidth - j),2));
                    if (distance <= nearest){
                        nearest = distance;
                    }
                }
            }
        }
        return 100/nearest;
    }

};
module.exports =enemyAI;
