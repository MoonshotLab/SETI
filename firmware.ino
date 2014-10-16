int clientPins[] = {D0, D1, D2, D3};
int discoBall = {D4};


String getInfluencerFromParams(String params){
  int commaPosition = params.indexOf(',');
  String influencer = params.substring(commaPosition+1, params.length());

  return influencer;
}


int getClientPinFromParams(String params){
  int index = params.charAt(0) - '0';
  int pin = clientPins[index];

  return pin;
}


int newFollower(String command){
  return 1;
}


int newInfluencer(String command){
  String influencer = getInfluencerFromParams(command);
  int clientPin = getClientPinFromParams(command);

  digitalWrite(discoBall, 1);
  digitalWrite(clientPin, 1);
  delay(5000);
  reset();

  return 1;
}


int newMention(String command){
  String influencer = getInfluencerFromParams(command);
  int clientPin = getClientPinFromParams(command);

  digitalWrite(clientPin, 1);
  delay(5000);
  reset();

  return 1;
}


void setup(){
  pinMode(discoBall, OUTPUT);
  for(int i=0; i<sizeof(clientPins)/sizeof(int); i++){
    pinMode(clientPins[i], OUTPUT);
  }

  // Pass in paramaters in the form of '0,influencer-name', where 0
  // is the pin number associated with the client and influencer-name
  // is the name of the influencer s
  Spark.function("follow", newFollower);
  Spark.function("influencer", newInfluencer);
  Spark.function("influencer-mention", newMention);

  reset();
}


void reset(){
  for(int i=0; i<sizeof(clientPins)/sizeof(int); i++){
    digitalWrite(clientPins[i], 1);
  }

  digitalWrite(discoBall, 1);
  delay(1000);
  digitalWrite(discoBall, 0);

  for(int i=0; i<sizeof(clientPins)/sizeof(int); i++){
    digitalWrite(clientPins[i], 0);
  }
}
