<!--core js-->
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
var core = {
	playerId:""
	,playlist:["http://219.245.64.30:80/videos/2013/12/17/192.168.0.1/20131217103000.mp4"]
	,playerInstance:""
	,statusImg:""
	,statusStr:""
	,startYYYYMMDDHHIIId:""
	,startSecId:""
	,endYYYYMMDDHHIIId:""
	,endSecId:""
	,deviceId:""
	,requestedStartTimeStr:"20131217103000"
	,requestedEndTimeStr:"20131217103020"
	,requestedDeviceStr:"0"
	//when track ended to fire up
	,playEnded:function() {
		//choose another track
		//Not the last one
		if(this.playlist.length>1){
			var urlToPlay = this.playlist[0];
			this.playerInstance.src(urlToPlay);
			this.playerInstance.play();
			//update status
			this.statusImg.src = "img/play.gif";
			this.statusStr.innerHTML = "Playing";
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
			this.statusStr.innerHTML = "Playing";
			this.playlist.shift();
		}else{
			this.statusImg.src = "img/pause.png";
			this.statusStr.innerHTML = "Ended";
		}
		//choose another track end
	}
	,quickSwitch:function (startAt) {
		var t = setTimeout("quickStartTrack("+startAt+")",500);
	}
	,playPaused:function () {
		this.statusImg.src = "img/pause.png";
		this.statusStr.innerHTML = "Paused";
	}
	,playWaiting:function () {
		this.statusImg.src = "img/pause.png";
		this.statusStr.innerHTML = "Waiting";
	}
	,playPlaying:function () {
		this.statusImg.src = "img/play.gif";
		this.statusStr.innerHTML = "Playing";
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
	//Use RegEx to split filename
	,getResponseFilenameFromUrl:function (url) {
		var matched=url.match(/\/([\w]*)\.mp4/i);
 		return matched[1];
	}
	,invokePlayAction:function () {
		ajaxRequest();
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
	,doDownload:function () {
		/*
		//hide this feature temporarily
		this.statusImg.src = "img/loading.gif";
		this.statusStr.innerHTML = "Downloading...";
		*/
	}
	,downloadCompleted:function () {
		// body...
		/*
		//hide this feature temporarily
		this.statusImg.src = "img/downloaded.png";
		this.statusStr.innerHTML = "Download completed...";
		*/
	}
	//get selected date info
	,getDatetimepickerStr:function (startYYYYMMDDHHIIId,startSecId,endYYYYMMDDHHIIId,endSecId,deviceId) {
		var receivedStartYYYYMMDDHHII = this.getStartYYYYMMDDHHII(startYYYYMMDDHHIIId);
		var receivedEndYYYYMMDDHHII = this.getEndYYYYMMDDHHII(endYYYYMMDDHHIIId);
		
		if(receivedStartYYYYMMDDHHII !='0' && receivedEndYYYYMMDDHHII !='0'){
			var receivedStartDateStr = receivedStartYYYYMMDDHHII+this.getStartSec(startSecId);
			var receivedEndDateStr = receivedEndYYYYMMDDHHII+this.getEndSec(endSecId);
			this.requestedDeviceStr = this.getDevice(deviceId);
			//alert(receivedStartDateStr+"-->"+receivedEndDateStr);
			if(receivedStartDateStr < receivedEndDateStr){
				//The end time stamp must gteater than the start one
				this.requestedStartTimeStr = receivedStartDateStr;
				this.requestedEndTimeStr = receivedEndDateStr;
				return 1;
			}else{
				return 0;
				alert("请输入合法的日期区间！");
			}
		}else{
			return 0;
			alert("请输入合法的日期区间！");
		}
		
	}
	,getStartYYYYMMDDHHII:function (replaceStartYYYYMMDDHHIIId) {
		// body...
		var receivedStartYYYYMMDDHHII = $('#'+replaceStartYYYYMMDDHHIIId).val();
		if(receivedStartYYYYMMDDHHII !=""){
			return receivedStartYYYYMMDDHHII;
		}else{
			alert("请选择起始日期！");
			//return a invalid value
			return '0';
		}
	}
	,getStartSec:function (replaceStartSecId) {
		// body...
		var receivedStartSec = $('#'+replaceStartSecId).val();
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
			alert("请输入合法的秒钟值，该值已恢复至默认！");
			//return default value
			return '00';
		}
		
	}
	,getEndYYYYMMDDHHII:function (replaceEndYYYYMMDDHHIIId) {
		// body...
		var receivedEndYYYYMMDDHHII = $('#'+replaceEndYYYYMMDDHHIIId).val();
		if(receivedEndYYYYMMDDHHII !=""){
			return receivedEndYYYYMMDDHHII;
		}else{
			alert("请选择结束日期！");
			return '0';
		}
	}
	,getEndSec:function (replaceEndSecId) {
		// body...
		var receivedEndSec = $('#'+replaceEndSecId).val();
		if(receivedEndSec >=0 && receivedEndSec <=59){
			if(receivedEndSec <10){
				return '0'+receivedEndSec;
			}else{
				return receivedEndSec;
			}
		}else{
			document.getElementById(replaceEndSecId).value= 0;
			alert("请输入合法的秒钟值，该值已恢复至默认！");
			return '00';
		}
	}
	,getDevice:function (deviceId) {
		var receivedDevice = $('#'+deviceId).val();
		switch(receivedDevice){
			case '0':
			  return "192.168.0.1" ;
			  break;
			case '1':
			  return "192.168.0.1" ;
			  break;
			case '2':
			  return "192.168.0.1" ;
			  break;
			default:
			  alert("请输入合法的设备编号，已选择使用默认值！");
			  document.getElementById(deviceId).value= 0;
			  return "192.168.1.10";
		}
	}
	,timeDiff:function (timeStamp1,timeStamp2) {
		var startYYYY = timeStamp1.substring(0,4);
		var startMM = timeStamp1.substring(4,6);
		var startDD = timeStamp1.substring(6,8);
		var startHH = timeStamp1.substring(8,10);
		var startII = timeStamp1.substring(10,12);
		var startSS = timeStamp1.substring(12,14);
		
		var endYYYY = timeStamp2.substring(0,4);
		var endMM = timeStamp2.substring(4,6);
		var endDD = timeStamp2.substring(6,8);
		var endHH = timeStamp2.substring(8,10);
		var endII = timeStamp2.substring(10,12);
		var endSS = timeStamp2.substring(12,14);		
		
		var startDate = new Date(startYYYY,startMM,startDD,startHH,startII,startSS);
		var endDate = new Date(endYYYY,endMM,endDD,endHH,endII,endSS);
		var diff = endDate.getTime() - startDate.getTime();
		return diff/1000;
	}
}
//Global track controlling
	//Stop in a certain time count
function timedCount(point) {
	if(core.playerInstance.currentTime() >= point){
		core.playerInstance.currentTime(0);
		core.playerInstance.pause();
	}else{
		var t = setTimeout("timedCount("+point+")",1000);
	}
}
function quickStartTrack (startAt) {
	// body...
	core.playerInstance.currentTime(startAt);
	core.playerInstance.play();
}
function ajaxRequest () {
	if(/*this.getDatetimepickerStr(this.startYYYYMMDDHHIIId,this.startSecId,this.endYYYYMMDDHHIIId,this.endSecId,this.deviceId)true*/true){
		var httpReq;
		if (window.XMLHttpRequest){
			// code for IE7+, Firefox, Chrome, Opera, Safari
				 httpReq=new XMLHttpRequest();
		}else{
			alert("Require a fine style broswer!")
		}
		httpReq.onreadystatechange=function(){
			  if (httpReq.readyState==4 && httpReq.status==200){
			    //
			    core.playlist = eval ("(" + httpReq.responseText + ")");
			    core.statusImg.src = "img/placeholder.png"
			    core.statusStr.innerHTML = "";
			    core.doPlay();
			   }
		}
		//alert(core.requestedStartTimeStr);
		var postUrl = "http://219.245.64.30/play";
		var postData = "start_time="+"20131217103000"+"&end_time="+"20131217103020"+"&port_id="+"192.168.0.1";
		httpReq.open("POST",postUrl,true);
		httpReq.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		httpReq.send(postData);
		//change status
		this.statusImg.src = "img/loading.gif";
		this.statusStr.innerHTML = "Fetching data from the server...";		
	}

}