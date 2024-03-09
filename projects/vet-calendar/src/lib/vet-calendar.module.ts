import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VetCalendarComponent } from './vet-calendar.component';
import { VetCalendarDirective } from './vet-calendar.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    VetCalendarComponent,
    VetCalendarDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    VetCalendarComponent,
    VetCalendarDirective
  ]
})
export class VetCalendarModule { }
