window.onload = function(){
  var date = undefined,
      calendarViewManager1 = new CalendarViewManager(date),
      calendarViewManager2 = new CalendarViewManager(date),
      calendarDOM1 = document.getElementById("calendar1"),
      calendarDOM2 = document.getElementById("calendar2");

      calendarViewManager1.init();

      calendarDOM1.innerHTML = calendarViewManager1.getCurrentCalendarView().innerHTML;
      calendarDOM1.addEventListener('click', function(evt){
        var evtTarget = evt.target,
            dataSet = evtTarget.dataset;
        if (dataSet.type && dataSet.type === "next"){
          calendarDOM1.innerHTML = calendarViewManager1.getNextCalendarView().innerHTML;
        }
        else if (dataSet.type && dataSet.type === "prev"){
          calendarDOM1.innerHTML = calendarViewManager1.getPreviousCalendarView().innerHTML;
        }
      });

      calendarViewManager2.init();

      calendarDOM2.innerHTML = calendarViewManager2.getCurrentCalendarView().innerHTML;
      calendarDOM2.addEventListener('click', function(evt){
        var evtTarget = evt.target,
            dataSet = evtTarget.dataset;
        if (dataSet.type && dataSet.type === "next"){
          calendarDOM2.innerHTML = calendarViewManager2.getNextCalendarView().innerHTML;
        }
        else if (dataSet.type && dataSet.type === "prev"){
          calendarDOM2.innerHTML = calendarViewManager2.getPreviousCalendarView().innerHTML;
        }
      });

};
