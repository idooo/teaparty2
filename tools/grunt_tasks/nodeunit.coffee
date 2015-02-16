tests = '*_test.js'
process.argv.forEach( (val) ->
  if val.split('=')[0] == '--tests'
    tests = val.split('=')[1]
)

module.exports.tasks =

  nodeunit:
    integration: ["tests/api_integration_tests/#{tests}"]
