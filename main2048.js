var board=new Array();
var score=0;
var hasConflicted=new Array();

var startx=0;
var starty=0;
var endx=0;
var endy=0;
var touch;


$(document).ready(function(){
    prepareForMobile();
    newgame();
});

window.onload=function(){
    touch=document.getElementById("newgamebutton");
    touch.addEventListener('touchend',newgame);
    console.log(1);
}


function prepareForMobile(){

    if(documentWidth>500){
        gridContainerWidth=500;
        cellSideLength=100;
        cellSpace=20;
    }

    $("#grid-container").css('width',gridContainerWidth-2*cellSpace);
    $("#grid-container").css('height',gridContainerWidth-2*cellSpace);
    $("#grid-container").css('padding',cellSpace);
    $("#grid-container").css('border-radius',0.02*gridContainerWidth);

    $(".grid-cell").css('width',cellSideLength);
    $(".grid-cell").css('height',cellSideLength);
    $(".grid-cell").css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //棋盘格位置初始化
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
};

function init(){
    var i,j;
    for (i=0;i<4;i++)
        for(j=0;j<4;j++){
            var gridCell=$("#grid-cell-" +i +"-" + j);
            gridCell.css('top',getPosTop(i,j));
            gridCell.css('left',getPosLeft(i,j));
        }   
    for(i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(j=0;j<4;j++){
            board[i][j]=0;
            hasConflicted[i][j]=false;
        }
    }
    updateBoardView();
    score=0;
    updatescore(score);
    
}

function updateBoardView(){
    $(".number-cell").remove();
    for (var i=0;i<4;i++)
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'")></div>');
            var theNUmberCell=$("#number-cell-"+i+"-"+j);
            if(board[i][j]==0){
                theNUmberCell.css('height','0px');
                theNUmberCell.css('weight','0px');
                theNUmberCell.css('top',getPosTop(i,j)+0.5*cellSideLength);
                theNUmberCell.css('left',getPosLeft(i,j)+0.5*cellSideLength);
            }
            else{
                theNUmberCell.css('height',cellSideLength);
                theNUmberCell.css('width',cellSideLength);
                theNUmberCell.css('top',getPosTop(i,j));
                theNUmberCell.css('left',getPosLeft(i,j));
                theNUmberCell.css('background-color',getNumberBgcolor(board[i][j]));
                theNUmberCell.css('color',getNumberColor(board[i][j]));
                theNUmberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    $(".number-cell").css('line-height',cellSideLength+'px');
    $(".number-cell").css('font-size',0.6*cellSideLength+'px');    
}

function generateOneNumber(){
    if (nospace(board))
        return false;
    //随机一个位置
    var randx=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4));
    var time=0;

    while(time<50){
        if(board[randx][randy]==0)
            break;
 
        randx=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4));
        time++;
        
    }
    if(time==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
    }

    //随机一个数字
    var randNumber=Math.random()<0.5?2:4;
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);
    return true;
    
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left
            event.preventDefault();
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
                
            }
            break;
        case 38://up
           event.preventDefault();
           if(moveUp()){
                 setTimeout("generateOneNumber()",210);
                 setTimeout("isgameover()",300);
                 
           }
            break;  
        case 39://right
            event.preventDefault();
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
                
            }
            break;
        case 40://down
          event.preventDefault();
          if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
                
            }
            break;
        default:
            break;
    }
});



/*document.addEventListener('touchmove',function(event){
    event.preventDefault();
});*/

document.addEventListener('touchstart',function(event){

    event.preventDefault();

    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
}, { passive: false });

document.addEventListener('touchend',function(event){

    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;

    var deltax=endx-startx;
    var deltay=endy-starty;

    if(Math.abs(endx-startx)<0.2*documentWidth && Math.abs(endy-starty)<0.2*documentWidth)
        return;
    //x direction
    if(Math.abs(endx-startx)>=Math.abs(endy-starty)){
        if(deltax<0){
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);    
            }
        }
        else{
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);    
            }
        }
    }
    //y direction
    else{
        if(deltay<0){
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);               
          }          
        }
        else{
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);                
            }
        }
    }
});



function moveLeft(){
    if(!canMoveLeft(board))
        return false;
    //move left
    for(var i=0;i<4;i++)
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
            
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                    //move
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && hasConflicted[i][k]==false){
                        //move
                        showMoveAnimation(i,j,i,k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updatescore(score);
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }

            }
        }
    setTimeout("updateBoardView()",200);
    return true;
}


function moveUp(){
    if (!canMoveUp(board) )
        return false;
    //move up
    for(var i=1;i<4;i++)
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(k,i,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(k,i,j,board)&&hasConflicted[k][j]==false){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j]=0;
                        score += board[k][j];
                        updatescore(score);
                        hasConflicted[k][j]=true;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200);    
    return true;
}


function moveRight(){
    if(!canMoveRight(board))
        return false;
    //move right
    for(var i=0;i<4;i++)
        for(var j=2;j>=0;j--){
            if (board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[i][k]==board[i][j]&& noBlockHorizontal(i,j,k,board)&&hasConflicted[i][k]==false){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j]=0;
                        score += board[i][k];
                        updatescore(score);
                        hasConflicted[i][k]=true;
                    }
                }
            }                    
        }
    setTimeout("updateBoardView()",200); 
    return true;
}


function moveDown(){
    if(!canMoveDown(board))
        return false;
    //move down
    for(var i=2;i>=0;i--)
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(i,k,j,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                    }
                    else if(board[k][j]==board[i][j] && noBlockVertical(i,k,j,board) && hasConflicted[k][j]==false){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j]=0;
                        score += board[k][j];
                        updatescore(score);
                        hasConflicted[k][j]=true;
                    }
                }
            }
        }
    setTimeout("updateBoardView()",200)
    return true;
}


function isgameover(){
    if(gameover(board))
        alert("gameover!");

}

function gameover(board){
    if(canMoveDown(board)||canMoveLeft(board)||canMoveLeft(board)||canMoveUp(board))
        return false;
    return true;
}