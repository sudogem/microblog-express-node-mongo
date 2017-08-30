(function hydrateConfiguration() {
"use strict";
var xhr = new XMLHttpRequest();
xhr.open("get", "settings.js", window);
xhr.onload = function () {
  var status = xhr.status;
  if (status === 200) {
      if (xhr.responseText) {
        var response = JSON.parse(xhr.responseText);
        window.__env = response;
      }
  } else {
    console.error("messages: Could not load confguration -> ERROR ->", status);
  }
};

xhr.send() )());
