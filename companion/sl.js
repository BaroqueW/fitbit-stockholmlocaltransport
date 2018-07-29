export function SLAPI(apiKey) {

    if (apiKey !== undefined) {
    this.apiKey = apiKey;
  }
  else {
    // key for this app from Trafiklab.se
    this.apiKey = "xxx";
  }
  

};

SLAPI.prototype.realTimeTrips = function(stationA, stationB, stationAName, stationBName) {
  let self = this;
  
  return new Promise(function(resolve, reject) {
	  
	  // See documentation at https://www.trafiklab.se/node/16717/documentation 
    let url = "https://api.sl.se/api2/TravelplannerV3/trip.json?lang=en&searchForArrival=0&key=" + self.apiKey + "&originId=" + stationA + "&destId=" + stationB;
    
    fetch(url,{mode: 'cors', headers : { 
        'Accept': 'application/json',
        'Origin' : 'https://app-settings.fitbitdevelopercontent.com'
       }}).then(function(response) {
   
      return response.json();
    }).then(function(json) {

	
	//Parse the results and add all the founds trips to trips
      let data = json["Trip"];
      
      let trips = [];

     
     data.forEach((trip) => {
       
	 //a trip can have multiple leg, the first origin time and the last destination time for the Legs in the LegList are the overall start/end times
     let startTime = JSON.stringify(trip.LegList.Leg[0].Origin.time);
     let endTime = JSON.stringify(trip.LegList.Leg[trip.LegList.Leg.length -1].Destination.time);
      
      trips.push({"from" : stationAName, "to": stationBName, "start" : startTime, "end" : endTime});

      })
      
      resolve(trips);
    }).catch(function (error) {
      reject(error);
    });
  });
}
