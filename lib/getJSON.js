'use strict'
var https = require('https')
module.exports = function getJSON (url, done) {
  var wasError = false
  https.get(url, function (res) {
    var data = ''
    res.on('data', function (d) {
      data += d
    })
    res.on('end', function () {
      var result
      try {
        result = JSON.parse(data)
      } catch (e) {
        wasError = true
        console.error(data)
        done(e)
      }
      // Catch Google API error
      if (result.error_message) {
        wasError = true
        done(new Error('Google API Error: ' + result.error_message))
      }
      // Catch Slack API error
      if (result.error) {
        wasError = true
        done(new Error('Slack API Error: ' + result.error))
      }
      if (!wasError) {
        done(null, result)
      }
    })
  }).on('error', function (e) {
    wasError = true
    done(e)
  })
}
