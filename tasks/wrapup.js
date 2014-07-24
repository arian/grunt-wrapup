/*
 * grunt-wrapup
 * https://github.com/arian/grunt-wrapup
 *
 * Copyright (c) 2013 Arian Stolwijk
 * Licensed under the MIT license.
 */

"use strict";

var wrapup = require('wrapup');
var path = require('path');

module.exports = function(grunt) {

  grunt.registerMultiTask('wrapup', 'Wraps node modules into web modules', function() {

    var done = this.async();
    var wrup = wrapup(this.data.options);

    if (this.data.requires) {
      for (var name in this.data.requires) {
        var r = this.data.requires[name];
        var file = typeof r == 'string' ? r : name;
        if (typeof r == 'string') wrup.require(name, file);
        else wrup.require(file);
      }
    }

    wrup.on('warn', function (err) {
      grunt.fail.warn(err.message);
    });

    wrup.scanner.on('warn', function(err) {
      if (err.type == 'js') {
        grunt.log.warn(err.message + ": on " + err.module + " at line " + err.line + ", column " + err.col);
      } else {
        grunt.log.warn(err);
      }
    });

    if (this.data.watch) wrup.watch(function(err) {
      if (err) grunt.log.error(err);
    });
    else wrup.up(done);

  });

};
