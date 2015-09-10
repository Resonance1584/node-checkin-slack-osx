# node-checkin-slack-osx

This package allows a user to send a location checkin message to the [slack](https://slack.com/) channel of their choice.

## Installation

You must register a Google API key with Places search and Reverse Geocoding services enabled.

You must register a Slack API key.

```
npm install
cp .env-example .env
```

Edit values of .env with your keys and preferences.

LOCALE_TYPE should be a valid Google Reverse Geocode location type. Defaults to 'neighbourhood'.

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
