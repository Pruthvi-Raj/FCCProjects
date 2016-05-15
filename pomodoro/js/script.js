$(document).ready(function() {
  var canvas = document.getElementById('circle');
  var context = canvas.getContext('2d');
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = canvas.height / 2 - 10;
  var full = radius * 2;
  var amount = 0;
  var sessionColor = "#28a228",
    breakColor = "#ef4836";
  var colorOfCircle = sessionColor;
  var fontColor = "#000080";
  var isPaused = true,
    timerset = false;
  var clicked = false;
  var sessionOrBreak, firstRun = true;
  var alertAudio = new Audio('http://brickgame.netau.net/alert.mp3');
  function fillCircle() {
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.clip();
    context.fillStyle = colorOfCircle;
    context.fillRect(centerX - radius, centerY + radius, radius * 2, -amount);
    context.restore();
    context.beginPath();
    context.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI, false);
    context.lineWidth = 3;
    context.strokeStyle = colorOfCircle;
    context.stroke();
  }

  function clearCircle() {
    context.save();
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.clip();
    context.clearRect(centerX - radius, centerY + radius, radius * 2, -radius * 2);
    context.restore();
    context.beginPath();
  }

  function init() {
    fillCircle();
    context.fillStyle = fontColor;
    context.font = "30px Comic Sans MS";
    context.textAlign = "center";
    context.fillText("Start Session!", canvas.width / 2, canvas.height / 2);
  }
  init();

  function getFormattedTime(totalSecs, secsElapsed) {
    if (secsElapsed > totalSecs) secsElapsed = 0;
    return moment.utc(moment({
      seconds: totalSecs
    }) - moment({
      seconds: secsElapsed
    })).format("HH:mm:ss");
    /* use this to remove moment.js
        var secs = totalSecs - secsElapsed ;
		var hours = parseInt( secs / 3600 ) % 24;
		var minutes = parseInt( secs / 60 ) % 60;
		var seconds = secs % 60;

		var t = (hours < 10 ? "0" + hours : hours) + "-" + (minutes < 10 ? "0" + minutes : minutes) + "-" + (seconds  < 10 ? "0" + seconds : seconds);
		return t; */
  }
  $(canvas).on('click', function() {
    if (firstRun) clearCircle();
    firstRun = false;
    $('#break-plus,#break-minus,#session-minus,#session-plus').off();
    sessionOrBreak = "Session";
    clicked = true;
    if (clicked) {
      isPaused = isPaused ? false : true;
      var sessionLength = $('#session-len').text();
      var breakLength = $('#break-len').text();
      if (!timerset) {
        var totalTime;
        var secs = sessionOrBreak === "Session" ? sessionLength * 60 : breakLength * 60;
        var tempsecs = secs;
        timerset = true;
        $('#session-or-break').html(sessionOrBreak);
        $('#sep').html(":&nbsp");
        $('#current-time').html(getFormattedTime(secs, secs - tempsecs));
        var sessionTimer = setInterval(function() {
          if (!isPaused) {
            // fillCircle();
            amount += (2 * radius) / secs;
            tempsecs--;
            console.log(2 * radius, amount, secs, tempsecs);
            $('#current-time').html(getFormattedTime(secs, secs - tempsecs));
            fillCircle();
            if (tempsecs == -1) {
              alertAudio.play();
              clearCircle();
              amount = 0;
              sessionOrBreak = sessionOrBreak === "Session" ? "Break" : "Session";
              colorOfCircle = sessionOrBreak === "Session" ? "green" : "red";
              secs = sessionOrBreak === "Session" ? sessionLength * 60 : breakLength * 60;
              tempsecs = secs;
              fillCircle();
              $('#session-or-break').html(sessionOrBreak);
            }
          }
        }, 1000);
      }
    }
    clicked = false;
  });
  $('#break-plus,#break-minus,#session-minus,#session-plus').on('click', function(e) {
    e.preventDefault();
    var targetDetails = e.target.id.split("-");
    var where = targetDetails[0],
      operator = targetDetails[1];
    var targetElement = $("#" + where + "-len"),
      targVal = targetElement.html();
    if (targVal >= 2 && operator === "minus")
      targetElement.html(targVal - 1);
    else if (operator === 'plus' && targVal >= 1)
      targetElement.html(Number(targVal) + 1);
  });
});
