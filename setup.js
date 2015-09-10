var read = require('read')
var fs = require('fs')
var osenv = require('osenv')
var path = require('path')

function writeResults(results, cb) {
  var filepath = path.join(osenv.home(), '.slackcheckin')

  fs.writeFile(filepath, JSON.stringify(results), 'utf8', cb)
}

module.exports = function (cb) {
  var results = {}

  console.log('We need to know a little bit about your setup before we can get going.')
  read({
    prompt: 'What\'s your google API key?:'
  }, function (err, result, isDefault) {
    results['GOOGLE_API_KEY'] = result
    read({
      prompt: 'What\'s your slack API key?:'
    }, function (err, result, isDefault) {
      results['SLACK_API_KEY'] = result
      read({
        prompt: 'Which slack channel should we post to? (channel id):'
      }, function (err, result, isDefault) {
        results['CHANNEL_ID'] = result
        read({
          prompt: 'What\'s your slack user name?:'
        }, function (err, result, isDefault) {
          results['USERNAME'] = result
          read({
            prompt: 'What name should we make posts under?:',
            default: 'locationbot'
          }, function (err, result, isDefault) {
            results['BOT_NAME'] = result
            read({
              prompt: 'What\'s your preferred default locale?:',
              default: 'neighborhood'
            }, function (err, result, isDefault) {
              results['LOCALE_TYPE'] = result
              writeResults(results, function () {
                console.log('Setup complete.')
                cb()
              })
            })
          })
        })
      })
    })
  })
}
