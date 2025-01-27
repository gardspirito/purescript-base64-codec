// Uses heavily code from https://github.com/dchest/tweetnacl-util-js which exists in the public domain
// Modifications have been made where appropriate to the purescript FFI platform

function validateBase64(s) {
  if (!(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s))) {
    throw new TypeError('invalid encoding');
  }
}

export function encodeBase64Impl(buffer) {
  if (typeof btoa === 'undefined') {
    // Node
    return Buffer.from(buffer).toString('base64');
  } else {
    // Browser
    const reducer = function (a, n) {
      return a.concat([String.fromCharCode(n)]);
    };
    const arr = new Array();
    const wrapped = new Uint8Array(buffer);
    return btoa(wrapped.reduce(reducer, arr).join(''));
  }
};

export function decodeBase64Impl(just, nothing, str) {
  try {
    validateBase64(str);
    if (typeof atob === 'undefined') {
      arrayRepresentation = new Uint8Array(Array.prototype.slice.call(Buffer.from(str, 'base64'), 0));
      return just(arrayRepresentation.buffer);
    } else {
      // Browser
      var i = 0;
      const byteString = atob(str);
      var ns = new Uint8Array(byteString.length);
      for (i = 0; i < ns.length; i++) {
        ns[i] = byteString.charCodeAt(i);
      }
      return just(ns.buffer);
    }
  } catch (e) {
    return nothing;
  }
};

export function fromStringImpl(just, nothing, str) {
  try {
    validateBase64(str);
    return just(str);
  } catch (e) {
    return nothing;
  }
}
