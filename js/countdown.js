/**
    * Created by pyf on 2015/8/31.
    */

var WINDOW_WIDTH = document.body.clientWidth;
var WINDOW_HEIGHT = document.body.clientHeight;
var RADIUS = 8;
var MARGIN_TOP = 50;

var curShowTimeSeconds = 0;

var balls = [];

var colors = ['#33B5E5', '#0099CC', '#AA66CC', '#9933CC',
    '#99CC00', '#669900', '#FF8800', '#FF4444', '#CC0000'];

window.onload = function(){
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = 800;

    MARGIN_LEFT = Math.round(WINDOW_WIDTH/10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT/5);

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    var context = canvas.getContext('2d');
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render(context);
            update(context);
        },50
    );
};

function getCurrentShowTimeSeconds(){
    var curTime = new Date();
    var ret = curTime.getHours()*3600 + curTime.getMinutes()*60 + curTime.getSeconds();

    return ret >=0 ? ret:0;
}

function render(cxt){
    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours*3600) / 60);
    var seconds = curShowTimeSeconds % 60;

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt);
    renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt);
    renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt);
    renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt);
    renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt);
    renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt);
}

function renderDigit(x, y, num ,cxt){
    cxt.fillStyle = 'rgb(0, 102, 153)';

    for(var i = 0;i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] === 1){
                cxt.beginPath();
                cxt.arc(getX(x,j,RADIUS), getY(y,i,RADIUS), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}

function getX(x, j, R){
    return x + j*2*(R+1) + (R+1)
}

function getY(y, i, R){
    return y + i*2*(R+1) + (R+1)
}

function update(cxt){
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours*3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if(nextSeconds != curSeconds){
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(curMinutes%10));
        }
        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(curHours/10));
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(curHours%10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
    renderBalls(cxt);
}

function addBalls(x, y, num){
    for(var i = 0;i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if(digit[num][i][j] === 1){
                var ball = {
                    x: getX(x,j,RADIUS),
                    y: getY(y,i,RADIUS),
                    g: 1.5+Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random()*1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random()*colors.length)]
                };
                balls.push(ball);
            }
        }
    }
}

function updateBalls(){
    for(var index = 0; index < balls.length; index++){
        balls[index].x += balls[index].vx;
        balls[index].y += balls[index].vy;
        balls[index].vy += balls[index].g;

        if(balls[index].y >= WINDOW_HEIGHT-RADIUS){
            balls[index].y = WINDOW_HEIGHT-RADIUS;
            balls[index].vy = -balls[index].vy*0.75
        }
    }

    var cnt = 0;
    for(var j = 0; j < balls.length; j++){
        if(balls[j].x + RADIUS > 0 && balls[j].x - RADIUS < WINDOW_WIDTH){
            balls[cnt++] = balls[j];
        }
    }

    while(balls.length > cnt){
        balls.pop();
        console.log('del');
        console.log(balls.length);
    }
}

function renderBalls(cxt){
    for(var index = 0; index < balls.length; index++){
        cxt.beginPath();
        cxt.arc(balls[index].x, balls[index].y, RADIUS, 0, 2*Math.PI, true);
        cxt.fillStyle = balls[index].color;
        cxt.closePath();
        cxt.fill();
    }
}