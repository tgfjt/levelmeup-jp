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

const path     = require('path')
    , existing = require('../../lib/setup-existing')


exercise.addSetup(function (mode, callback) {
  existing.setup(mode === 'run')

  existing.writeAndClose(
      function (db, cb) {
        db.put('levelmeup', 'You have been LEVELED UP!', cb)
      }
    , function (err) {
        if (err)
          return callback(err)

        exercise.submissionArgs = [ existing.dir1, 'levelmeup' ]
        exercise.solutionArgs   = [ existing.dir2, 'levelmeup' ]

        process.nextTick(callback)
      }
  )
    
})

exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  existing.cleanup(callback)
})

module.exports = exercise
