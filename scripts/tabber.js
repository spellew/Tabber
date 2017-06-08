$("#deletall").click(function () {
    alert("yah");
    chrome.alarms.clearAll();
    alert("yah");
    update();
})


function update(){
    chrome.alarms.getAll(function(alarms){
      alarms.forEach(function(alarm, num){
          num+=1;
          delet = " <p class = 'well'> <button type= 'button' class='btn btn-default'> X </button>";
          link = " <a href ='" + alarm.name.split("+++")[0] + "'>" + alarm.name + "</a>";
          $("#alarmList").append(delet + "  " + num + " -- "+ link + "      (time : " + alarm.scheduledTime + ")</p>");
      });
    });
}

update();
