//leuchtet blau.
var lightctrl = require('node-dmxlights');
var colors    = lightctrl.Colors;
var modes     = lightctrl.modes;
var client    = new lightctrl.DmxClient("lighting.bckspc.de");

var left   = new lightctrl.Device(client, 78, modes['3_segment']);
var middle = new lightctrl.Device(client, 67, modes['3_segment']);
var right  = new lightctrl.Device(client, 56, modes['3_segment']);
var dleft  = new lightctrl.Device(client, 45, modes['3_segment']);
var dright = new lightctrl.Device(client, 34, modes['3_segment']);

var frames = [  [left, colors.c3_blue_l],   [left, colors.c3_blue_m],   [left, colors.c3_blue_r],
                [middle, colors.c3_blue_l], [middle, colors.c3_blue_m], [middle, colors.c3_blue_r],
                [right, colors.c3_blue_l],  [right, colors.c3_blue_m],  [right, colors.c3_blue_r],
                [dleft, colors.c3_blue_l],  [dleft, colors.c3_blue_m],  [dleft, colors.c3_blue_r],
                [dright, colors.c3_blue_l], [dright, colors.c3_blue_m], [dright, colors.c3_blue_r],
                                            [dright, colors.c3_blue_m], [dright, colors.c3_blue_l],
                [dleft, colors.c3_blue_r],  [dleft, colors.c3_blue_m],  [dleft, colors.c3_blue_l],
                [right, colors.c3_blue_r],  [right, colors.c3_blue_m],  [right, colors.c3_blue_l],
                [middle, colors.c3_blue_r], [middle, colors.c3_blue_m], [middle, colors.c3_blue_l],
                [left, colors.c3_blue_r],   [left, colors.c3_blue_m]
                ];
var cyclewait = 100;
var pos = 0;
var cycleColors = function(){
    frames[pos%frames.length][0].setVals(colors.c3_black);
    pos++;
    frames[pos%frames.length][0].setVals(frames[pos%frames.length][1]);
    client.flush();
    setTimeout(cycleColors, cyclewait);
};
cycleColors();



var playFrames = function(frames, time, pos){
    if(!pos)
        pos=0;
    frames[pos%frames.length][0].setVals(frames[pos%frames.length][1], true);
    setTimeout(function(){playFrames(frames, time, pos+1)}, time);
};

var transition = require('js-transition');
var ledcols = [colors.c1_red, colors.c1_green, colors.c1_blue];
var ledmode={mode:0, blue:0, green:1, red:2};
var ledleiste = new lightctrl.Device(client, 200, ledmode);

var fps = 30;
var time = 500;
var framecount = Math.floor( fps * (time/1000) );
var s1 = transition.Arrays(colors.c1_black, colors.c1_blue, framecount);
s1 = s1.map(function(i){return [ledleiste, i]});
var s2 = transition.Arrays(colors.c1_blue, colors.c1_black, framecount);
s2 = s2.map(function(i){return [ledleiste, i]});
playFrames(s1.concat(s2), 1000/fps, 0);