import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.scss"],
})
export class InvoiceListComponent implements OnInit {
  invoiceList: any = [];
  hospitalId: Number;
  vendorStatus: String;
  serviceId: Number;
  userInfo: any = {};
  loading: boolean;
  vendorId: Number;
  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.hospitalId = this.userInfo.hospitalId;
    this.serviceId = this.userInfo.serviceId;
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    // this.vendorStatus = this.userInfo.role.status;
    this.vendorStatus = "Vendor";
    this.getInvoiceDetails();
  }

  ngOnInit(): void {
    const that = this;
    document.addEventListener("visibilitychange", function (e) {
      if (!document.hidden) {
        that.getInvoiceDetails();
      }
    });
  }

  getInvoiceDetails() {
    debugger;
    this.loading = true;
    this.invoiceService
      .getInvoiceDetails(
        this.hospitalId,
        this.serviceId,
        this.vendorStatus,
        this.vendorId
      )
      .subscribe(
        (response) => {
          if (response) {
            this.invoiceList = response;
            this.loading = false;
          }
        },
        (error: any) => {
          console.log("Error");
          this.loading = false;
        }
      );
  }

  viewInvoice(invoice) {
    localStorage.setItem("invoice" + invoice.id, JSON.stringify(invoice));
    window.open(`/#/main/view-invoice/${invoice.id}`, "_blank");
  }
}
