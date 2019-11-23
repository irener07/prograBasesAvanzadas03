var googleMapsClient = require('@google/maps').createClient({
    Promise: Promise,
    key: 'AIzaSyCAk0jleMKarVVb-RBf6PqqvRVfZS3-Q60'
  });


exports.httpGet =  function (place_id) {
    return new Promise((resolve, reject) => {
        googleMapsClient.place({
            placeid: place_id,
        },  function (err, response) {
            if (!err) {
                var resultInfo = {};
                var result = response.json.result;
                resultInfo.placeid = result.place_id;
                resultInfo.name = result.name;
                resultInfo.formatted_address = result.formatted_address;
                resultInfo.lat = result.geometry.location.lat;
                resultInfo.lng = result.geometry.location.lng;
                resultInfo.international_phone_number = result.international_phone_number;
                resultInfo.weekday_text = result.opening_hours.weekday_text;
                resultInfo.website = result.website;
                //Access Photo
                var photoObj = result.photos[0];
                googleMapsClient.placesPhoto({
                    photoreference: photoObj.photo_reference,
                    maxheight: photoObj.height,
                    maxwidth: photoObj.width
                }, (err, responsePhoto) => {
                    if (!err) {
                        var photoUrl = responsePhoto.connection.parser.outgoing.res.requestUrl;
                        resultInfo.photoUrl = photoUrl;
                        //resolve(resultInfo);
                        return resultInfo;
                        //console.log(resultInfo);
                        
                    }
                });
                
            }
        });
    });
  }

exports.autocompleteQuery = async function (queryText){
        var suggestions = new Array();
        googleMapsClient.placesQueryAutoComplete({
        input: queryText
        }, async function(err, response) {
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
};

exports.placeDetailsById = async function (place_id) {
        googleMapsClient.place({
            placeid: place_id,
        },  async function (err, response) {
            if (!err) {
                var resultInfo = {};
                var result = response.json.result;
                resultInfo.placeid = result.place_id;
                resultInfo.name = result.name;
                resultInfo.formatted_address = result.formatted_address;
                resultInfo.lat = result.geometry.location.lat;
                resultInfo.lng = result.geometry.location.lng;
                resultInfo.international_phone_number = result.international_phone_number;
                resultInfo.weekday_text = result.opening_hours.weekday_text;
                resultInfo.website = result.website;
                //Access Photo
                var photoObj = result.photos[0];
                googleMapsClient.placesPhoto({
                    photoreference: photoObj.photo_reference,
                    maxheight: photoObj.height,
                    maxwidth: photoObj.width
                }, async (err, responsePhoto) => {
                    if (!err) {
                        var photoUrl = await responsePhoto.connection.parser.outgoing.res.requestUrl;
                        resultInfo.photoUrl = await photoUrl;
                        console.log(resultInfo);
                        
                    }
                });
                return resultInfo;
            }
        });
};

exports.searchPlaceByAddress = async function (address,callback){
        googleMapsClient.findPlace({
            input: address,
            inputtype: 'textquery',
        }, async function(err, response) {
            if (!err) {
                const placeId = response.json.candidates[0].place_id;
                console.log(exports.placeDetailsById(placeId));
            }
        }
        );
};


exports.placeDetailsByCoordinates = async function(LatLng){
        googleMapsClient.reverseGeocode({
            latlng: LatLng
        }, async function(err, response) {
            if (!err) {
                var placesFound = response.json.results;
                for(var i=0;i<=placesFound.length;i++){
                    var placeFoundTypes = placesFound[i].types;
                    for(var j=0;j<=placeFoundTypes.length;j++){
                        if(placeFoundTypes[j]=='supermarket'){
                            var foundPlaceId = response.json.results[i].place_id;
                            const place = await exports.placeDetailsById(foundPlaceId);
                            return place;
                        }
                    }
                }
            }
        }
        );
};