function encrypt(element){
    var wordEncrypt = btoa(element);
    return wordEncrypt;
}

function decrypt(element){
	var wordDecrypt = atob(element);
	return wordDecrypt;
}