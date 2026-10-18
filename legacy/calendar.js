/*CONSTANTS*/
var MAX_CACHE_SIZE = 5,
    DAYS_IN_A_WEEK = 7;

/* Calendar prototype */
var Calendar = function(passedDate){
  this.currentDate = passedDate?new Date(passedDate):new Date();
  this.weeksArray = {1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
};

Calendar.MONTHS = ["January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"];
Calendar.DAYS =  ["S", "M", "T", "W", "T", "F", "S"];

Calendar.prototype = {
  getYear: function(){
    return this.currentDate.getFullYear();
  },
  getYearString: function(){
    return this.getYear().toString();
  },
  getMonth: function(){
    return this.currentDate.getMonth();
  },
  getMonthString: function(){
    return Calendar.MONTHS[this.getMonth()];
  },
  setWeeks: function(){
    var offset = this.currentDate.getDay(),
        i = 1,
        curDate,
        lastTempDate,
        numOfWeek;
    curDate = new Date(this.getMonthString()+"/"+i+"/"+this.getYearString());
    offset = curDate.getDay();
    for (var j = 0; j < offset; ++j){
      this.weeksArray[i].push(undefined);
    }
    lastTempDate = 0;
    while(i){
      curDate = new Date(this.getMonthString()+"/"+i+"/"+this.getYearString());
      numOfWeek = Math.floor((i-1+offset)/DAYS_IN_A_WEEK);

      if(isNaN(curDate.getDate()) || lastTempDate > curDate.getDate()){
        var weeksArray = this.weeksArray;
        for (var week in weeksArray){
          var weekLength = weeksArray[week].length;
          if (weekLength != 0 && weekLength < DAYS_IN_A_WEEK){
            for (var i = 0; i < DAYS_IN_A_WEEK - weekLength; ++i){
              weeksArray[week].push(undefined);
            }
          }
        }
        break;
      }
      this.weeksArray[numOfWeek+1].push(curDate);
      lastTempDate = i;
      ++i;
    }
  },
  getWeeks: function(){
    if (this.weeksArray["1"].length == 0){
      this.setWeeks();
    }
    return this.weeksArray;
  }
};

/* CalendarView prototype */
var CalendarView = function(passedDate){
  this.calendar = new Calendar(passedDate);
};

CalendarView.FIRSTMONTH = 1;
CalendarView.LASTMONTH = 11;

CalendarView.prototype = {
  getTable: function(){
    return document.createElement("table");
  },
  getTHead: function(){
    return document.createElement("thead");
  },
  getTBody: function(){
    return document.createElement("tbody");
  },
  getTR: function(){
    return document.createElement("tr");
  },
  getTH: function(){
    return document.createElement("th");
  },
  getTD: function(){
    return document.createElement("td");
  },
  getDiv: function(){
    return document.createElement("div");
  },
  getSpan: function(content){
    return document.createElement("span");
  },
  getButton: function(){
    return document.createElement("button");
  },
  getTextNode: function(content){
    return document.createTextNode(content);
  },
  getDaysNameView: function(){
    var daysNameHead = this.getTHead(),
        daysNameRow = this.getTR(),
        days = Calendar.DAYS;
    for (var day in days){
      var dayNameElement = this.getTH();
      dayNameElement.appendChild(this.getTextNode(days[day]));
      daysNameRow.appendChild(dayNameElement);
    }
    daysNameHead.appendChild(daysNameRow);
    return daysNameRow;
  },
  getWeekView: function(week){
    var weekRow = this.getTR();
    for (var i = 0; i < week.length; ++i){
      var dayElement = this.getTD(),
          date = week[i];
      if (date){
        dayElement.appendChild(this.getTextNode(date.getDate()));
      }
      weekRow.appendChild(dayElement);
    }
    return weekRow;
  },
  getWeeksView: function(){
    var weeksBody = this.getTBody(),
        weeks = this.calendar.getWeeks();
    weeksBody.appendChild(this.getDaysNameView());
    for (var week in weeks){
      weeksBody.appendChild(this.getWeekView(weeks[week]));
    }
    return weeksBody;
  },
  getCalendarNavView: function(){
    var calendarNavHead = this.getTHead(),
        curMonth = this.calendar.getMonth(),
        curYear = this.calendar.getYear(),
        prevMonth, prevYear, nextMonth, nextYear,
        centralNavView = this.getTR(),
        monthView = this.getTH(),
        yearView = this.getTH(),
        previousButtonView = this.getTH(),
        previousButton = this.getButton(),
        nextButtonView = this.getTH(),
        nextButton = this.getButton();

    if(curMonth === CalendarView.LASTMONTH){
      nextMonth = CalendarView.FIRSTMONTH;
      nextYear = curYear+1;
    }
    else{
      nextMonth = curMonth+2;
      nextYear = curYear;
    }

    if(curMonth === 0){
      prevMonth = CalendarView.LASTMONTH + 1;
      prevYear = curYear-1;
    }
    else{
      prevMonth = curMonth;
      prevYear = curYear;
    }

    previousButton.innerText = "<";
    previousButton.dataset.type = "prev";
    //previousButton.dataset.date = new Date(prevMonth+"/"+1+"/"+prevYear);
    previousButtonView.appendChild(previousButton);
    nextButton.innerText = ">";
    nextButton.dataset.type = "next";
    //nextButton.dataset.date = new Date(nextMonth+"/"+1+"/"+nextYear);
    nextButtonView.appendChild(nextButton);

    monthView.appendChild(this.getTextNode(this.calendar.getMonthString()));
    monthView.setAttribute('colspan', 3);
    yearView.appendChild(this.getTextNode(this.calendar.getYearString()));
    yearView.setAttribute('colspan', 2);

    centralNavView.appendChild(previousButtonView);
    centralNavView.appendChild(monthView);
    centralNavView.appendChild(yearView);
    centralNavView.appendChild(nextButtonView);

    calendarNavHead.appendChild(centralNavView);

    return calendarNavHead;
  },
  getCalendarDaysView: function(weeks, daysName){
    var calendarDaysView = this.getTable();
    calendarDaysView.appendChild(this.getCalendarNavView());
    calendarDaysView.appendChild(this.getWeeksView());
    return calendarDaysView;
  },
  getCalendarView: function(){
    var calendarView = this.getDiv();
    calendarView.appendChild(this.getCalendarDaysView());
    return calendarView;
  }
};

var CalendarViewStack = function(){
  this.backStack = new Stack(MAX_CACHE_SIZE);
  this.forwardStack = new Stack(MAX_CACHE_SIZE);
};

CalendarViewStack.prototype = {
  pushForward: function(calendarView){
    this.forwardStack.push(calendarView);
  },
  pushBackward: function(calendarView){
    this.backStack.push(calendarView);
  },
  popForward: function(){
    return this.forwardStack.pop();
  },
  popBackward: function(){
    return this.backStack.pop();
  },
  sizeFoward: function(){
    return this.forwardStack.length;
  },
  sizeBackward: function(){
    return this.backStack.length;
  }
};

var CalendarViewManager = function(passedDate){
  this.calendarViewStack = new CalendarViewStack();
  this.currentCalendarView = new CalendarView(passedDate);
}

CalendarViewManager.prototype = {
  init: function(){
    this.initPreviousNCalendarViews(MAX_CACHE_SIZE);
    this.initNextNCalendarViews(MAX_CACHE_SIZE);
  },
  initNextNCalendarViews: function(n){
    var curMonth = this.currentCalendarView.calendar.getMonth(),
        curYear = this.currentCalendarView.calendar.getYear(),
        nextMonth, nextYear,
        nextNMonths = [];
    for(var i = 0; i < n; ++i){
      if(curMonth === CalendarView.LASTMONTH){
        nextMonth = CalendarView.FIRSTMONTH;
        nextYear = curYear+1;
      }
      else{
        nextMonth = curMonth+2;
        nextYear = curYear;
      }
      nextNMonths.push(new CalendarView(new Date(nextMonth+"/"+1+"/"+nextYear)));
      curMonth = nextMonth-1;
      curYear = nextYear;
    }
    for(var i=0; i < n; ++i){
      this.calendarViewStack.pushForward(nextNMonths.pop());
    }
  },
  initPreviousNCalendarViews: function(n){
    var prevMonth, prevYear,
        curMonth = this.currentCalendarView.calendar.getMonth(),
        curYear = this.currentCalendarView.calendar.getYear(),
        previousNMonths = [];
    for(var i = 0; i < n; ++i){
      if(curMonth === 0){
        prevMonth = CalendarView.LASTMONTH + 1;
        prevYear = curYear-1;
      }
      else{
        prevMonth = curMonth;
        prevYear = curYear;
      }
      previousNMonths.push(new CalendarView(new Date(prevMonth+"/"+1+"/"+prevYear)));
      curMonth = prevMonth-1;
      curYear = prevYear;
    }
    for(var i=0; i < n; ++i){
      this.calendarViewStack.pushBackward(previousNMonths.pop());
    }
  },
  getCurrentCalendarView: function(){
    return this.currentCalendarView.getCalendarView();
  },
  getNextCalendarView: function(){
    this.calendarViewStack.pushBackward(this.currentCalendarView);
    this.currentCalendarView = this.calendarViewStack.popForward();
    if (this.calendarViewStack.sizeFoward() == 0){
      this.initNextNCalendarViews(MAX_CACHE_SIZE);
    }
    return this.currentCalendarView.getCalendarView();
  },
  getPreviousCalendarView: function(){
    this.calendarViewStack.pushForward(this.currentCalendarView);
    this.currentCalendarView = this.calendarViewStack.popBackward();
    if (this.calendarViewStack.sizeBackward() == 0){
      this.initPreviousNCalendarViews(MAX_CACHE_SIZE);
    }
    return this.currentCalendarView.getCalendarView();
  }
};

console.log("imported");
