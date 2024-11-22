import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
// import { DashboardService } from "../../dashboard.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
// import { Config } from "src/assets/config";
import { DatePipe } from '@angular/common';
import {
  CalendarEvent,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
} from "angular-calendar";
import * as moment from "moment";
import { Subject } from "rxjs";
import { getYear } from "date-fns";
import { DeploymentModalComponent } from "../deployment-modal/deployment-modal.component";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { InvoiceService } from "../invoice.service";

@Component({
  selector: "'app-working-days",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./working-days.component.html",
  styleUrls: ["./working-days.component.scss"],
  providers: [DatePipe]
})
export class WorkingDaysComponent implements OnInit {
  loadingData: boolean;
  selectedMonth: any = new Date().getMonth() + 1;
  selectedYear: any = new Date().getFullYear();
  hospitalList = [
    // {id: 1, title: "hospital 1"},
    // {id: 2, title: "hospital 2"},
  ];
  selectedHospital : any = {} ;
  selectedHospitalId: number | null = null; // Holds the selected hospital's id
  month: any;
  year: any;
  monthList = [
    { key: 1, value: "January" },
    { key: 2, value: "February" },
    { key: 3, value: "March" },
    { key: 4, value: "April" },
    { key: 5, value: "May" },
    { key: 6, value: "June" },
    { key: 7, value: "July" },
    { key: 8, value: "August" },
    { key: 9, value: "September" },
    { key: 10, value: "October" },
    { key: 11, value: "November" },
    { key: 12, value: "December" },
  ];
  MAX_DATE = new Date();
 CURRENT_YEAR =this.MAX_DATE.getFullYear();
  PREVIOUS_YEAR = moment().subtract(1, "year").year();
NEXT_YEAR = moment().add(1, "year").year();
  yearList = [
    { key: this.PREVIOUS_YEAR, value: this.PREVIOUS_YEAR },
    { key:  this.CURRENT_YEAR, value:  this.CURRENT_YEAR },
    { key: this. NEXT_YEAR, value:  this.NEXT_YEAR },
  ];
 
  tableData: any = [];
  pickerDate: any = [];
  datePicker: any = [];
  dateArray: any = [];
  // dateArray: any = [
  //   { date: "2021-06-09", value: "Y" },
  //   { date: "2021-06-13", value: "Y" },
  //   { date: "2021-07-01", value: "Y" },
  //   { date: "2021-07-02", value: "Y" },
  //   { date: "2021-07-03", value: "Y" },
  //   { date: "2021-07-07", value: "Y" },
  //   { date: "2021-07-10", value: "Y" },
  //   { date: "2021-07-11", value: "Y" },
  // ];
  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  loadingPage: boolean = false;
  eventsNew: any = [];
  events2: any = [];
  startDate: string;
  endDate: string;

