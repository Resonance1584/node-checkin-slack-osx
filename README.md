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

LOCALE_TYPE should be a valid Google Reverse Geocode location type. Defaults to 'neighbourhood'.

## Usage

```
npm start
```
Sends a message to the configured slack channel checking you in to the nearest region of the type configured.

e.g.

`npm start` **Lewis checked in near Whittier, Boulder, CO, USA (Thu Sep 10 2015 13:10:15 GMT-0600 (MDT))**


```
npm start [placeType]
```

Sends a message to the configured slack channel checking you in to the nearest found Google Place which matches the given placeType


e.g.

`npm start cafe` **Lewis checked in near Jetty Espressoria, 2116 Pearl Street, Boulder (Thu Sep 10 2015 13:14:04 GMT-0600 (MDT))**
