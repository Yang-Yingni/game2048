function showNumberWithAnimation(i,j,randNumber){
    var numberCell=$("#number-cell-"+i+"-"+j);

    numberCell.css('background-color',getNumberBgcolor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width:cellSideLength,
        height:cellSideLength,
        left:getPosLeft(i,j),
        top:getPosTop(i,j)
    },50);
}

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
    left:getPosLeft(tox,toy),
    top:getPosTop(tox,toy)
    },200);
}

function updatescore(score){
    $("#score").text(score);


}