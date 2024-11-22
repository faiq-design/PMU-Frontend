import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { SidebarComponent } from "../shared/sidebar/sidebar.component";
import { FooterComponent } from "../shared/footer/footer.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { TodoComponent } from "../apps/todo-list/todo/todo.component";
import { TodoListComponent } from "../apps/todo-list/todo-list.component";
import { MenuItemsComponent } from "../shared/menu-items/menu-items.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MegaMenuModule } from "primeng/megamenu";

import { LayoutRoutingModule } from "./layout-routing.module";
import { LayoutComponent } from "./layout/layout.component";
import { ChartsModule, ThemeService } from "ng2-charts";
import { MedicalRegistrationComponent } from "../medical-registration/medical-registration.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { InvoiceListComponent } from "./invoice-list/invoice-list.component";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { DialogModule } from "primeng/dialog";
import { HttpClientModule } from "@angular/common/http";
import { ToastModule } from "primeng/toast";
import { ViewInvoiceComponent } from "./view-invoice/view-invoice.component";
import { SharedModule } from "../shared/shared.module";
import { RecordsComponent } from "../records/records-component";
import { InvoiceSummaryComponent } from "./invoice-summary/invoice-summary.component";
import { FormatNumberDirective } from "./format-number.directive";
import { NotingPrintComponent } from "./view-invoice/noting-print-component/noting-print-component";
// import { AutoCompleteAllModule, DropDownListAllModule } from '@syncfusion/ej2-ng-dropdowns';
// import { MultiSelectAllModule } from '@syncfusion/ej2-ng-dropdowns';
// import { DataService } from './services/data.service';
// import { NgSelect2Module } from 'select2';

import { AutoCompleteModule } from "primeng/autocomplete";
import { NgSelectModule } from "@ng-select/ng-select";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgOptionHighlightModule } from "@ng-select/ng-option-highlight";
import { EditInvoiceComponent } from "./edit-invoice/edit-invoice.component";
import { CreateComplaintComponent } from "./create-complaint/create-complaint.component";
import { VendorListComponent } from "./vendor-list/vendor-list.component";
import { HospitalListComponent } from "./hospital-list/hospital-list.component";
import { ApproveComplaintComponent } from "./approve-complaint/approve-complaint.component";
import { ComplaintListComponent } from "./complaint-list/complaint-list.component";

import { ButtonModule } from "primeng/button";
import { SidebarModule } from "primeng/sidebar";
import { CalendarModule as PrimengCalendarModule } from "primeng/calendar";
import { CreateJanitorialInvoiceComponent } from "./create-janitorial-invoice/create-janitorial-invoice.component";
import { EditJanitorialInvoiceComponent } from "./edit-janitorial-invoice/edit-janitorial-invoice.component";
import { FormatNumberNewDirective } from "./format-number-new.directive";
import { LaundryListComponent } from "../laundry-list/laundry-list.component";
import { FeederCollectedComponent } from "../feeder-collected/feeder-collected.component";
import { FeederSentComponent } from "../feeder-sent/feeder-sent.component";
import { SatelliteReceivedComponent } from "../satellite-received/satellite-received.component";
import { MatIconModule } from "@angular/material/icon";

import { CreateSecurityInvoiceComponent } from "./create-security-invoice/create-security-invoice.component";
import { EditSecurityInvoiceComponent } from "./edit-security-invoice/edit-security-invoice.component";
import { GetAllReportsComponent } from "../get-all-reports/get-all-reports.component";
import { ViewHtmlReportComponent } from "../view-html-report/view-html-report.component";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { FeederLaundryOutComponent } from "./feeder-laundry-out/feeder-laundry-out.component";
import { FeederLaundryInComponent } from "./feeder-laundry-in/feeder-laundry-in.component";
import { SatelliteListComponent } from "../satellite-list/satellite-list.component";
import { SatelliteLaundryDetailsComponent } from "../satellite-laundry-details/satellite-laundry-details.component";
import { SatelliteSendComponent } from "../satellite-send/satellite-send.component";
import { FeederLaundryProductionComponent } from "./feeder-laundry-production/feeder-laundry-production.component";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { WorkingDaysComponent } from "./working-days/working-days.component";
import { CalendarHeaderComponent } from "./working-days/calendar-header/calendar-header.component";
import { DeploymentModalComponent } from "./deployment-modal/deployment-modal.component";
import { MatInputModule } from "@angular/material/input";

