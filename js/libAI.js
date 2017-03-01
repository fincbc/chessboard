//包装构造函数对象!!!   chessAI

function chessAI(id, wid, img){
	self = this;
	self.chess = document.getElementById(id);
	self.wid = wid||self.chess.offsetWidth;
	self.context = self.chess.getContext('2d');
	self.grid = Math.floor( self.wid/ 30);    //计算半个棋格的长度
	self.chessBox = [];     	 //存储棋盘有无落子
	self.me = true;		    	 //查看黑白棋落子顺序
	self.wins = [];         	 //总共有多少种赢法的统计数组
	self.myWin = [];			 //判读我赢
	self.cWin = [];         	 //判读电脑赢
	self.over = false;      	 //判断结束游戏和中间的每步后的延迟时间
	self.cur = 0;				 //存储总赢法数
	self.delay = true;       	 //控制每走一步后延迟点时间
	
	//初始化空棋盘
	for(var i = 0; i < 15; i++ ) {
		self.chessBox[i] = [];
		for(var j = 0; j< 15; j++ ){
			self.chessBox[i][j] = 0;
		}
	}

	//多少种赢法
	 
	for(var i = 0; i < 15; i++ ) {
		self.wins[i] = [];
		for(var j = 0; j< 15; j++ ){
			self.wins[i][j] = [];
		}
	}
	

	//纵向
	for(var i = 0; i < 15; i++ ) {
		for(var j = 0; j< 11; j++ ){
			for(var k = 0; k< 5; k++ ){
				self.wins[i][j+k][self.cur] = true ;
			}
			self.cur++;
		}	
	}

	//横向
	for(var i = 0; i < 11; i++ ) {
		for(var j = 0; j< 15; j++ ){
			for(var k= 0; k< 5; k++ ){
				self.wins[i+k][j][self.cur] = true;
			}
			self.cur++;
		}
	}

	//斜向
	for(var i = 0; i < 11; i++ ) {
		for(var j = 0; j< 11; j++ ){
			for(var k= 0; k< 5; k++ ){
				self.wins[i+k][j+k][self.cur] = true;
			}
			self.cur++;
		}
	}

	//反斜向
	for(var i = 4; i < 15; i++ ) {
		for(var j = 0; j< 11; j++ ){
			for(var k= 0; k< 5; k++ ){
				self.wins[i-k][j+k][self.cur] = true;
			}
			self.cur++;
		}
	}
	console.log(self.cur);

	//初始化判断双方各自赢的数组
	for(var i = 0; i < self.cur; i++){
		self.myWin[i] = 0;
		self.cWin[i] = 0;
	}

	//设置水印;背景图问题
	var logo = new Image();
	logo.src = img||'img/bg.png';

	logo.onload = function(){		
		self.context.drawImage(logo, 0, 0, self.wid, self.wid);		
		self.drawChess();	
		self.chess.addEventListener('click', self.event, false);
		            
		// self.chess.onclick = function(e) {
		// 	self.event(e);
		// }
		 
	}

}





//画棋盘,开始绘图需要考虑xy坐标都加上了个距离是grid!;
chessAI.prototype.drawChess = function(){
	self.context.strokeStyle = '#f7f';
	for(var i = 0; i< 15 ; i++ ){
		self.context.moveTo( self.grid+ i*2*self.grid, self.grid );
		self.context.lineTo( self.grid+ i*2*self.grid, 29*self.grid );
		self.context.stroke();
		self.context.moveTo( self.grid, self.grid+ i*2*self.grid);
		self.context.lineTo( 29*self.grid, self.grid+ i*2*self.grid );
		self.context.stroke();
	}
};
 
//设置黑棋白棋样式
chessAI.prototype.drawPieces =function (x, y, me){
	
	self.context.beginPath();
	self.context.arc(self.grid+ x*2*self.grid, self.grid+ y*2*self.grid, self.grid- 1, 0, 2*Math.PI);
	self.context.closePath();
	var gradie = self.context.createRadialGradient(self.grid+ x*2*self.grid, self.grid+ y*2*self.grid, self.grid- 1, self.grid+ x*2*self.grid, self.grid+ y*2*self.grid, 0);
	if(me){
		gradie.addColorStop(0, '#0a0a0a');
		gradie.addColorStop(1, '#666666');
	}else{
		gradie.addColorStop(0, '#ddd');
		gradie.addColorStop(1, '#fff');
	}
	self.context.fillStyle = gradie ;
	self.context.fill();
}

//点击执行的事件
chessAI.prototype.event = function (e) { 
	if(self.over) return;
	var x = Math.floor(e.offsetX / (self.grid*2 ));
	var y = Math.floor(e.offsetY / (self.grid*2 )); 
	//判断点击是否在有效棋盘内
	if(x > -1 && x < 15 && y > -1 && y < 15 && self.chessBox[x][y] === 0 ){
		//落子,并改变空棋盘的数组
		self.drawPieces(x, y, true);
		self.chessBox[x][y] = 1;
		//相当于暂停等待延迟执行后面步骤
		self.over = true;
		var t = setTimeout(function() {
			self.over = false;
			//判断是否获胜
	 		for(var k = 0; k< self.cur; k++){
		 		if(self.wins[x][y][k]){
		 			self.myWin[k] ++;
		 			
		 			if(self.myWin[k] === 5){
		 				alert('你赢了')
		 				self.over = true;
		 			}
		 		}
		 	}
			
			if(!self.over) {
				self.me = !self.me;
				self.computerAI();
			}
		},500)

	}

}
//电脑落子
chessAI.prototype.computerAI = function () {
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
			if(self.chessBox[i][j] === 0){
				for(var k = 0; k< self.cur; k++){
					if(self.wins[i][j][k]){
						if(self.myWin[k] === 1){
							myScore[i][j] +=200;
						}else if(self.myWin[k] === 2){
							myScore[i][j] +=400;
						}else if(self.myWin[k] === 3){
							myScore[i][j] +=2000;
						}else if(self.myWin[k] === 4){
							myScore[i][j] +=10000;
						}
						if(self.cWin[k] === 1){
							cScore[i][j] +=220;
						}else if(self.cWin[k] === 2){
							cScore[i][j] +=420;
						}else if(self.cWin[k] === 3){
							cScore[i][j] +=2100;
						}else if(self.cWin[k] === 4){
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
	self.drawPieces(x, y, false);
	self.chessBox[x][y] = 2;
	//电脑的判断也设置比落子慢200毫秒
	self.over = true;
	setTimeout(function(){
		self.over = false;

	//判断电脑是否获胜
		for(var k = 0; k< self.cur; k++){
	 		if(self.wins[x][y][k]){
	 			self.cWin[k] ++ ;
	 			
	 			if(self.cWin[k] === 5){
	 				alert('电脑赢了')
	 				self.over = true;
	 			}
	 		}
	 	}
		
		if(!self.over) {
			self.me = !self.me;
		}		

	},10)
	


}


new chessAI('chess');















