# SETI
An application which notifies a [spark core](http://spark.io) when a twitter user follows one of a specified list of users. If twitter users are of a specified influencer level, an extra notifier occurs.


## Pics
Pics coming soon.


## Setup
The following environment variables are required
* `TWITTER_CONSUMER_KEY`
* `TWITTER_CONSUMER_SECRET`
* `TWITTER_ACCESS_TOKEN`
* `TWITTER_ACCESS_TOKEN_SECRET`
* `TRACK_USERS` - Space separated list of users you'd like to track (eg. "joelongstreet phard joenormal")
* `SPARK_CORE_ACCESS_TOKEN`
* `SPARK_CORE_ID`
* `MIN_FOLLOWERS` - The minimum number of followers to trigger an influencer alert to the Spark.


## REST Routes
A few rest routes are available for the client side application to consume:

* `/:twitterUsername` - Return data about the user
* `/:twitterUsername/followers/` - Return data about the user's most recent 20 followers.
