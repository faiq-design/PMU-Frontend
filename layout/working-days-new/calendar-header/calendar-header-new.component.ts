import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CalendarView } from "angular-calendar";

@Component({
  selector: "app-calendar-header-new",
  templateUrl: "./calendar-header-new.component.html",
  styleUrls: ["./calendar-header-new.component.scss"],
})
export class CalendarHeaderNewComponent {
  @Input() view: CalendarView;

  @Input() viewDate: Date;

  @Input() locale: string = "en";

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;
}
