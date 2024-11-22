import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { MedicalRegistrationComponent } from "../medical-registration/medical-registration.component";
import { CreateInvoiceComponent } from "./create-invoice/create-invoice.component";
import { InvoiceListComponent } from "./invoice-list/invoice-list.component";
import { ViewInvoiceComponent } from "./view-invoice/view-invoice.component";
import { RecordsComponent } from "../records/records-component";
import { InvoiceSummaryComponent } from "./invoice-summary/invoice-summary.component";
import { EditInvoiceComponent } from "./edit-invoice/edit-invoice.component";
import { CreateComplaintComponent } from "./create-complaint/create-complaint.component";
import { VendorListComponent } from "./vendor-list/vendor-list.component";
import { HospitalListComponent } from "./hospital-list/hospital-list.component";
import { ApproveComplaintComponent } from "./approve-complaint/approve-complaint.component";
import { ComplaintListComponent } from "./complaint-list/complaint-list.component";
import { CreateJanitorialInvoiceComponent } from "./create-janitorial-invoice/create-janitorial-invoice.component";
import { EditJanitorialInvoiceComponent } from "./edit-janitorial-invoice/edit-janitorial-invoice.component";
import { LaundryListComponent } from "../laundry-list/laundry-list.component";
import { FeederCollectedComponent } from "../feeder-collected/feeder-collected.component";
import { FeederSentComponent } from "../feeder-sent/feeder-sent.component";
import { SatelliteReceivedComponent } from "../satellite-received/satellite-received.component";
import { EditSecurityInvoiceComponent } from "./edit-security-invoice/edit-security-invoice.component";
import { CreateSecurityInvoiceComponent } from "./create-security-invoice/create-security-invoice.component";
import { GetAllReportsComponent } from "../get-all-reports/get-all-reports.component";
import { ViewHtmlReportComponent } from "../view-html-report/view-html-report.component";
import { UploadFileComponent } from "../upload-file/upload-file.component";
import { FeederLaundryOutComponent } from "./feeder-laundry-out/feeder-laundry-out.component";
import { FeederLaundryInComponent } from "./feeder-laundry-in/feeder-laundry-in.component";
import { SatelliteListComponent } from "../satellite-list/satellite-list.component";
import { SatelliteLaundryDetailsComponent } from "../satellite-laundry-details/satellite-laundry-details.component";
import { SatelliteSendComponent } from "../satellite-send/satellite-send.component";
import { FeederLaundryProductionComponent } from "./feeder-laundry-production/feeder-laundry-production.component";
import { WorkingDaysComponent } from "./working-days/working-days.component";

import { WorkingDaysNewComponent } from "./working-days-new/working-days-new.component";

