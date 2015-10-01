#!/usr/bin/env node
'use strict'

var path = require('path')
require('envoodoo')(path.resolve(__dirname, '.env'))
var geolocate = require('geolocate')
var getJSON = require('./lib/getJSON')

var allowedTypes = require('./placesTypes.json')

var googleApiKey = process.env.GOOGLE_API_KEY
var slackApiKey = process.env.SLACK_API_KEY
var channelId = process.env.CHANNEL_ID
var username = process.env.USERNAME
var botName = process.env.BOT_NAME || 'LocationBot'
var addressType = process.env.ADDRESS_TYPE || 'neighborhood'

if (!googleApiKey || !slackApiKey || !channelId || !username) {
  console.error('GOOGLE_API_KEY, SLACK_API_KEY, CHANNEL_ID and USERNAME must be set in .env or passed as environment variables')
  process.exit()
}

function notifySlack (locationString) {
  var msg = username + ' checked in near ' + locationString + ' (' + (new Date(Date.now())).toString() + ')'
  var slackUrl = 'https://slack.com/api/chat.postMessage?token=' + slackApiKey + '&channel=' + channelId + '&username=' + botName + '&text=' + encodeURIComponent(msg)
  getJSON(slackUrl, function (err, res) {
    if (err) {
      console.error(err)
      process.exit()
    }
    console.log(msg)
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
      var requestedAddresses = result.results.filter(function (address) {
        return address.types.indexOf(addressType) >= 0 && address.formatted_address
      })

      if (!requestedAddresses[0]) {
        console.error('Could not find a ' + addressType + ' for this location')
      } else {
        notifySlack(requestedAddresses[0].formatted_address)
      }
    })
  }
})
