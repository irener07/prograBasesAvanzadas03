var googleMapsClient = require('@google/maps').createClient({
    Promise: Promise,
    key: 'AIzaSyCAk0jleMKarVVb-RBf6PqqvRVfZS3-Q60'
  });

module.exports = { 
    
    autocompleteQuery: function (queryText){
        var suggestions = new Array();
        googleMapsClient.placesQueryAutoComplete({
        input: queryText
        }, function(err, response) {
            if (!err) {
                var predictions = response.json.predictions;
                for (var i=0; i<predictions.length;i++){
                    suggestions.push(predictions[i].description)
                }
                //return suggestions;
                console.log(suggestions);
            }
        }
        );
    },

    searchPlaceById: function (address){
        googleMapsClient.findPlace({
            input: address,
            inputtype: 'textquery',
        }, function(err, response) {
            if (!err) {
                //return response.json.candidates[0];
                console.log(response.json.candidates[0]);
            }
        }
        );
    },

    placeDetailsById: function (place_id){
        googleMapsClient.place({
            placeid: place_id,
        }, function(err, response) {
            if (!err) {
                console.log(response.json.result);
            }
        }
        );
    },

    placeDetailsByCoordinates: function(LatLng){
        googleMapsClient.reverseGeocode({
            latlng: LatLng
        }, function(err, response) {
            if (!err) {
                console.log(response.json.results);
            }
        }
        );
    }
};