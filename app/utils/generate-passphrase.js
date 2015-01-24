/*
 * generates a passphrase
 * 
 * uses window.crypto.getRandomValues() if it's supported by current browsers
 * otherwise uses a fallback to Math.floor() which is not cryptographically strong
 * 
 * implementation by Aaron Toponce:
 *   https://pthree.org/2014/06/25/cryptographically-secure-passphrases-in-d-note/
 */
export default function(length){
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var random_array = new Uint32Array(length);

    // Make some attempt at preferring a strong CSPRNG first
    if (window.crypto && window.crypto.getRandomValues) {
        // Desktop Chrome 11.0, Firefox 21.0, Opera 15.0, Safari 3.1
        // Mobile Chrome 23, Firefox 21.0, iOS 6
        window.crypto.getRandomValues(random_array);
    }
    else if (window.msCrypto && window.msCrypto.getRandomValues) {
        // IE 11
        window.msCrypto.getRandomValues(random_array);
    }
    else {
        // Android browser, IE Mobile, Opera Mobile, older desktop browsers
        for(var i=length; i--;) {
            random_array[i] = Math.floor(Math.random() * Math.pow(2, 32));
        }
    }

    for(var j=length; j--;) {
        text += possible.charAt(Math.floor(random_array[j] % possible.length));
    }

    return text;
}