var canvas = document.getElementById('canvas');

//随机颜色
function getRandomColor(){
    var r = parseInt(Math.random() * 256);
    var g = parseInt(Math.random() * 256);
    var b = parseInt(Math.random() * 256);
    return 'rgb('+ r +','+ g +','+ b +')';
}

//随机数字
function rand(min,max){
    return parseInt(Math.random() * (max - min + 1) + min);
}

function Ball(){
    this.r = rand(2,5);
    this.x = rand(this.r,canvas.width - this.r);
    this.y = rand(this.r,canvas.height - this.r);
    this.speedX = rand(1,10);
    this.speedX = rand(1,2) < 2 ? -this.speedX : this.speedX;
    this.speedY = rand(1,10);
    this.speedY = rand(1,2) < 2 ? -this.speedY : this.speedY;
    this.color = getRandomColor();
    this.count = 0;
}

Ball.prototype = {
    draw:function(){
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.r,0,360,false);
        ctx.fill();
    },
    move:function(){
        if(this.x >= canvas.width - this.r||this.x < this.r){
            this.speedX *= -1;
        }
        if(this.y >= canvas.height - this.r||this.y < this.r){
            this.speedY *= -1;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.count++;
        if(this.count > 30){
            this.color = getRandomColor();
            this.count = 0;
        }
    }
};

function Point(x,y){
    this.x = x||0;
    this.y = y||0;
}
Point.prototype.drawLine = function(balls,l){
    for(var i = 0;i < balls.length;i++){
        if(checkPath(this,balls[i],l)){
            lineTo(this,balls[i]);
        }
    }
}

var balls = [];
for(var i = 0;i < 100;i++) {
    balls.push(new Ball());
}

var mousePoint = new Point();
console.log(mousePoint);

function animation() {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < balls.length;i++) {
        balls[i].draw();
        balls[i].move();
    }


    //连线
    //遍历balls数组，判断两个小球之间的距离
    //如果小于100就画线
    chAndLineTo(balls,100);

    //鼠标线
    mousePoint.drawLine(balls,100);

    window.requestAnimationFrame(animation);
}
animation();

canvas.onclick = function(e){
    e = e||window.event;
    var x = e.clientX - canvas.offsetLeft;
    var y = e.clientY - canvas.offsetTop;
    for(var i = 0;i < balls.length;i++){
        var ballX = balls[i].x;
        var ballY = balls[i].y;
        var ballR = balls[i].r;
        var result = x > ballX - ballR&& x < ballX - ballR;
        var result1 = y > ballY - ballR&& y < ballY - ballR;

        if(result&&result1){
            balls.splice(i,1);
            break;
        }
    }
};




function checkPath(obj1,obj2,l){
    //获取两个对象之间的圆心距
    var ll = Math.pow(obj1.x - obj2.x,2) + Math.pow(obj1.y - obj2.y,2);
    var ll = Math.sqrt(ll);
    if(ll <= l){
        //如果两个圆心距小于设定值，返回真
        return true;
    }
    //否则返回假
    return false;
};
//设置一个画线方法
function lineTo(obj1,obj2) {
    var ctx = document.getElementById('canvas').getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = getRandomColor();
    ctx.moveTo(obj1.x, obj1.y);
    ctx.lineTo(obj2.x, obj2.y);
    ctx.stroke();
}

//设置一个函数用来遍历小球数组，进行画线操作
function chAndLineTo(array,l){
    for(var i = 0;i < array.length;i++){
        for(var j = i + 1;j < array.length;j++){
            if(checkPath(array[i],array[j],l)){
                lineTo(array[i],array[j]);
            }
        }
    }
}

//获取元素距离浏览器可视区的边界距离
function getOffset(ele,dir) {
    dir = dir.replace(/[a-z]/,function(s){
        return s.toLocaleUpperCase();
    });
    var offset = ele['offset' + dir];
    var obj = ele;
    while (obj.offsetParent) {
        obj = obj.offsetParent;
        offset += obj['offset' + dir] + obj['client' + dir];
    }
    return offset;
}

canvas.onmousemove = function(e){
    e = e||window.event;
    //获取鼠标在canvas位置
    var x = e.clientX - getOffset(this,'left');
    var y = e.clientY - getOffset(this,'top');
    mousePoint.x = x;
    mousePoint.y =y;
};



// 交互只改变绘制条件