import { FieldHospitalComponent } from "../field-hospital/field-hospital.component";
import { HospitalListFieldComponent } from "./hospital-list-field/hospital-list-field.component";
import { SatelliteFeederListComponent } from "../satellite-feeder-list/satellite-feeder-list.component";
import { SatelliteFeederListDetailComponent } from "../satellite-feeder-list-detail/satellite-feeder-list-detail.component";
import { HospitalAssetStatusComponent } from "../hospital-asset-status/hospital-asset-status.component";
import { HrEmployeeListComponent } from "../hr-employee-list/hr-employee-list.component";
import { EmployeeLeaveRequestsComponent } from "../employee-leave-requests/employee-leave-requests.component";
import { EmployeesListComponent } from "../employees-list/employees-list.component";
import { AddEmployeeLeaveRequestsComponent } from "../add-employee-leave-requests/add-employee-leave-requests.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
      },
      { path: "dashboard", component: DashboardComponent },
      { path: "shop-card", component: MedicalRegistrationComponent },

      { path: "records", component: RecordsComponent },

      { path: "create-invoice", component: CreateInvoiceComponent },
      {
        path: "create-janitorial-invoice",
        component: CreateJanitorialInvoiceComponent,
      },
      {
        path: "create-security-invoice",
        component: CreateSecurityInvoiceComponent,
      },
      { path: "invoice-list", component: InvoiceListComponent },
      { path: "view-invoice/:id", component: ViewInvoiceComponent },
      { path: "edit-invoice/:id", component: EditInvoiceComponent },
      {
        path: "edit-janitorial-invoice/:id",
        component: EditJanitorialInvoiceComponent,
      },
      {
        path: "edit-security-invoice/:id",
        component: EditSecurityInvoiceComponent,
      },
      { path: "invoice-summary", component: InvoiceSummaryComponent },

      {
        path: "create-complaint/:serviceId",
        component: CreateComplaintComponent,
      },
      { path: "approve-complaint/:id", component: ApproveComplaintComponent },
      { path: "complaint-list", component: ComplaintListComponent },
      { path: "calendar-view", component: WorkingDaysComponent },
      { path: "calendar-view-new", component: WorkingDaysNewComponent },

      { path: "vendor-list", component: VendorListComponent },
      { path: "hospital-list", component: HospitalListComponent },
      { path: "hospital-list-field", component: HospitalListFieldComponent },
      { path: "feeder-laundry-out", component: FeederLaundryOutComponent },
      { path: "feeder-laundry-in", component: FeederLaundryInComponent },
      {
        path: "feeder-laundry-production",
        component: FeederLaundryProductionComponent,
      },

      { path: "laundry-list", component: LaundryListComponent },
      { path: "feeder-collected/:id", component: FeederCollectedComponent },
      { path: "feeder-sent/:id", component: FeederSentComponent },
      { path: "satellite-received/:id", component: SatelliteReceivedComponent },
      { path: "get-all-reports", component: GetAllReportsComponent },
      { path: "get-all-reports/:reportId", component: GetAllReportsComponent },

      { path: "dashboard_data_html", component: ViewHtmlReportComponent },
      {
        path: "dashboard_data_html/:reportId",
        component: ViewHtmlReportComponent,
      },
      { path: "upload-file", component: UploadFileComponent },
      { path: "satellite-list", component: SatelliteListComponent },
      {
        path: "satellite-laundry-details/:id",
        component: SatelliteLaundryDetailsComponent,
      },
      { path: "satellite-send", component: SatelliteSendComponent },
      { path: "field-hospital", component: FieldHospitalComponent },
      {
        path: "satellite-feeder-list",
        component: SatelliteFeederListComponent,
      },
      {
        path: "satellite-feeder-list-detail/:id",
        component: SatelliteFeederListDetailComponent,
      },
      {
        path: "hospital-asset-status",
        component: HospitalAssetStatusComponent,
      },
      { path: "hr-employee-list", component: HrEmployeeListComponent },
      {
        path: "employee-leave-requests",
        component: EmployeeLeaveRequestsComponent,
      },
      {path:"add-employee-leave-requests", component:AddEmployeeLeaveRequestsComponent},
      {
        path: "employees-list", component:EmployeesListComponent
      },
      {
        path: "basic-ui",
        loadChildren: () =>
          import("../basic-ui/basic-ui.module").then((m) => m.BasicUiModule),
      },
      {
        path: "charts",
        loadChildren: () =>
          import("../charts/charts.module").then((m) => m.ChartsDemoModule),
      },
      {
        path: "forms",
        loadChildren: () =>
          import("../forms/form.module").then((m) => m.FormModule),
      },
      {
        path: "tables",
        loadChildren: () =>
          import("../tables/tables.module").then((m) => m.TablesModule),
      },
      {
        path: "icons",
        loadChildren: () =>
          import("../icons/icons.module").then((m) => m.IconsModule),
      },
      {
        path: "general-pages",
        loadChildren: () =>
          import("../general-pages/general-pages.module").then(
            (m) => m.GeneralPagesModule
          ),
      },
      {
        path: "apps",
        loadChildren: () =>
          import("../apps/apps.module").then((m) => m.AppsModule),
      },
      {
        path: "user-pages",
        loadChildren: () =>
          import("../user-pages/user-pages.module").then(
            (m) => m.UserPagesModule
          ),
      },
      {
        path: "error-pages",
        loadChildren: () =>
          import("../error-pages/error-pages.module").then(
            (m) => m.ErrorPagesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
