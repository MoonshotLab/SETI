# SETI
An application which notifies a [spark core](http://spark.io) when a twitter user follows one of a specified list of users. If twitter users are of a specified influencer level, an extra notifier occurs.


## Pics
Pics coming soon.


## Setup
The following environment variables are required:
* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN`
* `TWITTER_ACCESS_TOKEN_SECRET`
* `ALT_TWITTER_CONSUMER_KEY`
* `ALT_TWITTER_CONSUMER_SECRET`
* `ALT_TWITTER_ACCESS_TOKEN`
* `ALT_TWITTER_ACCESS_TOKEN_SECRET`
* `TRACK_USERS` - Comma separated list of users you'd like to track (eg. "joelongstreet,phard,joenormal")
* `SPARK_ACCESS_TOKEN`
* `SPARK_CORE_ID`
* `INFLUENCER_KEY` - The minimum number of followers to trigger an influencer alert to the Spark.
* `MODE` - Set to production to kill live reload and cache new influencers


## REST Routes
A few rest routes are available for the client side application to consume:

* `/:twitterUsername` - Return data about a given user
* `/:twitterUsername/followers/` - Return data regarding the given user's most recent 200 followers
* `/:twitterUsername/influencers/` - Return the full cached list of all followers for the given user which are considered an "influencer"
* `/:twitterUsername/mentions/` - Return up to 100 of the most recent mentions for a given user


## Socket and Broadcasted Events
The following events are broadcasted to a spark core and are available via a websocket subscription. A *tracked* user is defined as any user listed within the *TRACK_USERS* environmnent variable.

* `influencer` - A *tracked user* has a new follower which matches the influencer criteria
* `follow` - A *tracked user* has a new follower
* `mention` - A *tracked user* is mentioned


## Communicating to the firmware
The hardware portion of the app is a [Spark Core](https://www.spark.io/) (a wifi enabled Arduino). To communicate with the device, you post urls with params in the following form - `0,joelongstreet` where 0 is the pin number and the following string is the influencer username. Each pin number is mapped to a specific client.


## What's an Influencer?
An influencer is defined as a follower of a given user which has at least 50,000 followers of their own and follows no more than half of the number of which follow them.


## Scripts
* `node scripts/cache-followers.js joelongstreeet` - Cache all followers in an abbreviated set for user joelongstreet
* `node scripts/rate-limit-status` - Determine the rate limit status of your API key

## Todo
* Need to add a date for when influencer started following  - So we can order by date
* Make login better
* Make mentions for influencers only

## Done
* Use new event name, only stuff arrays into db, make auth work locally,
