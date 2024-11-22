import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { DatePipe } from '@angular/common';
@Component({
  selector: "app-complaint-summary",
  templateUrl: "./complaint-list.component.html",
  styleUrls: ["./complaint-list.component.scss"],
})
export class ComplaintListComponent implements OnInit {
  complaintList: any = [];
  hospitalId: Number;
  vendorStatus: String;
  serviceId: Number;
  userInfo: any = {};
  loading: boolean;
  vendorId: Number;
  totalCount: number = 0;
createdCount: number = 0;
resolvedCount: number = 0;
  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.hospitalId = this.userInfo.hospitalId || -1;
    // debugger;
    this.serviceId = this.userInfo.serviceId;
    // debugger;
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    // this.vendorStatus = this.userInfo.role.status;
    // this.complaintStatus = "VenCdor";
    this.getComplaintDetails();
  }

  ngOnInit(): void {
    const that = this;
    document.addEventListener("visibilitychange", function (e) {
      if (!document.hidden) {
         that.getComplaintDetails();
      }
    });
  }

  getComplaintDetails() {
    this.loading = true;
    debugger;
    this.invoiceService
      .getComplaintDetails(
        this.hospitalId,
        this.serviceId,
        "Created",
        this.vendorId
      )
      .subscribe(
        (response) => {
          if (response) {
            this.complaintList = response;
            console.log("this.complaintList: ", this.complaintList);
            
            this.totalCount = this.complaintList.length;
            this.createdCount = 0;
            this.resolvedCount = 0;
  
            this.complaintList.forEach((complaint) => {
              // Format complaintDate as 'yyyy-MM-dd'
              const date = new Date(complaint.complaintDate);
              const formattedDate = `${date.getFullYear()}-${this.padZero(date.getMonth() + 1)}-${this.padZero(date.getDate())}`;
              console.log(formattedDate);
              complaint.complaintDate = formattedDate;
  
              // Calculate Created and Resolved counts
              if (complaint.complaintStatus === 'Created') {
                this.createdCount++;
              } else if (complaint.complaintStatus === 'Resolved') {
                this.resolvedCount++;
              }
            });
  
            this.loading = false;
          }
        },
        (error: any) => {
          console.log("Error");
          this.loading = false;
        }
      );
  }
  
  // Helper method to pad single digits with a zero (for month and day)
  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  
  viewComplaint(complaint) {
    localStorage.setItem("complaint" + complaint.id, JSON.stringify(complaint));
    window.open(
      `${environment.hash}main/approve-complaint/${complaint.id}`,
      "_blank"
    );
  }

  gotoComplaint() {
    this.router.navigate(["/main/create-complaint"]);
  }

  format(amount) {
    var amountString = amount.toString();
    let value = amountString.replace(/\D/g, "");
    let formattedValue = this.numberWithCommas(value);
    return formattedValue;
  }
  numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  gotoCreateComplaint(id) {
    this.router.navigate([`/main/create-complaint/${id}`]);
  }
}
