import {Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import moment from "moment"
import { BehaviorSubject } from 'rxjs';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export interface CalendarDate {
  mDate: moment.Moment;
  selected?: boolean;
  today?: boolean;
}

@Component({
  selector: 'vet-calendar',
  templateUrl: './vet-calendar.component.html',
  styleUrl: './vet-calendar.component.scss'
})
export class VetCalendarComponent implements OnInit {

  // reference to the font awesome icone 
  @ViewChild('iconCalendar', { read: ElementRef }) iconCalendar: ElementRef;
  
  // Inputs set by the user
  noFuture: boolean;
  startRange: moment.Moment;
  endRange: moment.Moment;

  // The icon calendar
  faCalendarAlt = faCalendarAlt;

  public currentDate: moment.Moment; // the current date we which to diplay of the calendar 
  public namesOfDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // the names of the week to display
  public weeks: Array<CalendarDate[]> = []; // Contains a array for each week to display to the user

  private selectedDate: BehaviorSubject<moment.Moment> = new BehaviorSubject<moment.Moment>(moment()); // Emit new value when the user select a new date
  public selectedDateObservable = this.selectedDate.asObservable(); // Observable derived from selectedDate
  public show: boolean; // Show or hide the date picker / calendar

  ngOnInit() {
    this.generateCalendar();
  }

  /**
   * Initialize variables
   */
  constructor() {
    this.currentDate = moment(); // current date is today
    this.selectedDate.next(moment(this.currentDate)); 
    this.show = false;
   }

   /**
    * Go to previous month in the calendar that is the current date is today minus one month
    * We need to regenerate the calendar after that
    */
   public prevMonth(): void {
    this.currentDate = moment(this.currentDate).subtract(1, 'months');
    this.generateCalendar();
  }
  
  /**
   * Go to next month in the calendar that is the current date is today plus one month
   * We need to regenerate the calendar after that
   */
  public nextMonth(): void {
    this.currentDate = moment(this.currentDate).add(1, 'months');
    this.generateCalendar();
  }

  /**
   * Can we go to next month or not. Is noFuture is set to true we cannot go to months in the future
   * @param currentDate the current date of the calendar
   * @returns 
   */
  public isDisabledMonth(currentDate: moment.Moment): boolean {
    const today = moment();
    if (this.noFuture) {
      return !moment(currentDate).isBefore(today, 'months');
    }
    return false;
  }
  
  /**
   * Depending about the user inputs (noFuture, startRange, endRange) can we select the date or not
   * @param date the date we want to check against
   * @returns 
   */
  public isDisabledDate(date: moment.Moment): boolean {
    const today = moment();

    if (this.startRange && this.endRange) {

      return !(moment(date).isSame(this.currentDate, 'month') &&
               moment(date).isSameOrBefore(this.endRange) &&
               moment(date).isSameOrAfter(this.startRange))
    } else if (this.noFuture) {

      return !(moment(date).isSame(this.currentDate, 'month') &&
               moment(date).isSameOrBefore(today));
    } else {
      !moment(date).isSame(this.currentDate, 'month')
    }

    return false;
  }

  /**
   * The user has selcted a date so we update our subject and hide the calendar
   * @param date the date to select
   */
  public selectDate(date: CalendarDate) {
    this.selectedDate.next(moment(date.mDate));
    this.generateCalendar();
    this.show = !this.show;
  }

  /**
   * We initialize our dates and weeks variables which are useful to know 
   * whath dates we are going to display to the user
   */
   private generateCalendar(): void {
    const dates = this.fillDates(this.currentDate); // get all the dates we are currently dipsplaying
    const weeks = [];
    // For each week we want to display we create an array in the weeks array 
    // with the dates corresponding to the week in question
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  /**
   * Generate all the dates we want to display
   * @param currentMoment 
   * @returns 
   */
  private fillDates(currentMoment: moment.Moment) {
    const firstOfMonth = moment(currentMoment).startOf('month').day(); // Get the index of the first day of the month
    const lastOfMonth = moment(currentMoment).endOf('month').day();// Get the index of the last day of the month
    
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days'); // Get the first day we wich to display
    const lastDayOfGrid = moment(currentMoment).endOf('month').subtract(lastOfMonth, 'days').add(6, 'days'); // Get the last day we wich to display
    const startCalendar = firstDayOfGrid.date(); // get the date of the first day of the grid
    
    // Get all the dates we want to display 
    const range = this.arrayRange(startCalendar, startCalendar + lastDayOfGrid.diff(firstDayOfGrid, 'days'), 1)
    return range.map((date: number) => {
      const newDate = moment(firstDayOfGrid).date(date);
      return {
        today: this.isToday(newDate),
        selected: this.isSelected(newDate),
        mDate: newDate,
      };
    });
  }

  /**
   * Is the date corresponding to today or not
   * @param date the date to test
   * @returns 
   */
  private isToday(date: moment.Moment): boolean {
    return moment().isSame(moment(date), 'day');
  }

  /**
   * Is the date corresponding to the selected date or not
   * @param date the date to test
   * @returns 
   */
  private isSelected(date: moment.Moment): boolean {
    const value = this.selectedDate.getValue();
    return value.isSame(moment(date));
}

  /**
   * Generate a array with values between start and stop and incremented by step
   */
  private arrayRange(start: number, stop: number, step: number) {

    return Array.from(
      { length: (stop - start) / step + 1 },
      (value, index) => start + index * step
      );
  }
    
}
