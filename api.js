var lightctrl  = require('node-dmxlights');
var transition = require('js-transition');

var FPS = 30;//constant to define the steps/frames er time for fades

var DmxClient = function(host, port){
    host = host||"lighting.bckspc.de";
    this.client = new lightctrl.DmxClient(host, port);
    var that=this;
    setInterval(function(){that.client.flush()},30);//equals >30 fps.
};

DmxClient.prototype.RgbDevice = function(channel, mode, red, green, blue){
    return new RgbDevice(this.client, channel, mode, red, green, blue);
};

var RgbDevice = function(client, channel, mode, red, green, blue){
    var options = {
        mode:  mode,
        red:   red,
        green: green,
        blue:  blue
    };
    this.device = new lightctrl.Device(client, channel, options);
    this.flush = false;
    this.brightness=1;
    this.current = {
        red:   255,
        green: 255,
        blue:  255
    };
    this.setColor(this.current);
};

RgbDevice.prototype.fadeOut = function(time, callback){
    this.fadeTo(0, 0, 0, time, callback);
};

RgbDevice.prototype.fadeTo = function(red, green, blue, time, callback){
    time = time || 1000;
    var steps = FPS/1000*time;
    var to = {
        red:   red,
        green: green,
        blue:  blue
    };
    var frames = transition.Arrays(this.current, to, steps);
    this.playFrames(frames, callback);
};

RgbDevice.prototype.setColor = function(color){
    var ncolor={
        red:   Math.round(color.red   * this.brightness),
        green: Math.round(color.green * this.brightness),
        blue:  Math.round(color.blue  * this.brightness)
    };
    this.current = color;
    this.device.setVals(ncolor);
    if(this.flush)
        this.device.client.flush();
};

RgbDevice.prototype.playFrames = function(frames, callback){
    if (frames.length==0){
        if(callback)
            callback();
        //console.log('end frames');
        return;
    }
    var time = 1000/FPS;
    this.setColor(frames[0]);
    var that = this;
    setTimeout(function(){
        that.playFrames(frames.splice(1))
    }, time);
};

module.exports.DmxClient = DmxClient; 