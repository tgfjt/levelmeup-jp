var level = require('level-prebuilt')
var sub = require('level-sublevel')
var db = sub(level(process.argv[2]))

var robots = db.sublevel('robots');
robots.put('slogan', 'beep boop');

var dinosaurs = db.sublevel('dinosaurs');
dinosaurs.put('slogan', 'rawr');
