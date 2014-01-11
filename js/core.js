/*core js*/
/*
<Author> = Layone
2013.12

Copyright (c) 2013, Layone
All rights reserved.

This software is written by Layone!
(A) No Trademark License.This license does not grant you rights to use any contributors' name, logo, or trademarks.
(B) If you bring a patent claim against any contributor over patents that you claim are infringed by the software, your patent license from such contributor to the software ends automatically.
(C) If you distribute any portion of the software, you must retain all copyrights that are present in the software.
(D) If you distribute any portion of the software in source code form, you may do so only under this license by including a complete copy of this license with your distribution. If you distribute any portion of the software in compiled or object code form, you may only do so under a license that complies with this license.
(E) Layone hold the master version.

*/
/*
Disclaimer
*/
/*
If you don't like displaying the status information,
just remove the sentences as below:
			//change status
			this.statusImg.src = "img/xxx.gif(png/jpg)";
			this.statusStr.innerHTML = "Status string";
or these:
			//change status
			core.statusImg.src = "img/xxx.gif(png/jpg)";
			core.statusStr.innerHTML = "Status string";		
in the following javascript sentences.
And do not pass parameters to getStatusId("statusImg","statusStr") in HTML.
*/
var core = {
	playerId:""
	,playlist:[]
	,downloadlist:[]
	,deviceList:[]
	,playListview:""
	,currentIndex:0
	,currentPlaying:""
	,paginatorId:""
	,totalPages:1
	,currentPage:1
	,playerInstance:""
	,statusImg:""
	,statusStr:""
	,startYYYYMMDDHHIIId:""
	,startSecId:""
	,endYYYYMMDDHHIIId:""
	,endSecId:""
	,deviceId:""
	,jumpMinId:""
	,jumpSecId:""
	,requestedStartTimeStr:""
	,requestedEndTimeStr:""
	,requestedDeviceStr:""
	//When deployed in server,set to empty
	,serverAddress:"219.245.64.108"
	,downloadStatus:"None"
	,downloadId:""
	,playerStatus:""
	,test:0
	//when track ended to fire up
	,playEnded:function() {
		/*
		//choose another track
		//Not the last one
		if(this.playlist.length>1){
			var urlToPlay = this.playlist[0];
			this.playerInstance.src(urlToPlay);
			this.playerInstance.play();
			//update status
			this.statusImg.src = "img/play.gif";
			this.statusStr.innerHTML = "正在播放...";
			this.playlist.shift();
		}else if(this.playlist.length == 1){
			//last one ,calculate the end timestamp and start a timedCount task
			var fileTimeStr = this.getResponseFilenameFromUrl(this.playlist[0]);

			var endAt = this.timeDiff(fileTimeStr,this.requestedEndTimeStr);
			var urlToPlay = this.playlist[0];
			this.playerInstance.src(urlToPlay);
			this.playerInstance.play();
			//start a timedCount task
			timedCount(endAt);
			this.statusImg.src = "img/play.gif";
			this.statusStr.innerHTML = "正在播放...";
			this.playlist.shift();
		}else{
			this.statusImg.src = "img/pause.png";
			this.statusStr.innerHTML = "已结束...";
		}
		//choose another track end
		*/
		/*
		If true ,automatically switch to next track
		*/
		if(this.currentIndex < this.playlist.length-1){
			this.currentIndex++;
			this.playerInstance.src(this.playlist[this.currentIndex]);
			this.playerInstance.play();
		}else{
			/*
			else,stop it!
			*/
			this.playerInstance.currentTime(0);
			this.playerInstance.pause();
		}
	}
	,quickSwitch:function (startAt) {
		var t = setTimeout("quickStartTrack("+startAt+")",500);
	}
	,playPaused:function () {
		this.statusImg.src = "img/pause.png";
		this.statusStr.innerHTML = "已暂停...";
		this.playerStatus = "paused";
	}
	,playWaiting:function () {
		this.statusImg.src = "img/pause.png";
		this.statusStr.innerHTML = "等待中...";
		this.playerStatus = "waiting";
	}
	,playPlaying:function () {
		this.statusImg.src = "img/play.gif";
		this.playerStatus = "playing";
		displayTrueTimeStr();
	}
	//inititally get the playerId
	,getPlayerId:function (replacePlayerId) {
		// body...
		this.playerId = replacePlayerId;
		this.playerInstance = videojs(replacePlayerId);	
	}
	//inititally get the StatusId
	,getStatusId:function (statusImgId,statusStrId) {
		this.statusImg = document.getElementById(statusImgId);
		this.statusStr = document.getElementById(statusStrId);
	}
	//inititally get the DateTimepickerId
	,getDateTimepickerId:function (startYYYYMMDDHHIIId,startSecId,endYYYYMMDDHHIIId,endSecId) {
		this.startYYYYMMDDHHIIId = startYYYYMMDDHHIIId;
		this.startSecId = startSecId;
		this.endYYYYMMDDHHIIId = endYYYYMMDDHHIIId;
		this.endSecId = endSecId;
	}
	//inititally get the device id
	,getDeviceId:function (deviceId) {
		this.deviceId = deviceId;
	}
	,getPlaylistviewId:function (playlistviewId) {
		this.playlistviewId = playlistviewId;
	}
	,getPaginatorId:function (paginatorId) {
		this.paginatorId = paginatorId;
	}
	,getJumpId:function (jumpMinId , jumpSecId) {
		this.jumpMinId = jumpMinId;
		this.jumpSecId = jumpSecId;
	}
	//Use RegEx to split filename
	,getResponseFilenameFromUrl:function (url) {
		var matched=url.match(/\/([\w]*)\.mp4/i);
 		return matched[1];
	}
	//Use RegEx to check if a url
	,checkIfUrl:function (url) {
		var strRegex = "^((https|http)?://)" ;
		var re=new RegExp(strRegex); 
		if(re.test(url)){
			return true;
		}else{
			return false;
		}
	}
	,invokePlayAction:function () {
		ajaxRequest();
	}
	,queryList:function() {
		//console.info(id);
		ajaxRequest();
		window.scrollTo(0,0);
	}
	,getPage:function (page) {
		var listviewStr="";
		if(parseInt(page) < this.totalPages){
			for( i = 0 ; i < 10 ; i++){
				listviewStr += this.generateRowCell(this.playlist[(page-1)*10+i],(page-1)*10+i);
			}
		}else{
			for(i = 0 ; i < this.playlist.length-(page-1)*10 ; i++){
				listviewStr += this.generateRowCell(this.playlist[(page-1)*10+i],(page-1)*10+i);
			}
		}
		document.getElementById(core.playlistviewId).innerHTML = listviewStr;
	}
	,generateRowCell:function (url,id) {
		var filename = this.getResponseFilenameFromUrl(url);
		var listStr = this.formatStr(filename);
		var rowStr = '<tr id="'+id+'"><td>'+listStr+'</td> \
				<td width="70" align="right"> \
				<button type="button" class="btn btn-success btn-xs" onclick="core.downloadFromList(this.parentElement.parentElement.id)">下载</button> \
				</td> \
				<td width="50" align="right"> \
				<button type="button" class="btn btn-primary btn-xs" onclick="core.playFromList(this.parentElement.parentElement.id)">播放</button> \
				</td></tr>';
		return rowStr;
	}
	,generateListOptions:function (value) {
		var optionStr = '<option>'+value+'</option>';
		return optionStr;
	}
	,formatStr:function (filename) {
		var YYYY = filename.substring(0,4)+"-";
		var MM = filename.substring(4,6)+"-";
		var DD = filename.substring(6,8)+" ";
		var HH = filename.substring(8,10)+":";
		var II = filename.substring(10,12)+":";
		var SS = filename.substring(12,14);
		return YYYY+MM+DD+HH+II+SS;
	}
	,displayTimeStr:function (filename , seconds) {
		var YYYY = filename.substring(0,4)+"-";
		var MM = filename.substring(4,6)+"-";
		var DD = filename.substring(6,8)+" ";
		var HH = filename.substring(8,10)+":";
		var IIInt = parseInt(filename.substring(10,12))+parseInt(parseInt(seconds)/60);
		var II;
		if(IIInt<10){
			II = "0"+IIInt+":";
		}else{
			II = IIInt+":";
		}
		var SSInt = parseInt(filename.substring(12,14))+parseInt(parseInt(seconds)%60);
		var SS;
		if(SSInt<10){
			SS = "0"+SSInt;
		}else{
			SS = SSInt;
		}
		return YYYY+MM+DD+HH+II+SS;
	}
	//as it shows,it just play
	,doPlay:function (){
		//get the header & split the filename
		var fileTimeStr = this.getResponseFilenameFromUrl(this.playlist[0]);

		if(this.playlist.length>1){
			var startAt = this.timeDiff(fileTimeStr,this.requestedStartTimeStr);
			//get first url
			var urlToPlay = this.playlist[0];
			//play this url
			this.playerInstance.src(urlToPlay);
			//begin ready
			this.playerInstance.play();
			//quick switch to requested start point
			this.quickSwitch(startAt);
			//remove head
			this.playlist.shift();
		}else if(this.playlist.length == 1){
			//only one track to play

			var startAt = this.timeDiff(fileTimeStr,this.requestedStartTimeStr);
			var endAt =  this.timeDiff(fileTimeStr,this.requestedEndTimeStr);
			//start playing
			var urlToPlay = this.playlist[0];
			this.playerInstance.src(urlToPlay);
			this.playerInstance.play();
			this.quickSwitch(startAt);
			timedCount(endAt);
			this.playlist.shift();
		}
	}
	,playFromList:function (id) {
		this.playerInstance.src(this.playlist[id]);
		//console.info(this.playlist[id]);
		this.playerInstance.play();
		this.currentIndex = id; 
	}
	,downloadFromList:function (id) {
		window.location = core.downloadlist[id];
	}
	,doDownload:function () {
		ajaxDownload();
	}
	,jumpTo:function () {
		var inputMin = $('#'+this.jumpMinId).val();
		var inputSec = $('#'+this.jumpSecId).val()
		if(inputMin != "" && inputSec != ""){
			if(inputMin >= 0 && inputMin <= 59){
				if(inputSec >= 0 && inputSec <= 59){
					var jumpBySeconds = parseInt(inputMin)*60 + parseInt(inputSec);
					if(jumpBySeconds < this.playerInstance.duration()){
						console.info(this.playerInstance.duration());
						this.playerInstance.currentTime(jumpBySeconds);
					}else{
						alert("输入的跳转到时间超过媒体长度！");
					}
				}else{
					alert("请输入合法的跳转到时间！");
				}
			}else{
				alert("请输入合法的跳转到时间！");
			}
		}else{
			alert("请输入需要跳转到的时间点！");
		}
	}
	//get selected date info
	,getDatetimepickerStr:function (startYYYYMMDDHHIIId,startSecId,endYYYYMMDDHHIIId,endSecId) {
		var receivedStartYYYYMMDDHHII = this.getStartYYYYMMDDHHII(startYYYYMMDDHHIIId);
		var receivedEndYYYYMMDDHHII = this.getEndYYYYMMDDHHII(endYYYYMMDDHHIIId);
		
		if(receivedStartYYYYMMDDHHII !='0' && receivedEndYYYYMMDDHHII !='0'){
			var receivedStartDateStr = receivedStartYYYYMMDDHHII+this.getStartSec(startSecId);
			var receivedEndDateStr = receivedEndYYYYMMDDHHII+this.getEndSec(endSecId);
			//alert(receivedStartDateStr+"-->"+receivedEndDateStr);
			if(receivedStartDateStr < receivedEndDateStr){
				//The end time stamp must gteater than the start one
				this.requestedStartTimeStr = receivedStartDateStr;
				this.requestedEndTimeStr = receivedEndDateStr;
				return 1;
			}else{
				alert("请输入合法的日期区间！");
				return 0;
			}
		}else{
			alert("请输入合法的日期区间！");
			return 0;
		}
		
	}
	,getStartYYYYMMDDHHII:function (replaceStartYYYYMMDDHHIIId) {
		if($('#'+replaceStartYYYYMMDDHHIIId).val() == ""){
			alert("请选择起始日期!");
			return '0';
		}
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/; 
		var r = $('#'+replaceStartYYYYMMDDHHIIId).val().match(reg); 
		if(r==null){
			alert("日期时间不匹配!");
			return '0'; 
		}
		var d= new Date(r[1], r[3]-1,r[4],r[5],r[6]); 
		var receivedStartYYYYMMDDHHII;
		if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]){
			receivedStartYYYYMMDDHHII=r[1]+r[3]+r[4]+r[5]+r[6];
			if(receivedStartYYYYMMDDHHII !=""){
				return receivedStartYYYYMMDDHHII;
			}
		}else{
			alert("日期时间非法！");
			//return a invalid value
			return '0';
		}
	}
	,getStartSec:function (replaceStartSecId) {
		// body...
		// prevent prefix-0
		var receivedStartSec = parseInt($('#'+replaceStartSecId).val());
		/*
		Format return value to %2d
		*/
		if(receivedStartSec >=0 && receivedStartSec <=59){
			if(receivedStartSec <10){
				return '0'+receivedStartSec;
			}else{
				return receivedStartSec;
			}
		}else{
			document.getElementById(replaceStartSecId).value= 0;
			alert("请输入合法的秒钟值，该值已恢复至默认0！");
			//return default value
			return '00';
		}
		
	}
	,getEndYYYYMMDDHHII:function (replaceEndYYYYMMDDHHIIId) {
		if($('#'+replaceEndYYYYMMDDHHIIId).val() == ""){
			alert("请选择结束日期!");
			return '0';
		}
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/; 
		var r = $('#'+replaceEndYYYYMMDDHHIIId).val().match(reg); 
		if(r==null){
			alert("日期时间不匹配!");
			return '0'; 
		}
		var d= new Date(r[1], r[3]-1,r[4],r[5],r[6]); 
		var receivedEndYYYYMMDDHHII;
		if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]){
			receivedEndYYYYMMDDHHII=r[1]+r[3]+r[4]+r[5]+r[6];
			if(receivedEndYYYYMMDDHHII !=""){
				return receivedEndYYYYMMDDHHII;
			}
		}else{
			alert("日期时间非法!");
			return '0'
		}
	}
	,getEndSec:function (replaceEndSecId) {
		// body...
		var receivedEndSec = parseInt($('#'+replaceEndSecId).val());
		if(receivedEndSec >=0 && receivedEndSec <=59){
			if(receivedEndSec <10){
				return '0'+receivedEndSec;
			}else{
				return receivedEndSec;
			}
		}else{
			document.getElementById(replaceEndSecId).value= 0;
			alert("请输入合法的秒钟值，该值已恢复至默认0！");
			return '00';
		}
	}
	,getDevice:function (deviceId) {
		ajaxRequestDevice();
		//console.info($('#'+core.deviceId).select2("val"));
	}
	,getSelectedDevice:function () {
		if($('#'+core.deviceId).select2("val") != ""){
			this.requestedDeviceStr = this.deviceList[$('#'+core.deviceId).select2("val")];
			return 1;
		}else{
			alert("请选择设备号！")
			return 0;
		}
	}
	/*
	calculating the difference,and return in seconds
	we suppose the timeStamp2 is greater than timeStamp1
	*/
	,timeDiff:function (timeStamp1,timeStamp2) {
		/*
		split the time string to dividual ones to match the args conditions
		*/
		var startYYYY = timeStamp1.substring(0,4);
		var startMM = timeStamp1.substring(4,6);
		var startDD = timeStamp1.substring(6,8);
		var startHH = timeStamp1.substring(8,10);
		var startII = timeStamp1.substring(10,12);
		var startSS = timeStamp1.substring(12,14);
		/*----------------------------------------*/
		var endYYYY = timeStamp2.substring(0,4);
		var endMM = timeStamp2.substring(4,6);
		var endDD = timeStamp2.substring(6,8);
		var endHH = timeStamp2.substring(8,10);
		var endII = timeStamp2.substring(10,12);
		var endSS = timeStamp2.substring(12,14);		
		/*----------------------------------------*/
		var startDate = new Date(startYYYY,startMM,startDD,startHH,startII,startSS);
		var endDate = new Date(endYYYY,endMM,endDD,endHH,endII,endSS);
		/*
		the latter one is greater than the previous one
		so the return value is greater than zero
		*/
		var diff = endDate.getTime() - startDate.getTime();
		return diff/1000;
	}
}
/*
Global track controlling
*/
function displayTrueTimeStr () {
	if(core.playerStatus == "playing"){
		core.statusStr.innerHTML = "当前播放 "+core.displayTimeStr(core.getResponseFilenameFromUrl(core.playlist[core.currentIndex]),core.playerInstance.currentTime());
		var t = setTimeout("displayTrueTimeStr()",500);
	}
}
/*
this timedCount call itself once per second if matched the given conditions
after dragging the slide bar,its location info was lost
just test the currentTime and the  predetermine end point
*/
function timedCount(point) {
	if(core.playerInstance.currentTime() >= point){
		core.playerInstance.currentTime(0);
		core.playerInstance.pause();
	}else{
		var t = setTimeout("timedCount("+point+")",1000);
	}
}
/*
when play the first track,we need a technical means to get a ready state,
so in 500ms we jump to play() action,same as it starts at predetermine point
*/
function quickStartTrack (startAt) {
	// body...
	core.playerInstance.currentTime(startAt);
	core.playerInstance.play();
}
/*
Ajax post request in async mode,
as the whole project is based on HTML5 technology,so we just build a XMLHttpRequest,not include a activeX request
the return value is in JSON format
*/
function ajaxRequest () {
	if(core.getDatetimepickerStr(core.startYYYYMMDDHHIIId,core.startSecId,core.endYYYYMMDDHHIIId,core.endSecId) && core.getSelectedDevice()){
		var httpReq;
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
				 httpReq = new XMLHttpRequest();
		}else{
			alert("(⊙o⊙)…你这个浏览器弱爆了，赶紧换一个支持HTML5的!")
		}
		httpReq.onreadystatechange=function(){
			  if (httpReq.readyState==4 && httpReq.status==200){
					//Split the response array into two lists
					//---------Test data------------------------------------------------- 
					/*
					var responseList = ["play1","play2","play3","play4","play5","play6","play7","play8","play9","play10","play11",
										"down1","down2","down3","down4","down5","down6","down7","down8","down9","down10","down11"];
					*/
					var responseList = eval ("(" + httpReq.responseText + ")");
					//clear list to none
					core.playlist=[];
					core.downloadlist=[];
					if(responseList.length>0){
						for(i = 0 ; i < responseList.length/2 ; i++ ){
							core.playlist[i]=responseList[i];
						}
						for(i = responseList.length/2 , j=0 ; i < responseList.length ; i++ ,j++){
							core.downloadlist[j]=responseList[i];
						}
						/*
						//---------Debug info-------------
						console.info(core.downloadlist);
						console.info(core.playlist);
						*/
					    core.statusImg.src = "img/placeholder.png";
					    core.statusStr.innerHTML = "";
					    /*
					    Calculating page info
					    */
						if(core.playlist.length %10 == 0 ){
							core.totalPages = parseInt(core.playlist.length / 10);
						}else{
							core.totalPages = parseInt(core.playlist.length /10 +1);
						}
						//Setting paginator
						var options = {
							currentPage: 1,
						    totalPages:core.totalPages,
						}
						$('#'+core.paginatorId).bootstrapPaginator(options);
						$('#'+core.paginatorId).show();
						var listviewStr="";
						//first page list
						if(core.totalPages > 1){
							for(i=0;i<10;i++){
								listviewStr += core.generateRowCell(core.playlist[i],i);
							}
						}else{
							for(i=0;i<core.playlist.length;i++){
								listviewStr += core.generateRowCell(core.playlist[i],i);
							}
						}
						document.getElementById(core.playlistviewId).innerHTML = listviewStr;
					}else{
						core.statusImg.src = "img/placeholder.png";
					    core.statusStr.innerHTML = "没有找到请求的视频文件！";
					    $('#'+core.paginatorId).hide();
					    document.getElementById(core.playlistviewId).innerHTML = "";
					}
			   }else{
			   		core.statusStr.innerHTML = "与服务器交互过程中出现异常！";
			   		core.statusImg.src = "img/error.png";
			   }
		}
		var postData = "start_time="+core.requestedStartTimeStr+"&end_time="+core.requestedEndTimeStr+"&port_id="+core.requestedDeviceStr;
		httpReq.open("POST",core.serverAddress+"/play",true);
		httpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		httpReq.send(postData);
		//change status
		core.statusImg.src = "img/loading.gif";
		core.statusStr.innerHTML = "正在获取播放列表...";		
	}
}
/*
Ajax post request for getting a download url and down it,
the return value will be just one unique id
*/
function ajaxDownload () {
	/*
	user maybe change the time interval,
	so re-get these values again
	*/
	if(core.getDatetimepickerStr(core.startYYYYMMDDHHIIId,core.startSecId,core.endYYYYMMDDHHIIId,core.endSecId) && core.getSelectedDevice()){
		var httpDownloadReq;
		if(window.XMLHttpRequest){
			httpDownloadReq = new XMLHttpRequest();
		}else{
			alert("(⊙o⊙)…你这个浏览器弱爆了，赶紧换一个支持HTML5的!");
		}
		httpDownloadReq.onreadystatechange = function(){
			if(httpDownloadReq.readyState == 4 && httpDownloadReq.status == 200){
				var returnId = httpDownloadReq.responseText;
				if(returnId != ""){
					core.downloadId = returnId;
					check();
				}
			}
		}
		var getData = "?start_time="+core.requestedStartTimeStr+"&end_time="+core.requestedEndTimeStr+"&port_id="+core.requestedDeviceStr;
		httpDownloadReq.open("GET",core.serverAddress+"/download"+getData,true);
		httpDownloadReq.send();
		//change status
		core.statusImg.src = "img/loading.gif";
		core.statusStr.innerHTML = "请稍等，正在发送拼接视频请求...";	
	}
}
/*
request device list
If not null,also enable the buttons
*/
function ajaxRequestDevice () {
	if(core.getDatetimepickerStr(core.startYYYYMMDDHHIIId,core.startSecId,core.endYYYYMMDDHHIIId,core.endSecId)){
		var HttpDeviceReq;
		if(window.XMLHttpRequest){
			HttpDeviceReq = new XMLHttpRequest();
		}else{
			alert("(⊙o⊙)…你这个浏览器弱爆了，赶紧换一个支持HTML5的!");
		}
		HttpDeviceReq.onreadystatechange = function(){
			if(HttpDeviceReq.readyState == 4 && HttpDeviceReq.status == 200){
				if(HttpDeviceReq.responseText != ""){
					//save in list
					core.deviceList = eval ("(" + HttpDeviceReq.responseText + ")");
					if(core.deviceList.length > 0){
						var dataStr="";
						for(i = 0 ; i < core.deviceList.length ; i++){
							//construct data here
							dataStr+='{id:'+i+',text:"'+core.deviceList[i]+'"},';
						}
						dataStr = '['+dataStr+']';
						console.info(dataStr);
						var dataStrToList =  eval ("(" + dataStr + ")");
						//add select2 list candidates
						$('#'+core.deviceId).select2({placeholder: "请在以下候选项中选择设备码",data:dataStrToList});
						//clear info
						core.statusImg.src = "img/placeholder.png";
						core.statusStr.innerHTML = "";
						//enable buttons
						document.getElementById("btnQuery").disabled=false;
						document.getElementById("btnDownload").disabled=false;
					}else{
						core.statusImg.src = "img/error.png";
						core.statusStr.innerHTML = "没有找到请求的设备列表！";
					}
				}
			}
		}
		var getData = "?start_time="+core.requestedStartTimeStr+"&end_time="+core.requestedEndTimeStr;
		HttpDeviceReq.open("GET",core.serverAddress+"/port"+getData,true);
		HttpDeviceReq.send();
		//change status
		core.statusImg.src = "img/loading.gif";
		core.statusStr.innerHTML = "请稍等，正在发送获取设备列表请求...";	
	}
}
/*
if None,timed count every 3 seconds
if not,do save as action
*/
function check () {
	if(core.downloadStatus == "None"){
		//change status
		core.statusStr.innerHTML = "请稍等，服务器正在为您拼接视频...";	
		checkIfMerged();
		var t = setTimeout("check()",3000);
	}else{
		if(core.checkIfUrl(core.downloadStatus)){
			core.statusImg.src = "img/placeholder.png";
			core.statusStr.innerHTML = "完成拼接，请保存下载的视频文件!";
			window.location = core.downloadStatus;
		}else{
			core.statusImg.src = "img/error.png";
			core.statusStr.innerHTML = "(⊙o⊙)…额，拼接失败!";
		}
	}
}
/*
Ajax post request for getting a status and,
if not None ,download it
*/
function checkIfMerged () {
		var httpCheck;
		if(window.XMLHttpRequest){
			httpCheck = new XMLHttpRequest();
		}else{
			alert("(⊙o⊙)…你这个浏览器弱爆了，赶紧换一个支持HTML5的!");
		}
		httpCheck.onreadystatechange = function(){
			if(httpCheck.readyState == 4 && httpCheck.status == 200){
				var returnValue = httpCheck.responseText;
				if(returnValue != ""){
					core.downloadStatus = returnValue;
				}
			}
		}
		var postData = "task_id="+core.downloadId;
		httpCheck.open("POST",core.serverAddress+"/download",true);
		httpCheck.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		httpCheck.send(postData);
}