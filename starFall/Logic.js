canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables And Constants..
var c = canvas.getContext('2d');
//gravity means how much dy will increase after every animation frame
//since all balls will falling down in y direction.
var gravity = .8;
//EnergyLoss is the factor that will determin how huch energy Every Ball 
//Will loss as it hits the ground.
var EnergyLoss = 0.68;
var StarArray = [];
var MinStar = [];
var NumberOfStars = 1;
var SmallStar = [];
var tick = 0;
var Tick = 75;
var GroundHeight = 100;
//Colors is the color array since we want random colors for every Ball.
//We Can Choose Random colors from Here https://color.adobe.com/explore
var Colors = [
    '#FFF587',
    '#FF8C64',
    '#FF665A',
    '#7D6B7D',
    '#A3A1A8'
];
const BackgroundGradient = c.createLinearGradient(0,0,0,canvas.height);
BackgroundGradient.addColorStop(0,'#171e26');
BackgroundGradient.addColorStop(1,'#3f586b');

//some Function That wll be used widely

//this function will return a random integer in the Given Range.
function generatRandomeNumberInGivenRange(SI,EI){
    return SI + Math.random()*(EI-SI);
}


//This Function will return random element of the array
function generatRandomeColorInGivenRange(color){
    return color[Math.floor(Math.random()*color.length)];
}

//Star

function Star(x,y,dx,dy,r){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.color =  generatRandomeColorInGivenRange(Colors);
}

//draw function will draw our circle.
Star.prototype.draw = function(){
    c.save();
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,360,false);
    c.closePath();
    c.shadowColor = "#E3EAEF";
    c.shadowBlur = 20;
    c.fillStyle = '#E3EAEF';
    c.fill();
    c.restore();
};

//update circle will run after every animation frame
Star.prototype.update = function(){
    //Corner Cases when Ball collide with boundries.
    if(this.y + this.r + this.dy >= canvas.height-GroundHeight){
        this.dy = -this.dy*EnergyLoss;
        this.StarExplosion();
        if(this.r <= 0)
            return;
    }
    if(this.x + this.r + this.dx >= canvas.width || this.x  - this.r - this.dx <= 0){
        this.dx = -this.dx*EnergyLoss;
        this.StarExplosion();
        if(this.r <= 0)
            return;
    }
    this.y += this.dy;
    this.x += this.dx;
    this.draw();
    this.dy += gravity;
}

Star.prototype.StarExplosion = function(){
    this.r -= 4;
    for(let i = 0 ; i < 8 ; i++){
        DY = generatRandomeNumberInGivenRange(-15,15);
        DX = generatRandomeNumberInGivenRange(-5,5);
        MinStar.push(new MiniStar(this.x,this.y,DX,DY,2));
    }

}

//MinStar
function MiniStar(x,y,dx,dy,r){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.color =  'white';
    this.ttl = 100;
    this.opacity = 1;
}

MiniStar.prototype.draw = function(){
    c.save();
    c.beginPath();
    c.arc(this.x,this.y,this.r,0,360,false);
    c.shadowColor = "#E3EAEF";
    c.shadowBlur = 20;
    c.closePath();
    c.fillStyle = `rgba(227,234,239,${this.opacity})`;
    c.fill();
    c.restore();
};


MiniStar.prototype.update = function(){
    //Corner Cases when Ball collide with boundries.
    if(this.y + this.r + this.dy >= canvas.height-GroundHeight){
        this.dy = -this.dy*EnergyLoss;
    }
    this.y += this.dy;
    this.x += this.dx;
    this.draw();
    this.dy += gravity;
    this.ttl -= 1;
    this.opacity -= 1/this.ttl;
}

//Mountain
function Mountain(Number,Height,color){
    mountainWidth = canvas.width/Number;
    for(let i = 0 ; i < Number ; i++){
        c.beginPath();
        c.moveTo(mountainWidth*i,canvas.height);
        c.lineTo(mountainWidth*(i+1)+325,canvas.height);
        c.lineTo((mountainWidth*(i+1)+mountainWidth*i)/2,canvas.height-Height);
        c.lineTo(mountainWidth*i-325,canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}


//This function will be called repeatedly
function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = BackgroundGradient;
    c.fillRect(0,0,window.innerWidth,window.innerHeight);
    
    for(let i = 0 ; i < SmallStar.length ; i++){
        SmallStar[i].draw();
    }

    Mountain(1,canvas.height-50,'#384551');
    Mountain(2,canvas.height-100,'#2B3843');
    Mountain(3,canvas.height-300,'#26333E');
    c.fillStyle = '#182028';
    c.fillRect(0,canvas.height-GroundHeight,canvas.width,canvas.height);
    for(let i = 0 ; i < StarArray.length ; i++){
        if(StarArray[i].r > 0)
            StarArray[i].update();
        else
            StarArray.splice(i,1);
    }
    for(let i = 0 ; i < MinStar.length ; i++){
        MinStar[i].update();
        if(MinStar[i].ttl <= 0){
            MinStar.splice(i,1);
        }
    }
    tick++;
    if(tick % Tick == 0){
        
        dx = generatRandomeNumberInGivenRange(-3.5,3.5);
        dy = generatRandomeNumberInGivenRange(-3.5,3.5);
        R = generatRandomeNumberInGivenRange(5,18);
        x = generatRandomeNumberInGivenRange(R,canvas.width-R);
        StarArray.push(new Star(x,-100,dx,dy,R));
        // Tick = generatRandomeNumberInGivenRange(75,200);
    }
}


//init function is used whenever we resize or click the screen
//it will reset the height and width(resizing) and generate random
//Balls
function init(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    StarArray = [];
    MinStar = [];
    for(var i = 0 ; i < NumberOfStars ; i++){
        var DX = generatRandomeNumberInGivenRange(-3.5,3.5);
        var DY = generatRandomeNumberInGivenRange(-3.5,3.5);
        var R = generatRandomeNumberInGivenRange(5,18);
        var X = generatRandomeNumberInGivenRange(R,canvas.width-R);
        var Y = -100;
        StarArray.push(new Star(X,Y,DX,DY,R));
    }
    for(let i = 0 ; i < 150 ; i++){
        var R = generatRandomeNumberInGivenRange(0,3);
        var X = generatRandomeNumberInGivenRange(R,canvas.width-R);
        var Y = generatRandomeNumberInGivenRange(R,canvas.height-R);
        SmallStar.push(new Star(X,Y,0,0,R));
    }
}

window.addEventListener('click',init);
window.addEventListener('resize',init);
init();
animate();
