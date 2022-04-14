//封装jsonp()，jsonp只能知道成功或失败拿不到状态码
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const random = "frankJSONCallbackName" + Math.random(); //生成一个随机数
    //定义全局名字
    window[random] = (data) => {
      resolve(data); //拿到数据调用resolve
    };
    const script = document.createElement("script"); //创建script标签
    script.src = `${url}?callback=${random}`; //url是传过来的,优化：jsonp的函数名叫callback
    //监听onload事件，移除script
    script.onload = () => {
      script.remove();
    };
    script.onerror = () => {
      reject(); //出错的时候调用reject
    };
    document.body.appendChild(script); //然后放到body里
  });
}
//使用jsonp
jsonp("http://qq.com:8888/friends.js").then((data) => {
  console.log(data);
});

// // window.xxx = (data) => {
// //   console.log(data);
// // };
// //优化：不把xxx写死
// const random = "frankJSONCallbackName" + Math.random();
// console.log(random);
// window[random] = (data) => {
//   console.log(data);
// };
// //把另外一个网站的数据包到了JS里面，然后JS会把数据送到window.xxx里面，
// //然后我们在onload的时候拿到window.xxx
// const script = document.createElement("script");
// script.src = `http://qq.com:8888/friends.js?functionName=${random}`; //传查询参数
// //优化：每发一个JSONP请求就会多一个script标签，造成页面臃肿，故执行完成后删除script标签
// script.onload = () => {
//   script.remove();
// };
// document.body.appendChild(script);

// //失败的跨域请求
// // console.log("frank");
// // const request = new XMLHttpRequest();
// // request.open("GET", "http://qq.com:8888/friends.json");
// // request.onreadystatechange = () => {
// //   if (request.readyState === 4) {
// //     if (request.status >= 200 && request.status < 300) {
// //       console.log(request.response);
// //     }
// //   }
// // };
// // request.send();