import { WorkingDaysNewComponent } from "./working-days-new/working-days-new.component";
import { CalendarHeaderNewComponent } from "./working-days-new/calendar-header/calendar-header-new.component";

import { MatDialogModule } from "@angular/material/dialog";
import { FieldHospitalComponent } from "../field-hospital/field-hospital.component";
import { HospitalListFieldComponent } from "./hospital-list-field/hospital-list-field.component";
import { SatelliteFeederListComponent } from "../satellite-feeder-list/satellite-feeder-list.component";
import { SatelliteFeederListDetailComponent } from "../satellite-feeder-list-detail/satellite-feeder-list-detail.component";

// import { SpreadSheetsModule } from "@mescius/spread-sheets-angular";

import { HospitalAssetStatusComponent } from "../hospital-asset-status/hospital-asset-status.component";

import { HrEmployeeListComponent } from "../hr-employee-list/hr-employee-list.component";
import { EmployeeLeaveRequestsComponent } from "../employee-leave-requests/employee-leave-requests.component";
import { EmployeesListComponent } from "../employees-list/employees-list.component";
import { AddEmployeeLeaveRequestsComponent } from "../add-employee-leave-requests/add-employee-leave-requests.component";

@NgModule({
  declarations: [
    LayoutComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    TodoListComponent,
    TodoComponent,
    MenuItemsComponent,
    LayoutComponent,
    MedicalRegistrationComponent,
    CreateInvoiceComponent,
    InvoiceListComponent,
    ViewInvoiceComponent,
    RecordsComponent,
    InvoiceSummaryComponent,
    FormatNumberDirective,
    NotingPrintComponent,
    EditInvoiceComponent,
    CreateComplaintComponent,
    VendorListComponent,
    HospitalListComponent,
    ApproveComplaintComponent,
    ComplaintListComponent,
    CreateJanitorialInvoiceComponent,
    EditJanitorialInvoiceComponent,
    FormatNumberNewDirective,
    FeederLaundryOutComponent,
    FeederLaundryInComponent,
    LaundryListComponent,
    FeederCollectedComponent,
    FeederSentComponent,
    SatelliteReceivedComponent,
    CreateSecurityInvoiceComponent,
    EditSecurityInvoiceComponent,
    GetAllReportsComponent,
    ViewHtmlReportComponent,
    UploadFileComponent,
    SatelliteListComponent,
    SatelliteLaundryDetailsComponent,
    SatelliteSendComponent,
    FeederLaundryProductionComponent,
    WorkingDaysComponent,
    CalendarHeaderComponent,
    DeploymentModalComponent,

    WorkingDaysNewComponent,
    CalendarHeaderNewComponent,

    FieldHospitalComponent,
    HospitalListFieldComponent,
    SatelliteFeederListComponent,
    SatelliteFeederListDetailComponent,
    HospitalAssetStatusComponent,
    HrEmployeeListComponent,
    EmployeeLeaveRequestsComponent,
    EmployeesListComponent,
    AddEmployeeLeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MegaMenuModule,
    DropdownModule,
    HttpClientModule,
    ToastModule,
    SharedModule,
    // MultiSelectAllModule,
    // DropDownListAllModule,
    // AutoCompleteAllModule
    // NgSelect2Module
    TableModule,
    DialogModule,
    AutoCompleteModule,
    NgSelectModule,
    NgOptionHighlightModule,
    MatFormFieldModule,
    MatSelectModule,
    ButtonModule,
    SidebarModule,
    PrimengCalendarModule,
    MatCardModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    // SpreadSheetsModule
  ],
  providers: [ThemeService],
})
export class LayoutModule {}
