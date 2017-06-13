$(document).ready(function() {
  // $("#deletall").click is added to a document on ready function,
  // this is necessary for the callback function to run when the element is clicked.
  $("#deletall").click(function() {
    // alert("yah");
    chrome.alarms.clearAll();
    // alert("yah");
    update();
  });
  $("#refresh").click(function() {
    update();
  })
});

function update() {
  $(".well").remove(); // So old alarms are removed, all the wells are removed and all the ongoing alarms are added during update.
  chrome.alarms.getAll(function(alarms) {
    alarms.forEach(function(alarm, num) {
      name = alarm.name.split("+++")[0];
      num += 1;
      delet = " <p class = 'well'> <button type= 'button' class='btn btn-default'> X </button>";
      link = " <a href ='" + name + "'>" + name + "</a>";
      $("#alarmList").append(delet + "  " + num + " -- " + link + "      (time : " + alarm.scheduledTime + ")</p>");
    });
  });
}

update();
