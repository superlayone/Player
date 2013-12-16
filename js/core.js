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
	,playerInstance:""
	,statusImg:""
	,statusStr:""
	//when track ended to fire up
	,playEnded:function() {
		//alert(playlist);
		this.statusImg.src = "img/pause.png";
		this.statusStr.innerHTML = "Ended";
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
	,getStatusId:function (statusImgId,statusStrId) {
		this.statusImg = document.getElementById(statusImgId);
		this.statusStr = document.getElementById(statusStrId);
	}
	//as it shows,it just play
	,doPlay:function (){
		//play this url
		this.playerInstance.src("http://127.0.0.1/2.mp4");
		//play it
		this.playerInstance.play();
		/*Debug info
		//this.getDatetimepickerStr("startYYYYMMDDHHII","startSec","endYYYYMMDDHHII","endSec");
		*/
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
	,getDatetimepickerStr:function (startYYYYMMDDHHIIId,startSecId,endYYYYMMDDHHIIId,endSecId) {
		var receivedStartYYYYMMDDHHII = this.getStartYYYYMMDDHHII(startYYYYMMDDHHIIId);
		var receivedEndYYYYMMDDHHII = this.getEndYYYYMMDDHHII(endYYYYMMDDHHIIId);
		if(receivedStartYYYYMMDDHHII !='0' && receivedEndYYYYMMDDHHII !='0'){
			var receivedStartDateStr = receivedStartYYYYMMDDHHII+this.getStartSec(startSecId);
			var receivedEndDateStr = receivedEndYYYYMMDDHHII+this.getEndSec(endSecId);
			//alert(receivedStartDateStr+"-->"+receivedEndDateStr);
			if(receivedStartDateStr < receivedEndDateStr){
				//The end time stamp must gteater than the start one
				//Construct a request url here,and do request
			}else{
				alert("请输入合法的日期区间！");
			}
		}else{
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
}