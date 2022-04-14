var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);
  // console.log("method:");
  // console.log(method);//POST或者GET
  // console.log("request.headers:");
  // console.log(request.headers);
  //    if(path==="/"){
  //     console.log("有人访问/了");
  //     response.end("这就是响应内容");
  // }else if(path==="/x"){
  // console.log("有人访问“/x了");
  // response.end("这是/x的响应内容");
  // }

  if (path === "/index.html") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(fs.readFileSync("./public/index.html"));
    response.end();
  } else if (path === "/qq.js") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/javascript;charset=utf-8");
    response.write(fs.readFileSync("./public/qq.js"));
    response.end();
  } else if (path === "/friends.json") {
    response.statusCode = 200;
    response.setHeader("Content-Type", "text/json;charset=utf-8");
    //console.log(request.headers["referer"]);
    response.setHeader("Access-Control-Allow-Origin", "http://frank.com:9999");
    response.write(fs.readFileSync("./public/friends.json"));
    response.end();
  } else if (path === "/friends.js") {
    //请求头的referer是否包含字符串http://frank.com:9999
    if (request.headers["referer"].indexOf("http://frank.com:9999") === 0) {
      response.statusCode = 200;
      console.log(query.callback);
      response.setHeader("Content-Type", "text/javascript;charset=utf-8");
      //可以直接把friends.js的内容传给string，不用去文件里读了，可少写一个文件
      // const string = fs.readFileSync("./public/friends.js").toString();
      const string = `window['{{xxx}}']({{data}})`;
      const data = fs.readFileSync("./public/friends.json").toString();
      //把占位符处的数据{{data}}替换成data,把{{xxx}}替换成query.callback
      const string2 = string
        .replace("{{data}}", data)
        .replace("{{xxx}}", query.callback);
      response.write(string2); //把string2写到响应里
      response.end();
    } else {
      response.statusCode = 404;
      response.end();
    }
  } else {
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html;charset=utf-8");
    response.write(`你访问的页面不存在`);
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
