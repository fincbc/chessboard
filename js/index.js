//原生面向过程写法

var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var chessBox = [];     //存储棋盘有无落子
var me = true;		   //查看黑白棋落子顺序
var wins = [];          //总共有多少种赢法的统计数组
var myWin = [];			//判读我赢
var cWin = [];          //判读电脑赢
var over = false;       //判断结束游戏


//初始化空棋盘
for(var i = 0; i < 15; i++ ) {
	chessBox[i] = [];
	for(var j = 0; j< 15; j++ ){
		chessBox[i][j] = 0;
	}
}

//多少种赢法
 
for(var i = 0; i < 15; i++ ) {
	wins[i] = [];
	for(var j = 0; j< 15; j++ ){
		wins[i][j] = [];
	}
}
var cur = 0;

//纵向
for(var i = 0; i < 15; i++ ) {
	for(var j = 0; j< 11; j++ ){
		for(var k = 0; k< 5; k++ ){
			wins[i][j+k][cur] = true ;
		}
		cur++;
	}	
}

//横向
for(var i = 0; i < 11; i++ ) {
	for(var j = 0; j< 15; j++ ){
		for(var k= 0; k< 5; k++ ){
			wins[i+k][j][cur] = true;
		}
		cur++;
	}
}

//斜向
for(var i = 0; i < 11; i++ ) {
	for(var j = 0; j< 11; j++ ){
		for(var k= 0; k< 5; k++ ){
			wins[i+k][j+k][cur] = true;
		}
		cur++;
	}
}

//反斜向
for(var i = 4; i < 15; i++ ) {
	for(var j = 0; j< 11; j++ ){
		for(var k= 0; k< 5; k++ ){
			wins[i-k][j+k][cur] = true;
		}
		cur++;
	}
}
console.log(cur);

//初始化判断赢得数组
for(var i = 0; i < cur; i++){
	myWin[i] = 0;
	cWin[i] = 0;
}

//设置水印;
var logo = new Image();
logo.src = 'img/bg.png';

logo.onload = function(){
	context.drawImage(logo, -25, -4);
	drawChess();

	// drawpieces(35, 35, true);
}

//画棋盘,开始绘图需要考虑xy坐标都加上了个距离是35!;
function drawChess(){
	context.strokeStyle = '#f7f';
	for(var i = 0; i< 15 ; i++ ){
		context.moveTo( 35+ i*35, 35 );
		context.lineTo( 35+ i*35, 525 );
		context.stroke();
		context.moveTo( 35, 35+ i*35 );
		context.lineTo( 525, 35+ i*35 );
		context.stroke();
	}
};
 
//设置黑棋白棋样式
function drawPieces(x, y, me){
	
	context.beginPath();
	context.arc(35+ x*35, 35+ y*35, 14, 0, 2*Math.PI);
	context.closePath();
	var gradie = context.createRadialGradient(35+ x*35, 35+ y*35, 14, 35+ x*35, 35+ y*35, 0);
	if(me){
		gradie.addColorStop(0, '#0a0a0a');
		gradie.addColorStop(1, '#666666');
	}else{
		gradie.addColorStop(0, '#ddd');
		gradie.addColorStop(1, '#fff');
	}
	context.fillStyle = gradie ;
	context.fill();
}

chess.onclick = function(e) { 
	if(over) return;
	var x = Math.floor((e.offsetX- 18)/ 35);
	var y = Math.floor((e.offsetY- 18)/ 35); 
	//判断点击是否在有效棋盘内
	if(x > -1 && x < 15 && y > -1 && y < 15 && chessBox[x][y] === 0 ){
		//落子,并改变空棋盘的数组
		drawPieces(x, y, me);
		chessBox[x][y] = 1;
		//判断是否获胜
 		for(var k = 0; k< cur; k++){
	 		if(wins[x][y][k]){
	 			myWin[k] ++;
	 			
	 			if(myWin[k] === 5){
	 				alert('你赢了')
	 				over = true;
	 			}
	 		}
	 	}
		
		if(!over) {
			me = !me;
			computerAI();
		}
	}

}
//电脑落子
function computerAI() {
	var myScore = [];
	var cScore = [];
	var max = 0;
	var x = 0,y =0;
	for(var i = 0; i < 15; i++ ) {
		myScore[i] = [];
		cScore[i] = [];
		for(var j = 0; j< 15; j++ ){
			myScore[i][j] = 0;
			cScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++ ){
		for(var j = 0; j < 15; j++){
			if(chessBox[i][j] === 0){
				for(var k = 0; k< cur; k++){
					if(wins[i][j][k]){
						if(myWin[k] === 1){
							myScore[i][j] +=200;
						}else if(myWin[k] === 2){
							myScore[i][j] +=400;
						}else if(myWin[k] === 3){
							myScore[i][j] +=2000;
						}else if(myWin[k] === 4){
							myScore[i][j] +=10000;
						}
						if(cWin[k] === 1){
							cScore[i][j] +=220;
						}else if(cWin[k] === 2){
							cScore[i][j] +=420;
						}else if(cWin[k] === 3){
							cScore[i][j] +=2100;
						}else if(cWin[k] === 4){
							cScore[i][j] +=20000;
						}
					}
				}

				//判断分数最高的位置,保存到想x,y
				if(myScore[i][j] > max){ 
					max = myScore[i][j];
					x = i;
					y = j;
				}else if(myScore[i][j] === max) {
					if( cScore[i][j] > cScore[x][y] ){
						x = i;
						y = j;
					}
				}
				if(cScore[i][j] > max){
					max = cScore[i][j];
					x = i;
					y = j;
				}else if(cScore[i][j] === max) {
					if( myScore[i][j] > myScore[x][y] ){
						x = i;
						y = j;
					}
				}
			}
		}
	}
	//落子,并改变保存空棋盘的变量
	drawPieces(x, y, me);
	chessBox[x][y] = 2;

	//判断是否获胜
	for(var k = 0; k< cur; k++){
 		if(wins[x][y][k]){
 			cWin[k] ++ ;
 			
 			if(cWin[k] === 5){
 				alert('电脑赢了')
 				over = true;
 			}
 		}
 	}
	
	if(!over) {
		me = !me;
	}


}


