  ngOnInit() {
    // this.getWorkingDays();
    this.getAllHospitals();
  }
  modalRef: NgbModalRef;
  private yesterday: Date;
  private yesterday2: Date;
  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    public _dialog: MatDialog, private modalService: NgbModal,private datePipe: DatePipe,
    private invoiceService: InvoiceService,
  ) {
    this.initializeYesterday();
    this.initializeEvents();
  }
  private initializeYesterday() {
    this.yesterday = new Date();
    this.yesterday2 = new Date();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    this.yesterday2.setDate(this.yesterday.getDate() - 14);
  }

  private initializeEvents() {
    let colors = {
      red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
      },
      blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
      },
      yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
      }
    };
    this.events = [
      {
        id: 1,
        title: 'Editable event',
        color: colors.yellow,
        start: this.yesterday,
        actions: [
          {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              console.log('Edit event', event);
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Deletable event',
      //  color: colors.blue,
        start: this.yesterday2,
        actions: [
          {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
              this.events = this.events.filter(iEvent => iEvent !== event);
              console.log('Event deleted', event);
            }
          }
        ]
      },
      {
        id: 3,
        title: 'Non editable and deletable event',
        color: colors.red,
        start: this.yesterday
      }
    ];
  }

  // beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
  //   renderEvent.body.forEach((day) => {
  //     if (day.inMonth) {
  //       const dayOfMonth = moment(day.date).format("YYYY-MM-DD");
  //       const i = this.dateArray.findIndex((e) => e.date == dayOfMonth);
  //       if (i > -1 && this.dateArray[i].value == "Y") {
  //         day.cssClass = "bg-grey";
  //       } else if (i > -1 && this.dateArray[i].value == "N") {
  //         day.cssClass = "bg-red";
  //       }
  //     }
  //   });
  // }
  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      const dayOfWeek = moment(day.date).day(); // Sunday is 0
      if (day.inMonth) {
        if (dayOfWeek === 0) {
          // Mark Sundays with red color and non-editable
          day.cssClass = 'bg-red non-editable';
        } else {
          // Mark other days with green color
          day.cssClass = 'bg-green';
        }
      }
    });
  }
  // changeStatus(day) {
  //   debugger;
  //   if (day.inMonth) {
  //     const dayOfMonth = moment(day.date).format("YYYY-MM-DD");
  //     const i = this.dateArray.findIndex((e) => e.date == dayOfMonth);
  //     if (i > -1) {
  //       const obj = {
  //         date: dayOfMonth,
  //         value: this.dateArray[i].value == "Y" ? "N" : "Y",
  //         month: moment(day.date).format("MM"),
  //         year: moment(day.date).format("YYYY"),
  //         userId: localStorage.getItem("user_id"),
  //       };
  //       //this.dateArray.splice(i, 1, obj);
  //       this.updateWorkingDays(obj);
  //     } else {
  //       const obj = {
  //         date: dayOfMonth,
  //         value: "Y",
  //         month: moment(day.date).format("MM"),
  //         year: moment(day.date).format("YYYY"),
  //         userId: localStorage.getItem("user_id"),
  //       };
  //       //this.dateArray.push(obj);
  //       this.updateWorkingDays(obj);
  //     }
  //     console.log(this.dateArray);
  //     this.refresh.next();
  //   }
  // }

  // getWorkingDays() {
  //   this.loadingData = true;
  //   this.viewDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
  //   const obj = {
  //     month: this.selectedMonth ? this.selectedMonth : -1,
  //     year: this.selectedYear ? this.selectedYear : -1,
  //     userId: localStorage.getItem("user_id"),
  //   };
  //   debugger;
  //   this.httpService.getWorkingDays(obj).subscribe(
  //     (data) => {
  //       debugger;
  //       this.tableData = data;
  //       this.dateArray = data;
  //       this.loadingData = false;
  //       this.refresh.next();
  //     },
  //     (error) => {
  //       debugger;
  //       this.toastr.error(error.message, "Error");
  //       this.loadingData = false;
  //     }
  //   );
  // }

  // updateWorkingDays(obj) {
  //   this.loadingData = true;
  //   this.httpService.updateWorkingDays(obj).subscribe(
  //     (data: any) => {
  //       this.toastr.success(data.message);
  //       this.loadingData = false;
  //       this.getWorkingDays();
  //     },
  //     (error) => {
  //       debugger;
  //       this.toastr.error(error.message, "Error");
  //       this.loadingData = false;
  //     }
  //   );
  // }

  dayClicked(mediumModalContent, event){
    this.location= "";
    console.log("changeStatus event: ",event);

    const dayOfWeek = moment(event.date).day(); // Sunday is 0
    if (event.inMonth && dayOfWeek !== 0 &&  this.selectedYear && this.selectedMonth && this.selectedHospitalId) {

      debugger;
      console.log("changeStatus event.date: ",event.date);
      console.log("changeStatus event.day: ",event.day);
      console.log("changeStatus event.events: ",event.events);
      this.eventsNew = event.events;
      // this.depDate = day.date;
       this.depDate = this.datePipe.transform(event.date, 'yyyy-MM-dd');
       this.updateSelectedHospital();
       this.hospitalTitle = this.selectedHospital?.title;
       this.location = this.eventsNew[0]?.title;
      console.log(this.depDate ); // Outputs: 2024-08-29
      this.modalRef = this.modalService.open(mediumModalContent);

    } else {
      console.log("Sundays are non-editable.");
    }
  }

  // getWorkingDays(){
  //   this.viewDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
  // }

  location= "";
  hospitalTitle= "";
  depDate : any;
  saveDep(){
    if(this.eventsNew?.length<1){
      console.log("inn save dep: ");

      const eventDate = new Date(this.depDate);
      const obj : any= {
        id : 45,
        title : this.location,
        start: eventDate
      }
   
            console.log("obj: ", obj);
            console.log("old this.events: ",this.events);
            this.events = this.replaceOrAddObjectInArray(this.events, obj);
            console.log("new this.events: ",this.events);
            this.refresh.next(); 
            // to close specific modal
        if (this.modalRef) {
          this.modalRef.close();
        }
      //       this.loadingData = false;
      //     }
      //     this.loadingData= false;
      //   },
      //   (error: any) => {
      //     console.log("Error");
      //     this.loadingData = false;
      //   }
      // );
    }
    else{
      console.log("inn edit dep: ");
  
        // Convert the date string to a Date object
    const eventDate = new Date(this.depDate);
      const obj : any= {
        id : this.eventsNew[0].id,
        title : this.location,
        start: eventDate
      }
    
            console.log("obj: ", obj);
            console.log("old this.events: ",this.events);
            this.events = this.replaceOrAddObjectInArray(this.events, obj);
            console.log("new this.events: ",this.events);
            this.refresh.next(); 
        if (this.modalRef) {
          this.modalRef.close();
        }

    }
  }

  saveDepOld(){
    if(this.eventsNew?.length<1){
      console.log("inn save dep: ");
      const obj : any= {
        deploymentLocation : this.location,
        deploymentDate: this.depDate,
        hospitalId : this.selectedHospitalId
      }
      console.log("obj: ", obj);
      const eventDate = new Date(this.depDate);
 
      this.loadingData = true;
      this.invoiceService.saveDeployment(obj).subscribe(
        (response) => {
          if (response) {
            const depId = response;
            // obj.id = depData?.id;
            const objNew : any= {
              id : depId,
              title : this.location,
              start: eventDate
            }
            console.log("response: ", response);
            console.log("objNew: ", objNew);
            console.log("old this.events: ",this.events);
            this.events = this.replaceOrAddObjectInArray(this.events, objNew);
            console.log("new this.events: ",this.events);
            this.refresh.next(); 
            // to close specific modal
        if (this.modalRef) {
          this.modalRef.close();
        }
            this.loadingData = false;
          }
          this.loadingData= false;
        },
        (error: any) => {
          console.log("Error");
          this.loadingData = false;
        }
      );
    }
    else{
      console.log("in edit dep: ");
      const obj : any= {
        id : this.eventsNew[0].id,
        deploymentLocation : this.location,
        deploymentDate: this.depDate,
        hospitalId : this.selectedHospitalId
      }
      console.log("obj: ", obj);
        // Convert the date string to a Date object
    const eventDate = new Date(this.depDate);
 
      this.loadingData = true;
      this.invoiceService.editDeployment(obj).subscribe(
        (response) => {
          if (response) {
            const depData = response;
            // obj.id = depData?.id;
            console.log("response: ", response);
            const objNew : any= {
              id : this.eventsNew[0].id,
              title : this.location,
              start: eventDate
            }
            console.log("obj: ", objNew);
            console.log("old this.events: ",this.events);
            this.events = this.replaceOrAddObjectInArray(this.events, objNew);
            console.log("new this.events: ",this.events);
            this.refresh.next(); 
            // to close specific modal
        if (this.modalRef) {
          this.modalRef.close();
        }
            this.loadingData = false;
          }
          this.loadingData= false;
        },
        (error: any) => {
          console.log("Error");
          this.loadingData = false;
        }
      );
    }
  }

  // replaceObjectInArray(array: any[], newObject: any): any[] {
  //   return array.map(item => item.id === newObject.id ? newObject : item);
  // }
  replaceOrAddObjectInArray(array: any[], newObject: any): any[] {
    
    const found = array.some(item => item.id == newObject.id);
  
    if (found) {
      return array.map(item => item.id == newObject.id ? newObject : item);
    } else {
      return [...array, newObject];
    }
  }
  
  

  updateSelectedHospital() {
    if (this.selectedHospitalId) {
      this.selectedHospital = this.hospitalList.find(hospital => hospital.id == this.selectedHospitalId);
      console.log(this.selectedHospital); // Now this will print the selected hospital object
      console.log(this.selectedHospital.title); // This will give the correct hospital title
    }
  }

  getAllHospitals() {
    debugger;
    this.loadingPage = true;
    debugger;
    this.invoiceService.getAllHospitals().subscribe(
      (response) => {
        if (response) {
          const hospitalList = response;
          this.hospitalList = hospitalList.filter(h=> h.type == 'LFH' || h.type == 'SFH');
          console.log(" this.hospitalList: ", this.hospitalList);
          debugger;
          this.loadingPage = false;
        }
        this.loadingPage= false;
      },
      (error: any) => {
        console.log("Error");
        this.loadingPage = false;
      }
    );
  }

  getDeploymentData() {
    this.viewDate = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    console.log("this.viewDate: ",this.viewDate);
    this.calculateMonthStartAndEnd(this.viewDate);
    this.loadingPage = true;
    this.invoiceService.getDeploymentData(this.startDate, this.endDate, this.selectedHospitalId).subscribe(
      (response) => {
        if (response) {
          this.events2 = response;
          console.log(" this.events2: ", this.events2);
          this.transformArray();
          this.loadingPage = false;
        }
        this.loadingPage= false;
      },
      (error: any) => {
        console.log("Error");
        this.loadingPage = false;
      }
    );
  }

  calculateMonthStartAndEnd(viewDate: Date) {
    // Get the first day of the month
    const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);

    // Get the last day of the month
    const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

    // Format the dates using DatePipe
    this.startDate = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    console.log('Start Date:', this.startDate); // Outputs: 2024-05-01
    console.log('End Date:', this.endDate);     // Outputs: 2024-05-31
  }

  transformArray(){
    this.events = this.events2.map(deployment => ({
      id: deployment.id,
      title: deployment.deploymentLocation,          // Change deploymentLocation to title
      start: new Date(deployment.deploymentDate)     // Convert deploymentDate string to Date object
    }));
    
    console.log(" this.events: ", this.events);
    this.refresh.next();
   
    
  }
}
