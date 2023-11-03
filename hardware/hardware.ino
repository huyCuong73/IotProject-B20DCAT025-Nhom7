#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define SSID "free" 
#define PASSWORD "12345679" 
#define MQTT_SERVER "192.168.35.48"
#define MQTT_PORT 1883 

#define DHTPIN D1 
#define LEDPIN D2 
#define FANPIN D0 
#define DHTTYPE DHT11 
#define LDRPIN A0 

#define PUBLISH_INTERVAL 4000 

WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastPublishTime = 0;
int LEDState = LOW;
int FANState = LOW;
int previousLEDState = LOW;
int previousFANState = LOW;
String deviceState = "off";


void setup() {
  Serial.begin(115200);
  
  dht.begin();
  pinMode(LDRPIN, INPUT);
  pinMode(LEDPIN, OUTPUT);
  pinMode(FANPIN, OUTPUT);
  randomSeed(analogRead(0));
  setup_wifi();
  setup_mqtt();
}

void setup_wifi() {
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("WiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
}

void setup_mqtt() {
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(callback);
}

void callback(char *topic, byte *payload, unsigned int length) {
  if (strcmp(topic, "action_button") == 0) {
    String s = "";
    for (int i = 0; i < length; i++)
      s += (char)payload[i];
    action_button(String(s));
  }
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (mqttClient.connect("esp8266")) {
      Serial.println("connected");
      mqttClient.subscribe("action_button");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void action_button(String s) {
  
  String device = "";

  if (s.equalsIgnoreCase("onLED")) {
    LEDState = HIGH;
    deviceState = "on";
    device = "led";
  } else if (s.equalsIgnoreCase("offLED")) {
    LEDState = LOW;
    deviceState = "off";
    device = "led";
  } else if (s.equalsIgnoreCase("onFAN")) {
    FANState = HIGH;
    deviceState = "on";
    device = "fan";
  } else if (s.equalsIgnoreCase("offFAN")) {
    FANState = LOW;
    deviceState = "off";
    device = "fan";
  } else {
    return;
  }


  digitalWrite(LEDPIN, LEDState);
  digitalWrite(FANPIN, FANState);
  String status = "device:" + device + ",status:" + deviceState;
  mqttClient.publish("devices_status", status.c_str());
  
}

void publish_data() {
  String deviceState = "";


  float temp = dht.readTemperature();
  float humi = dht.readHumidity();
  int light = analogRead(LDRPIN);
  long gas = random(60, 80);

  String data = "humidity:" + String(humi) + ",temperature:" + String(temp) + ",light:" + String(light) + ",gas:" + String(gas);
  Serial.println(data);
  mqttClient.publish("sensor_data", data.c_str());


  if(gas >= 70){

    deviceState = "on";
    String deviceData = "fan:1,led:1";
    Serial.println(deviceData);
    mqttClient.publish("device_auto", deviceData.c_str());
    device_loop();
  } else {


    digitalWrite(LEDPIN, LEDState);
    digitalWrite(FANPIN, FANState);

    deviceState = "off";
    String deviceData = "fan:" + String(FANState) + ",led:" + String(LEDState);
    Serial.println(deviceData);
    mqttClient.publish("device_auto", deviceData.c_str());
  }

  

}

void device_loop() {

  int currentLEDState = LOW;
  int currentFANState = LOW;
  
  for(int i = 0; i<40; i++){

    currentLEDState = !currentLEDState;
    currentFANState = !currentFANState;

    digitalWrite(LEDPIN, currentLEDState);
    digitalWrite(FANPIN, currentFANState);

    delay(100);
  }
  digitalWrite(LEDPIN, previousLEDState);
  digitalWrite(FANPIN, previousLEDState);
}


void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - lastPublishTime >= PUBLISH_INTERVAL) {
    lastPublishTime = currentMillis;
    publish_data();
  }
}

