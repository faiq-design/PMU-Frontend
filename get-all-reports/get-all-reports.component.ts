import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
} from "@angular/core";
import { InvoiceService } from "../layout/invoice.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

@Component({
  selector: "app-get-all-reports",
  templateUrl: "./get-all-reports.component.html",
  styleUrls: ["./get-all-reports.component.scss"],
})
export class GetAllReportsComponent implements OnInit {
  loading: boolean;
  loadingPage: boolean;
  selectedFileType: string = "xls";
  reportId = -1;
  queryList: any = [];
  selectedQuery: any = {};
  title = "";
  hospitalLists: any = [];
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  startDate: string;
  endDate: string;
  singleDate = new Date();
  selectedReportUrl = "";

  reportData: any = {};
  @ViewChild("successNotification", { read: TemplateRef })
  successNotification: TemplateRef<any>;
  hospitalList: any = [];
  vendorList: any = [];
  selectedHospital = -1;
  selectedVendor: any;
  userInfo: any = {};
  hospitalId: Number;
  vendorId: Number;
  departmentList: any = [];
  employeeList: any = [];
  selectedDepartment:any;
  selectedEmployee:any;

  constructor(
    private invoiceService: InvoiceService,
    private viewContainerRef: ViewContainerRef,
    private activatedRoutes: ActivatedRoute,
    private toastr: ToastrService
  ) {
    const today = new Date();
    this.startDate = today.toISOString().split("T")[0];
    this.endDate = today.toISOString().split("T")[0];
    this.hospitalList = JSON.parse(localStorage.getItem("hospitals"));
    this.vendorList = JSON.parse(localStorage.getItem("vendors"));
    this.userInfo =  JSON.parse(localStorage.getItem("userInfo"));
  }

  ngOnInit(): void {
    this.getAllDepartments();
    this.getAllEmployees();
    this.activatedRoutes.params.subscribe((params) => {
      if (params.reportId) {
        this.reportId = params.reportId;
      }
      this.getReportById(this.reportId);
    });
  }

  downloadReports(): void {
    this.loading = true;
    this.invoiceService.getAllReports(this.getReportDataObj()).subscribe(
      (data) => {
        debugger;
        const res: any = data;
        console.log(data);

        if (res) {
          const obj2 = {
            key: res.key,
            fileType: res.fileType,
          };

          // Determine the URL based on the file type
          if (this.selectedQuery.type == 1) {
            this.selectedReportUrl = "download-csv-Report";
            this.getproductivityDownload(obj2, this.selectedReportUrl);
          } else {
            this.selectedReportUrl = "download-csv-Report";
            this.getproductivityDownloadNew(obj2, this.selectedReportUrl);
          }

          // Call the method to download the file
        } else {
          this.toastr.info(
            "Something went wrong,Please retry",
            "Connectivity Message"
          );
        }

        // Display the success notification
        this.viewContainerRef.createEmbeddedView(this.successNotification);
        setTimeout(() => {
          this.viewContainerRef.clear();
        }, 10000); // Hide the notification after 10 seconds
      },
      (error) => {
        console.error("Error downloading the file", error);
        this.loading = false;
      }
    );
  }

  getReportById(reportId: number): void {
    debugger;
    this.loading = true;
    this.invoiceService.getReportById(reportId).subscribe(
      (data: any) => {
        if (data) {
          this.reportData = data;
          console.log("Report data:", this.reportData);
          this.queryList = data;
          this.loadQuery(reportId);
        }
        // Handle successful response
        console.log("Report data:", data); // Assuming parameterList is where your query data resides
        this.loading = false;
      },
      (error) => {
        // Handle error
        console.error("Error fetching report", error);
        this.loading = false;
        // Handle error notification using toastr or other means
        this.toastr.error("Error fetching report", "Error");
      }
    );
  }

