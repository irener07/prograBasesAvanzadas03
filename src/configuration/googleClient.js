var googleMapsClient = require('@google/maps').createClient({
    Promise: Promise,
    key: 'AIzaSyCAk0jleMKarVVb-RBf6PqqvRVfZS3-Q60'
  }); //Variable for accessing the Google Maps API services

var resultInfo = {}; //Variable where the results for detailed information of a site is stored
var nearByPlaces = []; //Variable where the results for places near by a supermarket is stored

/*
placeDetailsById is a function to retrieve information of a site using the Google Places API,
the main purpose of this function is to obtain information for supermarkets, although the function
is developed for all kind of sites, validation must be done within the caller function.
Inputs:
    placeid: a String represting the site id given by the Google API services
Outputs:
    void: the function only assign the retrieved information to a variable called resultInfo, used
    by other functions.
Constraints: the function can only recieve valids ids of places, according to the format of Google
Places API format
*/
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

/*
searchPlaceByAdress is a function to retrieve information of a site using the Google Places API,
the main purpose of this function is to obtain information for supermarkets.
Inputs:
    adress: a String represting the site address given by the Google API services
Outputs:
    resultInfo(Promise): JavaScript object with the follow properties:
        placeid (String): id given to the place by Google
        name (String): name of the site
        formatted_address (String): exact address of the place
        lat (Float): Coordinates in latitude
        lng (Float): Coordinates in longitude
        international_phone_number (String): Phone number of the place, with the international format
        weekday_text (String Array): Schedule of opening hours of the place
        website (String): Url of the place web site
        typeSupermarket (String Array): Type labels given to the place by Google
        rating (Number): Rating of the place given by the supermarket
        PhotoUrl (String): Url of the place photo
    void: in case the input given is not valid
Constraints: the function can only recieve a String of a place address, according to the format of Google
Places API format
*/
exports.searchPlaceByAddress = async function (address){
    var resultIdPlaceSearch = await googleMapsClient.findPlace({input:address,inputtype:'textquery'}).asPromise();
    const placeId = resultIdPlaceSearch.json.candidates[0].place_id;
    await exports.placeDetailsById(placeId);
    return resultInfo;
};

/*
placeDetailsByCoordinates is a function to retrieve information of a site using the Google Places API
and Reverse Geocode, the main purpose of this function is to obtain information for supermarkets.
Inputs:
    LatLng: a Float Array represting the site coordinates in the following order: [latitude,longitude]
Outputs:
    resultInfo(Promise): JavaScript object with the follow properties:
        placeid (String): id given to the place by Google
        name (String): name of the site
        formatted_address (String): exact address of the place
        lat (Float): Coordinates in latitude
        lng (Float): Coordinates in longitude
        international_phone_number (String): Phone number of the place, with the international format
        weekday_text (String Array): Schedule of opening hours of the place
        website (String): Url of the place web site
        typeSupermarket (String Array): Type labels given to the place by Google
        rating (Number): Rating of the place given by the supermarket
        PhotoUrl (String): Url of the place photo
    void: in case the input given is not valid
Constraints: the function can only recieve a Float Array of a place coordinates, according to the format of Google
Places API format
*/
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

/*
nearbyPlaces is a function to retrieve information of places close to a supermarket using the Google Places API
and Reverse Geocode.
Inputs:
    placeLatLng: a Number Array represting the site coordinates in the following order: [latitude,longitude]
    placeRadius: a Number containing the maximum distance between the places found and the supermarket
    types: a String Array containing the types of places to be searched
Outputs:
    nearByPlaces (Array): Contains all the information of the places found as objects following the given
    properties:
        placeid (String): id given to the place by Google
        name (String): name of the site
        international_phone_number (String): Phone number of the place, with the international format
        weekday_text (String Array): Schedule of opening hours of the place
        website (String): Url of the place web site
        rating (Number): Rating of the place given by the supermarket
        PhotoUrl (String): Url of the place photo
    void: in case the input given is not valid
Constraints: the function can only recieve one set of coordinates of a given supermarket,
according to the format of Google Places API format
*/
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
                    if (placeDetails.json.result.opening_hours.weekday_text!=undefined){
                        place.weekday_text = placeDetails.json.result.opening_hours.weekday_text;
                    }
                    else{
                        place.weekday_text = "N/A";
                    }
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

/*
placeDetailsId is a function to retrieve information of a site using the Google Places API,
the main purpose of this function is to obtain information for supermarkets, although the function
is developed for all kind of sites, validation must be done within the caller function.
Inputs:
    placeid: a String represting the site id given by the Google API services
Outputs:
    resultInfo(Promise): JavaScript object with the follow properties:
        placeid (String): id given to the place by Google
        name (String): name of the site
        formatted_address (String): exact address of the place
        lat (Float): Coordinates in latitude
        lng (Float): Coordinates in longitude
        international_phone_number (String): Phone number of the place, with the international format
        weekday_text (String Array): Schedule of opening hours of the place
        website (String): Url of the place web site
        typeSupermarket (String Array): Type labels given to the place by Google
        rating (Number): Rating of the place given by the supermarket
        PhotoUrl (String): Url of the place photo
    void: In case the Input given is not valid
Constraints: the function can only recieve valids ids of places, according to the format of Google
Places API format
*/
exports.placeDetailsID = async function(idPlace){
    await exports.placeDetailsById(idPlace);
    return resultInfo;
};

/*
distanceBetween is a functions to retrieve the distance between two places using the Google Distance Matrix
API, the main purpose of this function is to retrieve the distance between nearby places of a given supermarket
Inputs:
    latLngOriding (Float Array): Indicates the coordinates of the supermarket, following the format of 
    Google Maps APIs.
    latLngDestination (Float Array): Indicates the coordinates of the nearby place, following the format of
    Google Maps APIs.
Outputs:
    text (String): respresent the distance between the two places, given by metric units
Contraints: both function parameters can only recieve one set of coordinates for places
*/
exports.distanceBetween = async function(latLngOrigin,latLngDestination){
    var resultDistance = await googleMapsClient.distanceMatrix({
        origins: latLngOrigin,
        destinations: latLngDestination,
        units: 'metric'
    }).asPromise();
    return resultDistance.json.rows[0].elements[0].distance.text;
}