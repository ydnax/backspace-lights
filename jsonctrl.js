var api = require('./api.js');
var util = require('util');
var data = {
    "version" : "0.0.1",
    "devices":{
        "led1":{
            "_type"  : "rgb",
            "channel": 200,
            "mode"   : -1,
            "red"    : 0,
            "green"  : 1,
            "blue"   : 2,
        },
        "led2":{
            "_type"  : "rgb",
            "channel": 203,
            "mode"   : -1,
            "red"    : 0,
            "green"  : 1,
            "blue"   : 2,
        },
    },
    "animation" : [
        {"led1":[100,0,  0],   "_time":1001 },
        {"led1": [0,0,0], "led2": [0,0,0], "_time":500  },
        {"led1":[100,0,  100], "_time":1001 },
        {"led1":[100,100,0],   "_time":1001 }
    ],
    "options":{
        "repeat": true,
        //"pause" : 0, //TODO
        //"repeat_reverse" : false, // TODO
        "host" : "lighting.bckspc.de"
    }
};
var parseData = function(data){
    validate(data);
    var opts = buildOptions(data);
    var client = new api.DmxClient(opts.host, opts.port);
    var devices = buildDevices(data, client);
    // console.log(util.inspect(devices, false, 3));
    var anim = buildAnimation(data, devices);
    console.log(util.inspect(anim, false, 4));
    console.log("ok");
};
var validate = function(data){
    if(data.version != "0.0.1"){
        throw "Invalid Version.";
    }
};
var buildOptions = function(data){
    var data=data.options;
    var ret = {};
    ret.host = data.host || (function(){throw "No host set."})();
    ret.port = data.port;
    ret.repeat = data.repeat;
    var allowed_opts = ['host', 'port', 'repeat'];
    Object.keys(data).forEach(function(k){
        if(allowed_opts.indexOf(k)==-1)
            throw "Invalid option key: " + k;
    });
    return ret;
};
var buildDevices = function(data, client){
    var ret = {};
    var data=data.devices;
    for(devicename in data){
        var raw=data[devicename];
        if(raw._type!="rgb")
            throw "Wrong type " + raw._type + " for device " + devicename;
        var channel = raw.channel*1;
        var mode = raw.mode*1;
        var red = raw.red*1;
        var green = raw.green*1;
        var blue = raw.blue*1;
        ret[devicename] = client.RgbDevice(channel, mode, red, green, blue);
    }
    return ret;
};
var buildAnimation = function(data, devices){
    var data = data.animation;
    var ret = [];
    for(var i=0;i<data.length;i++){
        var current = data[i];
        var time = current._time*1 || 1000;
        (current._time && (delete current._time));
        // console.log(time);
        var elements = [];
        for(devicename in current){
            // console.log("d: %s, i_ %s", devicename, i);
            if(devicename.indexOf('_')==0)
                throw "invalid animationstep option: " + devicename;
            if(!(devicename in devices))
                throw "unknown devicename: " + devicename;
            var params = current[devicename];
            params.push(time);
            elements.push([devices[devicename], 'fadeTo', params]);
        }
        ret.push({time:time, elements:elements});
    }
    return ret;
};

var playAnimations = function(data, index){
    var index=index==undefined?0:index+1;
    index=index>=data.length?0:index;
    data[index].elements.forEach(function(elem){
        doCall.apply(undefined, elem);
    });
    setTimeout(function(){
        playAnimations(data, index);
    },data[index].time);
};

var doCall=function(object, funname, params){
    object[funname].apply(object, params);
};

parseData(data);








 













