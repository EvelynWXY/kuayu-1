const request = new XMLHttpRequest();
request.open("GET", "/friends.json");
request.onreadystatechange = () => {
  if (request.readyState === 4) {
    if (request.status >= 200 && request.status < 300) {
      console.log(request.response);
    }
  }
};
request.send();
