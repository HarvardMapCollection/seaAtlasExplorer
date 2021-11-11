export function createCookie(name, value, days) {
    // creates a cookie that with the given name, value, and days until expiration.
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
};

export function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export function eraseCookie(name) {
    createCookie(name, "", -1);
};

export function getURLParameter(name) {
    var get_regex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
    return decodeURIComponent((get_regex.exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

export function isInArray(value, array) {
	return array.indexOf(value) > -1;
};
