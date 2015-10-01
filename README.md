# node-checkin-slack-osx

This package allows a user to send a location checkin message to the [slack](https://slack.com/) channel of their choice.

## Installation

You must register a Google API key with Places search and Reverse Geocoding services enabled.

Go to the [Google Developers Console](https://console.developers.google.com/)
- Create a new Project
- Go to APIs & Auth -> Credentials
- Add an API Key
- Paste this Key into your .env
- Go to APIs & Auth -> APIs
- Enable **Google Maps Geocoding API** and **Google Places API Web Service**

You must register a Slack API key.

Go to [Slack Web API](https://api.slack.com/web)
- Scroll down to Authentication
- Issue a token (key)
- Paste this Key into your .env

```
npm install
cp .env-example .env
```

Edit values of .env with your keys and preferences.

CHANNEL_ID can be found by hitting https://slack.com/api/channels.list?token=your-api-token

ADDRESS_TYPE should be a valid [Google Reverse Geocode address type](https://developers.google.com/maps/documentation/geocoding/intro#Types). Defaults to 'neighbourhood'.

## CLI Installation

To add slackcheckin as a command to your shell execute
```
npm link .
```

## Usage

```
slackcheckin
```
Sends a message to the configured slack channel checking you in to the nearest region of the type configured.

e.g.

`slackcheckin` **Lewis checked in near Whittier, Boulder, CO, USA (Thu Sep 10 2015 13:10:15 GMT-0600 (MDT))**


```
slackcheckin [placeType]
```

Sends a message to the configured slack channel checking you in to the nearest found Google Place which matches the given placeType


e.g.

`slackcheckin cafe` **Lewis checked in near Jetty Espressoria, 2116 Pearl Street, Boulder (Thu Sep 10 2015 13:14:04 GMT-0600 (MDT))**
