
var tools={
  containsXY:function(_tile,x,y){
    var _x=_tile.position.x;
    var _y=_tile.position.y;
    if((x>_x&&x<_x+60)&&(y>_y&&y<_y+60)){
      return true;
    }
    return false;
  },
  tileWidth:60,
  checkGrid :function (x,y){
      //check if these x and y are out of bounds
      if (x < 0 || x > 9 || y < 0 || y > 15){
          return false;
      }
      //console.log (x + "," + y);

      if (grid[x][y] === undefined){
          //console.log(grid[x][y].getType());
          return true;
      }else{
          return false;
          //console.log(grid[x][y].getType());
      }
  },

   checkGridExists:function (x,y){
      //check if these x and y are out of bounds
      if (x < 0 || x > 9 || y < 0 || y > 15){
          return false;
      }
      //console.log (x + "," + y);

      if (grid[x][y] !== undefined){
          //console.log(grid[x][y].getType());
          return true;
      }else{

          //console.log(grid[x][y].getType());
      }
  },

   debugPrintGrid:function (){
      document.write('===================') ;
      document.write('\n');
      for (var i = 0;i < 16; i++){
          document.write('\n');
          for (var j = 1; j < 11; j++){
              if (grid[j][i] === undefined){
                  document.write ('X')
              }else{
                  document.write('O')
              }
          }
      }
      console.log (grid);
  }
}
module.exports =tools
