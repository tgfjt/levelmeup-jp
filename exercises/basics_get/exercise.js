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

const path      = require('path')
    , gibberish = require('echomunge/dir2gibberish').bind(null, path.join(__dirname,'../../node_modules/level/'))
    , existing  = require('../../lib/setup-existing')


exercise.addSetup(function (mode, callback) {
  existing.setup(mode === 'run')

  var ops = []
    , i   = 10
    , k

  while (i-- > 0) {
    k = Math.floor(Math.random() * (i == 1 ? 10 : 100))
    ops.push({ type: 'put', key: 'key' + k, value: gibberish() })
  }

  existing.writeAndClose(
      function (db, cb) {
        db.batch(ops, cb)
      }
    , function (err) {
        if (err)
          return callback(err)

        exercise.submissionArgs = [ existing.dir1 ]
        exercise.solutionArgs   = [ existing.dir2 ]

        process.nextTick(callback)
      }
  )
    
})

exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  existing.cleanup(callback)
})

module.exports = exercise
