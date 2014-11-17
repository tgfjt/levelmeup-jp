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
    , fs       = require('fs')
    , existing = require('../../lib/setup-existing')

exercise.addSetup(function (mode, callback) {
  existing.setup(mode === 'run')

  var ops = fs.readFileSync(path.join(__dirname, '../../data/node_0.8_commits.dat'), 'utf8')
        .split('\n')
        .map(function (line) {
          var m = line.match(/^([^\s]+)\s+(.+)$/)
          return m && { type: 'put', key: m[1], value: m[2] }
        })
        .filter(Boolean)

        var self = exercise


    existing.writeAndClose(
      function (db, callback) {
        db.batch(ops, callback)
      }
    , function (err) {
        if (err)
          return callback(err)

        self.submissionArgs = [ existing.dir1 ]
        self.solutionArgs   = [ existing.dir2 ]

        process.nextTick(callback)
      }
  )
})

exercise.addCleanup(function (mode, passed, callback) {
  // mode == 'run' || 'verify'

  existing.cleanup(callback)
})

module.exports       = exercise
module.exports.async = true
