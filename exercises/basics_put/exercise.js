var exercise      = require('workshopper-exercise')()
  , filecheck     = require('workshopper-exercise/filecheck')
  , execute       = require('workshopper-exercise/execute')
  , comparestdout = require('workshopper-exercise/comparestdout')

// checks that the submission file actually exists
exercise = filecheck(exercise)

// execute the solution and submission in parallel with spawn()
exercise = execute(exercise)

// compare stdout of solution and submission
exercise = comparestdout(exercise)

const path        = require('path')
    , level       = require('level')
    , gibberish   = require('echomunge/dir2gibberish').bind(null, path.join(__dirname, '../..'))
    , existing    = require('../../lib/setup-existing')
    , PassThrough = require('stream').PassThrough || require('readable-stream/passthrough')
    , through2map = require('through2-map')

function streamTo (dir, out) {
  var db = level(dir)

  db.readStream()
    .pipe(through2map({ objectMode: true }, function (data) {
      return data.key + ' = ' + data.value + '\n'
    }))
    .pipe(out)
}

exercise.addSetup(function (mode, callback) {
  var run = mode === 'run'

  existing.setup(run, false)

  var c             = Math.ceil(Math.random() * 10) + 2
    , i             = c
    , obj           = {}
    , jsonobj
    , submissionOut = new PassThrough()
    , solutionOut   = !run && new PassThrough()

  while (i-- >= 1)
    obj['nonsense' + i] = gibberish()

  jsonobj = JSON.stringify(obj)

  setTimeout(streamTo.bind(null, existing.dir1, submissionOut), 500)
  ;!run && setTimeout(streamTo.bind(null, existing.dir2, solutionOut), 500)

  this.submissionArgs = [ existing.dir1, jsonobj ]
  this.solutionArgs   = [ existing.dir2, jsonobj ]
  this.a              = submissionOut
  this.b              = !run && solutionOut

  process.nextTick(callback)    
})

exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  existing.cleanup(callback)
})

module.exports = exercise