  getAllHospitals() {
    this.loading = true;
    this.invoiceService.getAllHospitals().subscribe(
      (response) => {
        if (response) {
          this.hospitalList = response;
          console.log(" this.hospitalList: ", this.hospitalList);
          this.loading = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loading = false;
      }
    );
  }

  getAllVendors() {
    this.loading = true;
    this.invoiceService.getAllVendors().subscribe(
      (response) => {
        if (response) {
          this.vendorList = response;
          console.log(" this.vendorList: ", this.vendorList);
          this.loading = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loading = false;
      }
    );
  }
  loadQuery(reportId: number) {
    debugger;
    this.selectedQuery = this.queryList;
    if (reportId > -1) {
      this.title = this.selectedQuery.title;
    } else {
      this.title = "Raw Data";
    }
    this.setparamsVisibility(-1);
  }
  setparamsVisibility(parentId) {
    debugger;

    for (let i = 0; i < this.selectedQuery.parameterList.length; i++) {
      if (this.selectedQuery.parameterList[i].parentId == parentId) {
        if (parentId > -1) {
          // this.loadFilters(i);
        }
        this.selectedQuery.parameterList[i].isVisible = true;
      }
    }
  }
  getReportDataObj() {
    let obj: any = {};
    obj.queryId = this.reportId;
    if (this.selectedQuery.parameterList) {
      for (const param of this.selectedQuery.parameterList) {
        if (param.populatedFrom == "Hospital") {
          obj.Hospital =
            this.selectedHospital == -1
              ? this.hospitalList.map((obj) => obj.id).join(",")
              : this.selectedHospital;
        } else if (param.populatedFrom == "Vendor") {
          obj.Vendor = !this.selectedVendor
            ? this.vendorId
            : this.selectedVendor;
        } else if (param.populatedFrom == "start_date") {
          obj.start_date = moment(this.startDate).format("YYYY-MM-DD");
        } else if (param.populatedFrom == "end_date") {
          obj.end_date = moment(this.endDate).format("YYYY-MM-DD");
        } else if (param.populatedFrom == "date") {
          obj.date = moment(this.singleDate).format("YYYY-MM-DD");
        } else if (param.populatedFrom == "Department") {
          obj.Department =
            this.selectedDepartment == -1
              ? this.departmentList.map((obj) => obj.id).join(",")
              : this.selectedDepartment;
        } else if (param.populatedFrom == "Employee") {
          obj.Employee =
            this.selectedEmployee == -1
              ? this.employeeList.map((obj) => obj.id).join(",")
              : this.selectedEmployee;
        }
      }
    }
    return obj;
  }

  getproductivityDownload(obj: { key: any; fileType: any }, url: string) {
    this.invoiceService.downloadResource(obj).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: obj.fileType === "zip" ? "application/zip" : "text/csv",
        });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download =
          obj.key.split("_")[0] + (obj.fileType === "zip" ? ".zip" : ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loading = false;
      },
      (error) => {
        console.error("Error downloading the file", error);
        this.loading = false;
        this.toastr.error("Error downloading the report", "Error");
      }
    );
  }

  getproductivityDownloadNew(obj: { key: any; fileType: any }, url: string) {
    this.invoiceService.downloadResource(obj).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], {
          type: obj.fileType === "xlsx" ? "application/xlsx" : "text/xlsx",
        });
        const downloadURL = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download =
          obj.key.split("_")[0] + (obj.fileType === "xlsx" ? ".xlsx" : ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loading = false;
      },
      (error) => {
        console.error("Error downloading the file", error);
        this.loading = false;
        this.toastr.error("Error downloading the report", "Error");
      }
    );
  }

  getAllDepartments() {
    this.loading = true;
    const deptId = this.userInfo?.deptId || -1;
    this.invoiceService.getAllDepartments(deptId).subscribe(
      (response) => {
        if (response) {
          this.departmentList = response;
      //     console.log(" this.departmentList: ", this.departmentList);
          this.loading = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loading = false;
      }
    );
  }

  getAllEmployees() {
    this.loading = true;
    const employeeId = this.userInfo?.employeeId || -1;
        this.invoiceService.getAllEmployees(employeeId).subscribe(
      (response) => {
        if (response) {
          this.employeeList = response;
       //   console.log(" this.employeeList: ", this.employeeList);
          this.loading = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loading = false;
      }
    );
  }
}
