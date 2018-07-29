import { TRIP_COUNT } from "../common/globals.js";
import document from "document";

export function SLUI() {
  this.tripList = document.getElementById("tripList");
  this.statusText = document.getElementById("status");

  this.tiles = [];
  for (let i = 0; i < TRIP_COUNT; i++) {
    let tile = document.getElementById(`train-${i}`);
    if (tile) {
      this.tiles.push(tile);
    }
  }
}

//Update splash message
SLUI.prototype.updateUI = function(state, trips) {
  if (state === "loaded") {
    this.tripList.style.display = "inline";
    this.statusText.text = "";

    this.updateTripList(trips);
  }
  else {
    this.tripList.style.display = "none";

    if (state === "loading") {
      this.statusText.text = "Loading departures ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App"
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
  }
}

//update list of journeys
SLUI.prototype.updateTripList = function(trips) {
  for (let i = 0; i < TRIP_COUNT; i++) {
    let tile = this.tiles[i];
    if (!tile) {
      continue;
    }

    const trip = trips[i];
    if (!trip) {
      tile.style.display = "none";
      continue;
    }

	
	//Displays the first letter of the departure station -> destination, followed by the start and end time for the journey (HH:mm).
    tile.style.display = "inline";

    tile.getElementById("destination").text = trip.from.slice(0,1) + "->" + trip.to;
 
    tile.getElementById("start").text = trip.start.slice(1,-4);
    tile.getElementById("end").text = trip.end.slice(1,-4);
  }
}
