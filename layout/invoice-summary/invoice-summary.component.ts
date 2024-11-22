import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-invoice-summary",
  templateUrl: "./invoice-summary.component.html",
  styleUrls: ["./invoice-summary.component.scss"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)",
        })
      ),
      state(
        "out",
        style({
          transform: "translateX(100%)",
        })
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class InvoiceSummaryComponent implements OnInit {
  // filters working
  visibleSidebar2 = false;
  hospitalList: any = [];
  vendorList: any = [];
  selectedVendor: any = {};
  selectedHospital: any = {};
  loadingNew = false;

  invoiceList: any = [];
  hospitalId: Number;
  vendorStatus: String;
  serviceId: any;
  userInfo: any = {};
  loading: boolean;
  vendorId: Number;
  statusTotals: any = {
    Sent: { totalInvoices: 0 },
    Received: { totalInvoices: 0 },
    Pending: { totalInvoices: 0 },
  };
  filteredInvoices: any = [];

  allowedRoles: any = [];
  roles: any;
  filteredHospitalList: any = [];

  invoices: any[] = [];
  statusType: any;
  completeInvoiceList: any = [];
  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.roles = JSON.parse(localStorage.getItem("roles"));
    this.getAllowedRoles();
    this.hospitalId = this.userInfo.hospitalId;
    this.serviceId = this.userInfo.serviceId;
    console.log(this.serviceId);
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    // this.vendorStatus = this.userInfo.role.status;
    this.vendorStatus = "Vendor";
    // this.getInvoiceDetails();
    // debugger;
    this.getInvoiceDetails();
  }

  ngOnInit(): void {
    const that = this;
    // document.addEventListener("visibilitychange", function (e) {
    //   if (!document.hidden) {
    //     that.getInvoiceDetails();
    //   }
    // });
    this.getAllHospitals();
    this.getAllVendors();
    // this.getInvoiceDetails();
    this.route.queryParams.subscribe((params) => {
      this.statusType = params["status"];
      // Call a method here to filter the invoice list based on this.statusType
      // For example:
      this.filterInvoiceListByStatus(this.statusType);
      this.filteredInvoices = this.invoices.filter((invoice) =>
        this.statusType.includes(invoice.invoiceStatus)
      );
    });
    console.log(this.statusType, "statusType");
  }
  filterInvoiceListByStatus(statusType: string): void {
    // Implement your logic to filter invoiceList based on statusType
    // You may want to set a filteredInvoiceList or update a flag to control rendering
    // For example, assuming you have invoiceList and want to filter based on statusType:
    this.invoiceList = this.invoiceList.filter(
      (invoice) => invoice.invoiceStatus === statusType
    );
    console.log("invoicelist", this.invoiceList);
  }

  getInvoiceDetails() {
    debugger;
    this.loading = true;
    this.visibleSidebar2 = false;
    this.invoiceService
      .getInvoiceDetails(
        this.selectedHospital?.id ? this.selectedHospital?.id : this.hospitalId,
        this.serviceId,
        this.vendorStatus,
        this.selectedVendor?.id ? this.selectedVendor?.id : this.vendorId
      )
      .subscribe(
        (response) => {
          if (response) {
            this.invoiceList = response;
            console.log(this.invoiceList);
            this.completeInvoiceList = response;
            if (
              this.statusType !== undefined &&
              !["Sent", "Paid", "Unpaid"].includes(this.statusType)
            ) {
              this.filteredInvoices = this.invoiceList.filter(
                (invoice) => invoice.invoiceStatus === this.statusType
              );
            } else {
              // If statusType is undefined, show entire invoiceList
              this.filteredInvoices = this.invoiceList;
            }
            // this.filteredInvoices = this.invoiceList;
            // console.log("list", this.filteredInvoices);
            this.getSummary();
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
    if (invoice.serviceId == 1) {
      window.open(
        `${environment.hash}main/edit-invoice/${invoice.id}`,
        "_blank"
      );
    } else if (invoice.serviceId == 7) {
      window.open(
        `${environment.hash}main/edit-janitorial-invoice/${invoice.id}`,
        "_blank"
      );
    } else if (invoice.serviceId == 3) {
      window.open(
        `${environment.hash}main/edit-security-invoice/${invoice.id}`,
        "_blank"
      );
    }
  }

  gotoInvoice(serviceId) {
    if (serviceId == 1) {
      this.router.navigate([`/main/create-invoice/${serviceId}`]);
    } else if (serviceId == 7) {
      this.router.navigate([`/main/create-janitorial-invoice/${serviceId}`]);
    }
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

  getAllowedRoles() {
    this.roles.forEach((element) => {
      if (element.orderId >= this.userInfo.role.orderId) {
        this.allowedRoles.push(element.title);
      }
    });
  }

  getSummary() {
    debugger;
    this.statusTotals = {
      Sent: { totalInvoices: 0 },
      Received: { totalInvoices: 0 },
      Pending: { totalInvoices: 0 },
    };
    this.invoiceList.forEach((element) => {
      if (this.allowedRoles.includes(element.invoiceStatus)) {
        this.statusTotals["Sent"].totalInvoices++;
      } else if (this.userInfo.role.status == element.invoiceStatus) {
        this.statusTotals["Pending"].totalInvoices++;
      }
      this.statusTotals["Received"].totalInvoices =
        this.statusTotals["Sent"].totalInvoices +
        this.statusTotals["Pending"].totalInvoices;
    });
  }

  getReceivedInvoices() {
    // debugger;
    this.filteredInvoices = this.invoiceList;
  }

  getSentInvoices() {
    this.filteredInvoices = this.invoiceList.filter((invoice) =>
      this.allowedRoles.includes(invoice.invoiceStatus)
    );
  }

  getPendingInvoices() {
    this.filteredInvoices = this.invoiceList.filter(
      (invoice) => invoice.invoiceStatus == this.userInfo.role.status
    );
  }

  // filters working
  getAllHospitals() {
    this.loadingNew = true;
    this.invoiceService.getAllHospitals().subscribe(
      (response) => {
        if (response) {
          this.hospitalList = response;
          this.hospitalList =
            this.hospitalId == -1
              ? this.hospitalList
              : this.hospitalList.filter((e) => e.id == this.hospitalId);
          this.filteredHospitalList = this.hospitalList;
          console.log(" this.hospitalList: ", this.hospitalList);
          this.loadingNew = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loadingNew = false;
      }
    );
  }
  getAllVendors() {
    this.loadingNew = true;
    this.invoiceService.getAllVendors().subscribe(
      (response) => {
        if (response) {
          this.vendorList = response;
          this.vendorList =
            this.vendorId == -1
              ? this.vendorList
              : this.vendorList.filter((e) => e.id == this.vendorId);
          console.log(" this.vendorList: ", this.vendorList);
          this.loadingNew = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loadingNew = false;
      }
    );
  }
  vendorChange() {
    console.log("selectedVendor: ", this.selectedVendor);
    const vendorHospitalIds = this.selectedVendor?.vendorContracts.map(
      (contract) => contract.hospital.id
    );
    console.log("vendorHospitalIds: ", vendorHospitalIds);
    this.filteredHospitalList = this.hospitalList.filter((hospital) =>
      vendorHospitalIds.includes(hospital.id)
    );
    console.log("this.filteredHospitalList: ", this.filteredHospitalList);
  }

  // panelState = 'out';
  // togglePanel() {
  //   this.panelState = this.panelState === 'out' ? 'in' : 'out';
  // }
  // closePanel() {
  //   this.panelState = 'out';
  // }

  isOpen = false;
  togglePanel() {
    this.isOpen = !this.isOpen;
  }
  closePanel() {
    this.isOpen = false;
  }
  shouldDisplayInvoice(invoice: any, statusType: string): boolean {
    // debugger;
    if (statusType === "Sent") {
      return invoice.invoiceStatus === "Vendor";
    } else if (statusType === "Unpaid") {
      return (
        invoice.invoiceStatus === "IC" ||
        invoice.invoiceStatus === "Operations" ||
        invoice.invoiceStatus === "Outsource" ||
        invoice.invoiceStatus === "Audit" ||
        invoice.invoiceStatus === "Hospital"
      );
    } else if (statusType === "Paid") {
      return invoice.invoiceStatus === "Finance";
    } else {
      return false; // Handle other cases if needed
    }
  }
  activeButtonId: number  = -1;
  filterInvoiceListServiceId(serviceId): void {
    debugger;
    if (serviceId == -1) {
      this.invoiceList = this.completeInvoiceList;
      this.activeButtonId = -1;
    } else {
      this.invoiceList = this.completeInvoiceList.filter(
        (invoice) => invoice.serviceId == serviceId
      );
      this.filteredInvoices = this.completeInvoiceList.filter(
        (invoice) => invoice.serviceId == serviceId
      );
      this.activeButtonId = serviceId;
    }

    this.getSummary();
  }
}
