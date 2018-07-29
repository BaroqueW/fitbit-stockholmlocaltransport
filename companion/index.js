import { me } from "companion";
import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { SLAPI } from "./sl.js"
import { TRIP_COUNT, FAVORITE_STATION_SETTING, CUTOFF_SETTING } from "../common/globals.js";

settingsStorage.onchange = function(evt) {
  sendSLSchedule();
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  sendSLSchedule();
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log("onmessage: " + JSON.stringify(evt.data));
}

function sendSLSchedule() {
  let station = settingsStorage.getItem(FAVORITE_STATION_SETTING);
  let cutOff = settingsStorage.getItem(CUTOFF_SETTING);
  

  
    if (station) {
    try {
      station = JSON.parse(station);
    }
    catch (e) {
      console.log("error parsing setting value for stations: " + e);
    }
  }
 
  //Processing storage of cutoff hour
  cutOff = cutOff.replace(/[^0-9]/g,'');
  
  //validate station, otherwise use defaults
  //currently will always end up with defaults since the necessary API is not hooked up in the settings page
    if (!station || typeof(station) !== "object" || station.length < 1 || typeof(station[0]) !== "object") {
    station = [{'name': 'Kragstalund', 'value': '9628'}, {'name': 'Medborgarplatsen', 'value' : '1323'}];
  }

  let slAPI = new SLAPI();
  
  var now = new Date();
  
  let startStation = {};
  let endStation = {};

  // If we are before the cutOff hour during the day, we got from A to B, else B to A 
  if(now.getHours() < cutOff) {
    startStation = station[0];
    endStation = station[1];
  }
  else {
    startStation = station[1];
    endStation = station[0];
  }
  
    //get the next trips
    slAPI.realTimeTrips(startStation.value, endStation.value, startStation.name, endStation.name).then(function(trips) {
    
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Limit results to the number of tiles available
      departures.splice(TRIP_COUNT, trips.length);
      messaging.peerSocket.send(trips);
    }
  }).catch(function (e) {
    console.log("SendSLSchedule: error " + e);
  });
}
