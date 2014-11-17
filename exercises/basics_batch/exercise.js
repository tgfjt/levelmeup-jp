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
    , fs          = require('fs')
    , os          = require('os')
    , level       = require('level')
    , gibberish   = require('echomunge/dir2gibberish').bind(null, path.join(__dirname, '../..'))
    , existing    = require('../../lib/setup-existing')
    , PassThrough = require('stream').PassThrough || require('readable-stream/passthrough')
    , through2map = require('through2-map')
    , dataFile    = path.join(os.tmpDir(), '~levelmeup_3_' + process.pid)

function streamTo (dir, out) {
  var db = level(dir)

  db.readStream()
    .pipe(through2map({ objectMode: true }, function (data) {
      console.log(data);
      return data.key + ' = ' + data.value + '\n'
    }))
    .pipe(out)
}

exercise.addSetup(function (mode, callback) {
  var run = mode === 'run'

  existing.setup(run)

  var i             = Math.ceil(Math.random() * 10) + 5
    , fileContents  = 'del,!existing1\n'
    , submissionOut = new PassThrough()
    , solutionOut   = !run && new PassThrough()
    , ops           = [
          { type: 'put', key: '!existing1', value: 'THIS ENTRY SHOULD BE DELETED!' }
        , { type: 'put', key: '~existing2', value: 'THIS ENTRY SHOULD BE DELETED ALSO!' }
      ]

  while (i-- >= 1) {
    fileContents +=
        'put,batchable'
        + Math.floor(Math.random() * 100)
        + ','
        + gibberish().replace(/,/g, '')
        + '\n'
  }

  fileContents += 'del,~existing2'

  fs.writeFileSync(dataFile, fileContents, 'utf8')

  existing.writeAndClose(
      function (db, cb) {
        db.batch(ops, cb)
      }
    , function (err) {
        setTimeout(streamTo.bind(null, existing.dir1, submissionOut), 500)
        ;!run && setTimeout(streamTo.bind(null, existing.dir2, solutionOut), 500)

        exercise.submissionArgs = [ existing.dir1, dataFile ]
        exercise.solutionArgs   = [ existing.dir2, dataFile ]
        exercise.a              = submissionOut
        exercise.b              = !run && solutionOut

        process.nextTick(callback)
      }
  )
})

exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  existing.cleanup(callback)
})

module.exports = exercise


