import { Directive, ElementRef, Injector, OnInit, Renderer2, ViewContainerRef, ViewChild, ChangeDetectorRef, AfterViewInit, ViewChildren, ContentChild, ContentChildren, Input, ComponentRef, HostListener } from '@angular/core';
import { VetCalendarComponent } from './vet-calendar.component';
import moment from "moment"

@Directive({
  selector: '[vetCalendarDir]',
  exportAs: "vet-calendar-dir",
})
export class VetCalendarDirective implements OnInit, AfterViewInit {

  @Input() noFuture: boolean;
  @Input() startRange: string;
  @Input() endRange: string;
  @Input() format: string;

  calendarWrapper: HTMLElement;
  calendarInputWrapper: HTMLElement;
  calendarComponentRef: ComponentRef<VetCalendarComponent>;

  constructor(private renderer: Renderer2, 
              private elementRef: ElementRef,
              private viewContainerRef: ViewContainerRef) { }

  /**
   * Update the dom arount the input to insert the calendar date picker
   */
  ngOnInit(): void {

    
    const inputElement = this.editInputElement();
    const parent = inputElement.parentNode;

    this.createCalendarWrapper();
    this.insertWrapper(this.calendarWrapper, parent, inputElement);
    
    this.createInputWrapper();
    this.insertWrapper(this.calendarInputWrapper, this.calendarWrapper, inputElement);

    this.initCalendarComponent(this.calendarWrapper, this.calendarInputWrapper);
  }

  /**
   * Pass the input set by the user to the calendar component and efit the font awesome icon
   */
  ngAfterViewInit(): void {
    

    this.calendarComponentRef.instance.noFuture = this.noFuture;
    if (this.startRange && this.endRange) {

      this.calendarComponentRef.instance.startRange = moment(this.startRange);
      this.calendarComponentRef.instance.endRange = moment(this.endRange);
    }

    this.editIcon();
  }

  /**
   * If the user click outside the calendar component then the calendar is hidden
   * @param event click event 
   */
  @HostListener('document:click', ['$event'])
  clickOut(event: any) {
    if (!this.calendarWrapper.contains(event.target)) {
      this.calendarComponentRef.instance.show = false;
    }
  }

  /**
   * Alter the input icon to display it at the right place
   */
  private editIcon() {

    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'width', '17px');
    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'height', '20px');
    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'top', '8px');
    this.renderer.setStyle(this.calendarComponentRef.instance.iconCalendar.nativeElement, 'right', '10px');
    this.renderer.appendChild(this.calendarInputWrapper, this.calendarComponentRef.instance.iconCalendar.nativeElement);
  }

  /**
   * Get the input element for which we want to add a date picker
   */
  private editInputElement() {

    const inputElement = this.elementRef.nativeElement;
    this.renderer.setStyle(inputElement, 'width', '210px');
    this.renderer.setStyle(inputElement, 'height', '100%');
    this.renderer.setStyle(inputElement, 'outline', 'none');
    this.renderer.setStyle(inputElement, 'border', '2px solid #dddddd');
    this.renderer.setStyle(inputElement, 'border-radius', '2px');
    this.renderer.setStyle(inputElement, 'padding', '0 12px');
    this.renderer.setStyle(inputElement, 'font-family', 'OpenSans, sans-serif');
    this.renderer.setStyle(inputElement, 'font-size:', '13px');
    this.renderer.setStyle(inputElement, 'color', '#101820');
    this.renderer.setStyle(inputElement, 'cursor', 'pointer');
    this.renderer.setStyle(inputElement, 'box-sizing', 'border-box'); 

    return inputElement;
  }

  /**
   * Create a wrapper around the input and the calendar component
   */
  private createCalendarWrapper(): void {

    this.calendarWrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.calendarWrapper, 'calendar__wrapper');
    this.renderer.setStyle(this.calendarWrapper, 'position', 'relative');
    this.renderer.setStyle(this.calendarWrapper, 'margin-bottom', '17px');
  }

  /**
   * Create a wrapper around the input and img tag
   */
  private createInputWrapper(): void {

    this.calendarInputWrapper = this.renderer.createElement('div');
    this.renderer.addClass(this.calendarInputWrapper, 'calendar__input-wrapper');
    this.renderer.setStyle(this.calendarInputWrapper, 'width', '212px');
    this.renderer.setStyle(this.calendarInputWrapper, 'position', 'relative');
    this.renderer.setStyle(this.calendarInputWrapper, 'height', '36px');
    this.renderer.setStyle(this.calendarInputWrapper, 'cursor', 'pointer');
  }

  /**
   * Wrap element with the wrapper
   * @param wrapper the wrapper to insert
   * @param parent the parent element of the wrapper
   * @param element the element which is wrapped
   */
  private insertWrapper(wrapper: HTMLElement, parent: HTMLElement, element: HTMLElement) {

    this.renderer.insertBefore(parent, wrapper, element);
    this.renderer.removeChild(parent, element);
    this.renderer.appendChild(wrapper, element);
  }

  /**
   * Create the calendar component and perform some initalization work
   * @param calendarWrapper the calendar wrapper
   * @param calendarInputWrapper the input wrapper
   */
  private initCalendarComponent(calendarWrapper: HTMLElement, calendarInputWrapper: HTMLElement) {

    // Create the calendar component
    this.calendarComponentRef = this.viewContainerRef.createComponent(VetCalendarComponent, { index: 0 });  
    this.renderer.appendChild(calendarWrapper, this.calendarComponentRef.location.nativeElement);
    
    // If we click outside the date picker we want to hide it
    calendarInputWrapper.addEventListener('click', () => {
      this.calendarComponentRef.instance.show = !this.calendarComponentRef.instance.show;
    });

    // Subscribe to the selected date by the date picker and update the input value
    this.calendarComponentRef.instance.selectedDateObservable.subscribe((selectedDate: moment.Moment) => {
      this.elementRef.nativeElement.value = selectedDate.format(this.format);
    });
  }
}
