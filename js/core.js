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
	//when track ended to fire up
	,playEnded:function() {
		//alert(playlist);
	}
	//inititally get the playerId
	,getPlayerId:function (replacePlayerId) {
		// body...
		this.playerId = replacePlayerId;
		this.playerInstance = videojs(replacePlayerId);	
	}
	//as it shows,it just play
	,doPlay:function (){
		//http://127.0.0.1/1.mp4
		//play this url
		this.playerInstance.src("http://127.0.0.1/2.mp4");
		//play it
		this.playerInstance.play();
		this.getDatetimepickerStr("startYearMonthDay","startHour","startMin","startSec","endYearMonthDay","endHour","endMin","endSec");
	}
	,getDatetimepickerStr:function (startDateId,startHourId,startMinId,startSecId,endDateId,endHourId,endMinId,endSecId) {
		// define container
		var startTimeStamp ;
		var endTimeStamp ;
		//define local start
		var receivedStartDate = this.getStartDate(startDateId);
		var receivedStartHour = this.getStartHour(startHourId);
		var receivedStartMin = this.getStartMin(startMinId);
		var receivedStartSec = this.getStartSec(startSecId);
		//define local end
		var receivedEndDate = this.getEndDate(endDateId);
		var receivedEndHour = this.getEndHour(endHourId);
		var receivedEndMin = this.getEndMin(endMinId);
		var receivedEndSec = this.getEndSec(endSecId);
		if(receivedStartDate < receivedEndDate)
		{
			//In such a case,sign these
			startTimeStamp = receivedStartDate+receivedStartHour+receivedStartMin+receivedStartSec;
			endTimeStamp = receivedEndDate+receivedEndHour+receivedEndMin+receivedEndSec;
		}else if(receivedStartDate == receivedEndDate){
			//In such a case,in the same day
			if(receivedStartHour < receivedEndHour){
				startTimeStamp = receivedStartDate+receivedStartHour+receivedStartMin+receivedStartSec;
				endTimeStamp = receivedEndDate+receivedEndHour+receivedEndMin+receivedEndSec;
			}else if(receivedStartHour == receivedEndHour){
				//In such a case,in the same hour 
				if(receivedStartMin < receivedEndMin){
					startTimeStamp = receivedStartDate+receivedStartHour+receivedStartMin+receivedStartSec;
					endTimeStamp = receivedEndDate+receivedEndHour+receivedEndMin+receivedEndSec;
				}else if(receivedStartMin == receivedEndMin){
					//In such a case,at the same minutes
					if(receivedStartSec < receivedEndSec){
						//In such a case,the start seconds must smaller than the end one,at least!
						startTimeStamp = receivedStartDate+receivedStartHour+receivedStartMin+receivedStartSec;
						endTimeStamp = receivedEndDate+receivedEndHour+receivedEndMin+receivedEndSec;
					}
					else{
						alert("请输入合法的秒钟区间！");
					}
				}
				else{
					alert("请输入合法的分钟区间！");
				}
			}
			else{
				alert("请输入合法的小时区间！");
			}
		}
		else{
			alert("请输入合法的日期区间！");
		}
		
		//alert(startTimeStamp+'-'+endTimeStamp);
	}
	,getStartDate:function (replaceDateId) {
		// body...
		var receivedStartDate = $('#'+replaceDateId).val();
		if(receivedStartDate !=""){
			return receivedStartDate;
		}else{
			alert("请选择起始日期！");
		}
	}
	,getStartHour:function (replaceHourId) {
		// body...
		var receivedStartHour = $('#'+replaceHourId).val();
		if(receivedStartHour >= 0 && receivedStartHour <= 23){
			if(receivedStartHour < 10){
				//Format the string to %2d
				return '0'+receivedStartHour;
			}else{
				return receivedStartHour;
			}
		}else{
			alert("请输入正确的起始小时时间！");
		}
	}
	,getStartMin:function (replaceMinId) {
		// body...
		var receivedStartMin = $('#'+replaceMinId).val();
		if(receivedStartMin >= 0 && receivedStartMin <= 59){
			if(receivedStartMin < 10){
				return '0'+receivedStartMin;
			}else{
				return receivedStartMin;
			}
		}else{
			alert("请输入正确的起始分钟时间！");
		}
	}
	,getStartSec:function (replaceSecId) {
		// body...
		var receivedStartSec = $('#'+replaceSecId).val();
		if(receivedStartSec >= 0 && receivedStartSec <= 59){
			if(receivedStartSec <10){
				return '0'+receivedStartSec;
			}else{
				return receivedStartSec;
			}
		}else{
			alert("请输入正确的起始秒钟时间！");
		}
	}
	,getEndDate:function (replaceDateId) {
		// body...
		var receivedEndDate = $('#'+replaceDateId).val();
		if(receivedEndDate !=""){
			return receivedEndDate;
		}else{
			alert("请选择结束日期！");
		}
	}
	,getEndHour:function (replaceHourId) {
		// body...
		var receivedEndHour = $('#'+replaceHourId).val();
		if(receivedEndHour >= 0 && receivedEndHour <= 23){
			if(receivedEndHour <10){
				return '0'+receivedEndHour;
			}else{
				return receivedEndHour;
			}
		}else{
			alert("请输入正确的结束小时时间！");
		}
	}
	,getEndMin:function (replaceMinId) {
		// body...
		var receivedEndMin = $('#'+replaceMinId).val();
		if(receivedEndMin >= 0 && receivedEndMin <= 59){
			if(receivedEndMin <10){
				return '0'+receivedEndMin;
			}else{
				return receivedEndMin;
			}
		}else{
			alert("请输入正确的结束分钟时间！");
		}
	}
	,getEndSec:function (replaceSecId) {
		// body...
		var receivedEndSec = $('#'+replaceSecId).val();
		if(receivedEndSec >= 0 && receivedEndSec <= 59){
			if(receivedEndSec <10){
				return '0'+receivedEndSec;
			}else{
				return receivedEndSec;
			}
		}else{
			alert("请输入正确的结束秒钟时间！");
		}
	}
}