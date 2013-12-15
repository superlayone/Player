# Project #

**H.264视频流的web播放器**

# 特点 #

- 接收遵循H.264协议的流

- HTML嵌入

- Javascript wrapper

- 基于HTML5解码，不引入额外的插件

- 灵活调用

# 依赖项 #

> 本播放器基于HTML5技术构建，所以需要您的浏览器支持HTML5解析

> 建议您使用IE9及其以上浏览器，或者使用Google Chrome等对HTML5有着良好支持的浏览器


# HTML嵌入 #

> 你需要在HTML的head标签里面嵌入对video-js.css的引用
	
	<!--video css-->
    <link href="video/video-js.css" rel="stylesheet">
>为了更加快速的加载页面内容，我们建议将js的引用放置在文档底部

	<!--For jquery -->
    <script src="js/jquery.min.js" charset="UTF-8"></script>
	<!--For video core js-->
    <script src="video/video.js"></script>
    <!--For video player core logical control -->
    <script src="js/core.js"></script>

> 然后你需要在body标签内放置一个容器，并有一个id标示，如下：

	<div class="playerbody center-block">
            <video id="vjsplayer" class="video-js vjs-default-skin vjs-big-play-centered" onended="core.playEnded()"
              controls preload="auto" width="800" height="400"
              data-setup='{ "controls": true, "autoplay": false, "preload": "auto" }'>
             <source src="" type='video/mp4' />
            </video>
    </div>
>然后你需要做一些初始化工作，即ready函数：

	<!--For document ready-->
    <script type="text/javascript">
        //Initially,it's empty
        var playlist = null;
        $(document).ready(function(){
          //initial something...
          core.getPlayerId("vjsplayer");
      });
    </script>

# API 方法#
## play() ##



- 参数表——()

	> xxxxx

- 调用方法
	
    	var placeholder = placeholderhere;

