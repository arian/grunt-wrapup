"use strict";

var fs = require('fs');
var path = require('path');
var WrapUp = require('wrapup/lib/wrapup');
var AMDOne = require('wrapup/lib/output/amdOneFile');
var forOwn = require('prime/object/forOwn');

function pad(n) {
  return String(n < 10 ? ('0' + n) : n);
}

module.exports = function(grunt) {

  grunt.registerMultiTask('wrapup-amd', 'Build Partition JS', function() {
    var done = this.async();
    var args = this.data;

    if (!args.output && !args.watch) {
      grunt.log.error('The output option is required');
      return;
    }

    var amd = new AMDOne();
    var wrup = new WrapUp();
    if (Array.isArray(args.require)) {
      args.require.forEach(function(file) {
        file = path.resolve(process.cwd(), file);
        wrup.require(file);
      });
    } else {
      for (var name in args.require) {
        var r = args.require[name];
        var file = typeof r == 'string' ? r : name;
        file = path.resolve(process.cwd(), file);
        if (typeof r == 'string') wrup.require(name, file);
        else wrup.require(file);
      }
    }

    var _path = args.path || process.cwd();

    if (args.map) {
      var map = JSON.parse(fs.readFileSync(args.map));
      forOwn(map, function(files) {
        files.forEach(function(file) {
          wrup.require(_path + '/' + file);
        });
      });
    }

    amd.set('output', args.output);
    amd.set('compress', args.compress);
    amd.set('path', _path);
    amd.set('sourcemap', args.sourceMap);
    amd.set('sourcemapURL', args.sourceMapUrl);
    amd.set('sourcemapRoot', args.sourceMapRoot);
    wrup.scanner.set('sourcemap', args.sourceMap);
    amd.set('ast', args.ast);
    wrup.withOutput(amd);
    wrup.on('change', function(file) {
      grunt.log.writeln('=> ' + path.relative(process.cwd(), file) + " was changed");
    });
    amd.on('output', function(file) {
      var d = new Date();
      var time = d.getHours() + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      grunt.log.ok("[" + time + "] The file " + path.relative(_path, file) + " has been written");
    });
    if (args.watch) wrup.watch(function(err) {
      if (err) grunt.log.error(err);
    });
    else wrup.up(done);
  });

};
