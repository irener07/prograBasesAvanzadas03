var googleMapsClient = require('@google/maps').createClient({
    Promise: Promise,
    key: 'AIzaSyCAk0jleMKarVVb-RBf6PqqvRVfZS3-Q60'
  });

var resultInfo = {};
var suggestions = {};
var nearByPlaces = [];
exports.autocompleteQuery = async function (queryText){
    var resultSuggestions = await googleMapsClient.placesQueryAutoComplete({input: queryText}).asPromise();
    var predictions = resultSuggestions.json.predictions;
    suggestions.suggestion1 = predictions[0].description;
    suggestions.suggestion2 = predictions[1].description;
    suggestions.suggestion3 = predictions[2].description;
    suggestions.suggestion4 = predictions[3].description;
    suggestions.suggestion5 = predictions[4].description;
    return suggestions;
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

exports.nearbyPlaces = async function(placeLatLng,placeRadius,types){
    nearByPlaces = [];
    var resultNearByPlaces = await googleMapsClient.placesNearby({
        location: placeLatLng,
        radius: placeRadius,
    }).asPromise();
    var results = resultNearByPlaces.json.results;
    for (var i=0;i<results.length;i++){
        var place = {};
        for (var j=0;j<results[i].types.length;j++){
            for (var k=0;k<types.length;k++){
                if(results[i].types[j]==types[k]){
                    
                    var placeDetails = await googleMapsClient.place({placeid: results[i].place_id}).asPromise();
                    place.placeid = placeDetails.json.result.place_id;
                    place.name = placeDetails.json.result.name;
                    place.international_phone_number = placeDetails.json.result.international_phone_number;
                    place.weekday_text = placeDetails.json.result.opening_hours.weekday_text;
                    if (placeDetails.json.result.website!=undefined){
                        place.website = placeDetails.json.result.website;
                    }
                    else{
                        place.website = "N/A";
                    }
                    if (placeDetails.json.result.rating!=undefined){
                        place.rating = placeDetails.json.result.rating;
                    }
                    else{
                        place.rating = "N/A";
                    }
                    try {
                        var placePhoto = placeDetails.json.result.photos[0];
                        var placePhotoDetails = await googleMapsClient.placesPhoto({
                            photoreference: placePhoto.photo_reference,
                            maxwidth: 400,
                            maxheight: 400
                        }).asPromise();
                        place.PhotoUrl = placePhotoDetails.connection.parser.outgoing.res.requestUrl;
                    } catch (error) {
                        place.PhotoUrl = "N/A";
                    }
                    nearByPlaces.push(place);
                }
            }
        }
    }
    for(var l=0;l<nearByPlaces.length;l++){
        for(var n=0;n<nearByPlaces.length;n++){
            if(nearByPlaces[l]!=undefined && nearByPlaces[n]!=undefined && nearByPlaces[n].placeid==nearByPlaces[l].placeid){
                if(n!=l){
                    delete nearByPlaces[n];
                }
            }
        }
    }
    return nearByPlaces;    
};

exports.placeDetailsID = async function(idPlace){
    await exports.placeDetailsById(idPlace);
    return resultInfo;
};

exports.distanceBetween = async function(latLngOrigin,latLngDestination){
    var resultDistance = await googleMapsClient.distanceMatrix({
        origins: latLngOrigin,
        destinations: latLngDestination,
        units: 'metric'
    }).asPromise();
    return resultDistance.json.rows[0].elements[0].distance.text;
}