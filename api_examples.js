var api = require('./api.js');
var c = new api.DmxClient("lighting.bckspc.de");
var l = [];
for(var i=0;i<6;i++){ // ledleisten
    l.push(c.RgbDevice(200+(i*3), -1, 0,1,2));
}
//*
for(var i=0;i<8;i++){ // ledleisten
    var start = 34 + (i*11);
    l.push(c.RgbDevice(start,   41, 2, 3, 4));
    l.push(c.RgbDevice(start+5, -1, 0, 1, 2));
    l.push(c.RgbDevice(start+8, -1, 0, 1, 2));
}//*/



//*
var ttf=1000;
var fade = function(){
    //console.log('start fade');
    l.forEach(function(i){
        i.brightness=0.05;
        i.fadeTo(Math.random()*255, Math.random()*255, Math.random()*255, ttf);
    })
    setTimeout(fade, ttf*1.5);
};
fade();//*/


/*
var ttf=80;
var strobe = function(){
    l.forEach(function(i){
        i.fadeTo(255, 255, 255, ttf);
    });
    setTimeout(function(){
        l.forEach(function(i){
            i.fadeTo(0, 0, 0, ttf);
        });
        setTimeout(strobe, ttf);
    }, ttf);
};
strobe();

//*/

/*
setInterval(function(){
    l.forEach(function(i){
        i.fadeTo(250, 200, 0, 500);
    });
    setTimeout(function(){
        l.forEach(function(i){
            i.fadeOut(500);
        });     
    },500);
}, 1000);//*/


/*
l.forEach(function(i){
    //i.brightness=1.0;
    i.fadeTo(255, 255, 255, 500);
});//*/


/*
var ttf=10000;
var cols = function(){
    l.forEach(function(i){
        i.brightness=0.5;
        i.fadeTo(250, 0, 0, 0);
    });
    setTimeout(function(){
        l.forEach(function(i){
            i.brightness=0.5;
            i.fadeTo(0, 250, 0, 0);
        });
        setTimeout(function(){
            l.forEach(function(i){
                i.brightness=0.5;
                i.fadeTo(0, 0, 250, 0);
            });
            setTimeout(function(){cols()}, ttf);
        },ttf);
    },ttf);
};

cols();
//*/