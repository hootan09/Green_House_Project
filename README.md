# Green House Project 💐
**Retrieve temperature, humidity, and soil moisture data from the Nodemcu (V1.0) and transmit it to a Raspberry Pi 3 Node.js server using a pub/sub broker**

- Note: Due to the use of a pub/sub broker, we are also able to send control commands to the hardware board, such as turning on/off relays and sensors.

## Server API :
**This is a CRUD API, using mqtt.js to subscribe to metrics topics from a Raspberry Pi 3 broker and save logs to the database through Prisma ORM.**
```sh
# Using pm2 for serving nodejs back-end api
# get sensors logs (CRUD)
http://<server-address:3000>/metrics
# download whole DataBase (sqlite3)
http://<server-address:3000>/downloaddb
```

## Raspberry-pi3 Config :
```sh
# set eth0 static ip
$ sudo nano /etc/dhcpcd.conf
# open & enable on startup sshd service
$ sudo systemctl enable sshd
$ sudo systemctl start sshd
#install mosquitto
$ sudo apt update && sudo apt install -y mosquitto mosquitto-clients
# install nodejs
$ sudo curl https://deb.nodesource.com/setup_20.x | sudo bash -
$ sudo apt-get install nodejs -y
```
#### Config Mosquitto :
```sh
#/etc/mosquitto/mosquitto.conf
# Add this two line at the end of file
    listener 1883
    allow_anonymous true
$ sudo systemctl restart mosquitto 
```
#### Run Node Server :
```sh
$ npm i -g pm2
$ cd <api_server_folder> && npm i
$ pm2 start app
```

## Hardware :
```sh
# set your wifi name and password and raspberry-pi addres to 'greenHouse_Sensors.ino' file then upload it to nodemcu through arduino IDE
const char* ssid = "WIFI_SSID"; # wifi ssid name
const char* password = "*********"; # wifi password 
const char* mqtt_server = "192.168.1.50"; # MQTT broker Name

```
<p align="center">
<!-- <img src="./needed/NodeMCU_DHT11_Interfacing.webp?raw=true" alt="result" style="width:50%;"/> -->
<img src="./needed/arduino.png?raw=true" alt="result" style="width:50%;"/>
<img src="./needed/sensors.png?raw=true" alt="result" style="width:50%;"/>
</p>

## Mobile Application (Expo - React-Native) :
<p align="center">
<img src="./needed/app.jpg?raw=true" alt="result" style="width:30%;"/>
</p>