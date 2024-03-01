/*
 Basic ESP8266 MQTT example

 This sketch demonstrates the capabilities of the pubsub library in combination
 with the ESP8266 board/library.

 It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

 It will reconnect to the server if the connection is lost using a blocking
 reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
 achieve the same result without blocking the main loop.

 To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"
#include <ArduinoJson.h>

// MQTT_MAX_PACKET_SIZE = 128;

// Update these with values suitable for your network.
const char* ssid = "saaeed"; // wifi ssid name
const char* password = "*******"; // wifi password 
const char* mqtt_server = "192.168.1.50"; // MQTT broker Name // we are using hivemq public broker. mqtt://test.mosquitto.org

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht;
JsonDocument doc;

#define PUBLISH_INTERVAL 300000 // 5 min     //1200000 // 20 min
unsigned long msecLast = 0;

int soilMoistureValue = 0;
float humidity = 0.0;
float temperature = 0.0;
// const int dry = 380; // value for dry sensor
// const int wet = 277; // value for wet sensor

void setup_wifi() {
  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  //  if ((char)payload[0] == 'o' && (char)payload[1]== 'n') { // Here we are comparing if ON command is coming from server. 

  // if ((char)payload[0] == '1') { // Here we are comparing if ON command is coming from server. 
  //   digitalWrite(2, HIGH); //2==>D4
   
  // } else {
  //   digitalWrite(2, LOW); // else turn off led   
  // }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    // if (client.connect(clientId.c_str() ,"niki" , "niki"))
    if (client.connect(clientId.c_str() ))  { //connection ID , username , password
      Serial.println("connected");
       digitalWrite(BUILTIN_LED, LOW);
      // client.subscribe("niki/switch"); //  topic Name
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void publishSensorData(){
    delay(dht.getMinimumSamplingPeriod()); /* Delay of amount equal to sampling period */
    humidity = dht.getHumidity();/* Get humidity value */
    temperature = dht.getTemperature();/* Get temperature value */
    soilMoistureValue = analogRead(0);
    // Serial.print(dht.getStatusString());/* Print status of communication */
    // Serial.print("\t");
    // Serial.print(humidity, 1);
    // Serial.print("\t\t");
    // Serial.print(temperature, 1);
    // Serial.print("\t\t ");

    // int percentageSoilMoisture = map(soilMoistureValue, wet, dry, 100, 0);
    // Serial.print(soilMoistureValue);
    // Serial.println();
    // Serial.println("Status\tHumidity (%)\tTemperature (C)\t SoilMoisture(%)");
    doc["humidity"] = humidity;
    doc["temprature"] = temperature;
    doc["moisture"] = soilMoistureValue;
    char payload[128];
    serializeJson(doc, payload);
    Serial.println(payload);
    client.publish("metric", payload);
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // on board led for mqtt status indication.
  // pinMode(2, OUTPUT); // our led is connected to D4
  Serial.begin(115200);

  dht.setup(D1); 	/* D1 is used for data communication */

  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  digitalWrite(BUILTIN_LED, HIGH);
}

void loop() {
  
  if (!client.connected()) {
     digitalWrite(BUILTIN_LED, HIGH);
    reconnect();
  }
  
  unsigned long msec = millis();
  if(msec - msecLast > PUBLISH_INTERVAL && client.connected()){
    msecLast = msec;
    publishSensorData();
  }

  client.loop();
}