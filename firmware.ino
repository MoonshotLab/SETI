int DQ_BUTTON = {D2};
int WS_BUTTON = {D0};
int BB_BUTTON = {D5};
int discoBall = {D4};
int buttonDelay = 3000;


String getInfluencerFromParams(String params){
  int commaPosition = params.indexOf(',');
  String influencer = params.substring(commaPosition+1, params.length());

  return influencer;
}


int newFollower(String command){
  return 1;
}


int newInfluencer(String command){
  String influencer = getInfluencerFromParams(command);

  digitalWrite(discoBall, 1);
  delay(5000);
  digitalWrite(discoBall, 0);

  return 1;
}


int newMention(String command){
  String influencer = getInfluencerFromParams(command);
  return 1;
}


void setup(){
  pinMode(discoBall, OUTPUT);

  pinMode(DQ_BUTTON, INPUT);
  pinMode(WS_BUTTON, INPUT);
  pinMode(BB_BUTTON, INPUT);

  // Pass in paramaters in the form of '0,influencer-name', where 0
  // is the pin number associated with the client and influencer-name
  // is the name of the influencer s
  Spark.function("follow", newFollower);
  Spark.function("influencer", newInfluencer);
  Spark.function("influencer-mention", newMention);

  digitalWrite(discoBall, 1);
  delay(1000);
  digitalWrite(discoBall, 0);
}


void loop(){
  if(digitalRead(DQ_BUTTON)){
    Spark.publish("button-press", "DairyQueen");
    delay(buttonDelay);
  } else if(digitalRead(WS_BUTTON)){
    Spark.publish("button-press", "wingstop");
    delay(buttonDelay);
  } else if(digitalRead(BB_BUTTON)){
    Spark.publish("button-press", "Blue_Bunny");
    delay(buttonDelay);
  }
}
