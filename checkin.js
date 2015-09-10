#!/usr/bin/env node
'use strict'

var path = require('path')
require('envoodoo')(path.resolve(__dirname, '.env'))
var geolocate = require('geolocate')
var https = require('https')

var allowedTypes = require('./placesTypes.json')

var googleApiKey = process.env.GOOGLE_API_KEY
var slackApiKey = process.env.SLACK_API_KEY
var channelId = process.env.CHANNEL_ID
var username = process.env.USERNAME
var botName = process.env.BOT_NAME || 'LocationBot'
var localeType = process.env.LOCALE_TYPE || 'neighborhood'

if (!googleApiKey || !slackApiKey || !channelId || !username) {
  console.error('GOOGLE_API_KEY, SLACK_API_KEY, CHANNEL_ID and USERNAME must be set in .env or passed as environment variables')
  process.exit()
}

function notifySlack (locationString) {
  var msg = encodeURIComponent(username + ' checked in near ' + locationString + ' (' + (new Date(Date.now())).toString() + ')')
  var slackUrl = 'https://slack.com/api/chat.postMessage?token=' + slackApiKey + '&channel=' + channelId + '&username=' + botName + '&text=' + msg
  getJSON(slackUrl, function (err, res) {
    if (err) {
      console.error(err)
      process.exit()
    }
    console.log(msg)
  })
}

function getJSON (url, done) {
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
      if (result.error_message) {
        wasError = true
        done(new Error('Google API Error: ' + result.error_message))
      }
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

geolocate(function (latLong) {
  if (process.argv[2]) {
    var requestedType = process.argv[2]
    if (!(allowedTypes.indexOf(requestedType) >= 0)) {
      console.error('Type must be one of ' + allowedTypes.join(', '))
      process.exit()
    }

    var placesSearchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + latLong.join(',') + '&rankby=distance&types=' + requestedType + '&key=' + googleApiKey
    getJSON(placesSearchUrl, function (err, places) {
      if (err) {
        console.error(err)
        process.exit()
      }
      if (places.results && places.results[0]) {
        var place = places.results[0]
        notifySlack(place.name + ', ' + place.vicinity)
      } else {
        console.error('Could not find a ' + requestedType + ' near this location')
      }
    })
  } else {
    var reverseGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLong.join(',') + '&key=' + googleApiKey

    getJSON(reverseGeocodeUrl, function (err, result) {
      if (err) {
        console.error(err)
        process.exit()
      }
      var requestedLocales = result.results.filter(function (locale) {
        return locale.types.indexOf(localeType) >= 0 && locale.formatted_address
      })

      if (!requestedLocales[0]) {
        console.error('Could not find a ' + localeType + ' for this location')
      } else {
        notifySlack(requestedLocales[0].formatted_address)
      }
    })
  }
})
