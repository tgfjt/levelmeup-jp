#!/usr/bin/env node

const workshopper = require('workshopper')
    , path        = require('path')
    , menu        = require('./exercises/menu')

function fpath (f) {
  return path.join(__dirname, f)
}

workshopper({
    name     : 'levelmeup'
  , title    : 'LEVEL ME UP SCOTTY!'
  , subtitle : 'Learn You Some Node.js Databases'
  , exerciseDir : fpath('./exercises/')
  , appDir   : __dirname
  , menu     : {
        bg : 'green'
    }
  , helpFile : fpath('help.txt')
})
