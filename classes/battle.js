var enemyAI=require('./ai.js');
var tools=require('./tools');
var unit= require('./unit.js');
var skill=require('./skill.js');
// var global=require('./global.js')
// var isoGroup=global.isoGroup;var cursorPos=global.cursorPos;
// var cursor=global.cursor;var unitSpriteGroup=global.unitSpriteGroup;
var battle = function (game){

    this.showAttackPanels = function(unit, custom){
        console.log (custom);
        //assume range is 1 for now
        attackpanel = undefined;
        attackpanel = game.add.group();

/*        attackpanel.create (unit.x+50,unit.y,'attack');
        attackpanel.create (unit.x-50,unit.y,'attack');
        attackpanel.create (unit.x,unit.y+50,'attack');
        attackpanel.create (unit.x,unit.y-50,'attack');*/

        panel = attackpanel.create(unit.x*tileWidth, unit.y*tileWidth- tileWidth,'tile');
         console.log ((unit.x*tileWidth + tileWidth)+","+(unit.y*tileWidth-tileWidth));
        //panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = attackpanel.create(unit.x*tileWidth- 2*tileWidth, unit.y*tileWidth-tileWidth, 'tile');
         console.log (unit.x * tileWidth - tileWidth +","+unit.y* tileWidth);
        //panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = attackpanel.create(unit.x*tileWidth- tileWidth, unit.y*tileWidth, 'tile');
         console.log (unit.x*tileWidth +","+(unit.y*tileWidth+tileWidth)+"3");
        //panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        panel = attackpanel.create(unit.x*tileWidth-tileWidth, unit.y*tileWidth - 2*tileWidth, 'tile');
         console.log(unit.x*tileWidth+","+(unit.y*tileWidth - tileWidth)+"4");
        //panel.anchor.set(0.5, 0);
        panel.alpha = 0.3;
        panel.tint = 0xffaabe;

        attackpanel.setAll ('inputEnabled',true);
        attackpanel.callAll ('events.onInputDown.add','events.onInputDown',function (event){this.attackPanelClick(event,unit,custom)},this);
    };

    this.attackPanelClick = function (event,unit,custom){
        //custom is a custom attack function that you can fork in from skills
        // game.iso.unproject(game.input.activePointer.position, cursorPos);
          console.log(cursorPos.x+",,,,"+(cursorPos.y)+"cursorPos");
        cursorPos=game.input.activePointer.position;
        attackpanel.forEach(function (tile) {
            var inBounds=tools.containsXY(tile,cursorPos.x, cursorPos.y)
            console.log(tile.position.x+",,,,"+(tile.position.y)+"fff");
            // var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
            // If it does, do a little animation and tint change.
            if (!tile.selected && inBounds) {
                tile.selected = true;
                selectedTile = tile;
            }
            // If not, revert back to how it was.
            else if (tile.selected && !inBounds) {
                tile.selected = false;
            }
        });

        event.x = selectedTile.position.x;
        event.y = selectedTile.position.y;
         console.log(selectedTile.position.x+",,,,"+(selectedTile.position.y)+"selectedTilefff");
        if (!tools.checkGrid(event.x/tileWidth+1,event.y/tileWidth+1)){
            if (grid[event.x/tileWidth+1][event.y/tileWidth+1].isEnemy){
                console.log (custom);
                if (custom === undefined) {
                    this.normalAttack(unit, grid[event.x / tileWidth+1][event.y / tileWidth+1]);
                }else{
                    custom(unit, grid[event.x / tileWidth+1][event.y / tileWidth+1]);
                }
                attackpanel.destroy();
            }
        }
        lock = false;
        attackpanel.destroy();
    };
    this.normalAttack = function (attacker, defender, count){
        if (attacker !== undefined && defender !== undefined) {
            //attacker and defender are both unit objects
            var damage = attacker.atk - defender.def;
            if (damage < 0){ damage = 0};
            defender.updateStatus();
            this.battleAnimation(attacker, defender, damage, count);
            defender.hp -= damage;
            //alert(defender.hp);
            defender.updateStatus();
            attacker.attacked = true;
        }
    };

    //=============================== S K I L L S ==========================================================








    //===================== END SKILLS ======================================================================
    this.battleAnimation = function (attacker, defender, damage, count){
        //tween halfway towards the defending unit

        oldX = attacker.spriteframe.x;
        oldY = attacker.spriteframe.y;

        atktween = game.add.tween(attacker.spriteframe)
            .to(
                { x: (defender.spriteframe.x), y: (defender.spriteframe.y) },
                120,
                Phaser.Easing.Quadratic.InOut,
                false
        ,250);

        atktweenback = game.add.tween(attacker.spriteframe)
            .to(
                { z: attacker.spriteframe.isoZ, x: (oldX), y: (oldY) },
                120,
                Phaser.Easing.Quadratic.InOut,
                false
            );


        atktween.chain(atktweenback);

        atktween.onComplete.add(function (){
            var battletext = game.add.text(defender.spriteframe.x, defender.spriteframe.y, '-' + damage, {
                font: "30px Impact",
                fill: "#ff3400"
            });
            texttween = game.add.tween(battletext).to({x:defender.spriteframe.x,y:defender.spriteframe.y + 30},400,Phaser.Easing.Quadratic.InOut, false);
            texttween.onComplete.add(function (){
                battletext.destroy();
            },this);
            texttween.start();
        },this);
        atktweenback.onComplete.add(function (){

            if (count !== undefined){
                enemyTriggerAi(count +=1);
            }
        },this);
        atktween.start();
    };
};
module.exports =battle;
