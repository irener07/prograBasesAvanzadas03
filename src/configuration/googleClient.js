var googleMapsClient = require('@google/maps').createClient({
    Promise: Promise,
    key: 'AIzaSyCAk0jleMKarVVb-RBf6PqqvRVfZS3-Q60'
  });

var resultInfo = {};    
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
    var resultPlaceDetails = await googleMapsClient.place({placeid: place_id}).asPromise();
    resultInfo.placeid = resultPlaceDetails.json.result.place_id;
    resultInfo.name = resultPlaceDetails.json.result.name;
    resultInfo.formatted_address = resultPlaceDetails.json.result.formatted_address;
    resultInfo.lat = resultPlaceDetails.json.result.geometry.location.lat;
    resultInfo.lng = resultPlaceDetails.json.result.geometry.location.lng;
    resultInfo.international_phone_number = resultPlaceDetails.json.result.international_phone_number;
    resultInfo.weekday_text = resultPlaceDetails.json.result.opening_hours.weekday_text;
    resultInfo.website = resultPlaceDetails.json.result.website;
    resultInfo.typeSupermarket = resultPlaceDetails.json.result.types;
    resultInfo.rating = resultPlaceDetails.json.result.rating;
    var resultPhoto = resultPlaceDetails.json.result.photos[0];
    var resultPhotoDetails = await googleMapsClient.placesPhoto({
        photoreference: resultPhoto.photo_reference,
        maxwidth: 400,
        maxheight: 400
    }).asPromise();
    resultInfo.PhotoUrl = resultPhotoDetails.connection.parser.outgoing.res.requestUrl;
};

exports.searchPlaceByAddress = async function (address){
    var resultIdPlaceSearch = await googleMapsClient.findPlace({input:address,inputtype:'textquery'}).asPromise();
    const placeId = resultIdPlaceSearch.json.candidates[0].place_id;
    await exports.placeDetailsById(placeId);
    return resultInfo;
};


exports.placeDetailsByCoordinates = async function(LatLng){
    var reverseGeocoding = await googleMapsClient.reverseGeocode({latlng: LatLng}).asPromise();
    var placesFound = reverseGeocoding.json.results;
    for(var i=0;i<=placesFound.length;i++){
        var placeFoundTypes = placesFound[i].types;
        for(var j=0;j<=placeFoundTypes.length;j++){
            if(placeFoundTypes[j]=='supermarket'){
                var foundPlaceId = reverseGeocoding.json.results[i].place_id;
                await exports.placeDetailsById(foundPlaceId);
                return resultInfo;
            }
        }
    }
};

exports.placeDetailsID = async function(id){
    await exports.placeDetailsById(id);
    return resultInfo;
};