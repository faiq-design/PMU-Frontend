import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../layout/invoice.service";
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
  selector: "app-laundry-list",
  templateUrl: "./laundry-list.component.html",
  styleUrls: ["./laundry-list.component.scss"],
})
export class LaundryListComponent implements OnInit {
  visibleSidebar2 = false;
  hospitalList: any = [];
  vendorList: any = [];
  selectedVendor: any = {};
  selectedHospital: any = {};
  loadingNew = false;
  itemsList: any = [];
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
  hospitalRelationDTO: any;

  invoices: any[] = [];
  statusType: any;
  completeInvoiceList: any = [];
  loadingPage: any;
  feederHospitals: any;
  satelliteHospitals: any;
  userId: any;
  satelliteReceivedCount: number = 0;
satelliteSentCount: number = 0;
feederReceivedCount: number = 0;
feederSentCount: number = 0;
intransitCount:number = 0;
inprocessCount:number =0;
showSatelliteSections: boolean = false;
showFeederSections: boolean = false;
  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const hospitalId = userInfo.hospitalId;
    this.roles = JSON.parse(localStorage.getItem("roles"));
    this.hospitalRelationDTO = JSON.parse(localStorage.getItem("hospitalRelationDTO"));
    console.log(this.hospitalRelationDTO );
    this.feederHospitals = this.hospitalRelationDTO.filter(
      (hospital) => hospital.relationType === "feeder"
    );
    this.satelliteHospitals = this.hospitalRelationDTO.filter(
      (hospital) => hospital.relationType === "satellite"
    );

    // if (this.feederHospitals.length > 0 && this.satelliteHospitals.length > 0) {
    //   this.showSatelliteSections = true;
    //   this.showFeederSections = true;
    // } else if (this.feederHospitals.length > 0 && this.satelliteHospitals.length === 0) {
    //   this.showFeederSections = true;
    // } else if (this.satelliteHospitals.length > 0 && this.feederHospitals.length === 0) {
    //   this.showSatelliteSections = true;
    // }

    let showFeederSections = false;
let showSatelliteSections = false;

let hasFeeder = false;
let hasSatellite = false;
debugger;
for (const relation of this.hospitalRelationDTO) {
  if (relation.id !== hospitalId) {
    if (relation.relationType === "satellite") {
      showFeederSections = true;
      hasFeeder = true;
    } else if (relation.relationType === "feeder") {
      showSatelliteSections = true;
      hasSatellite = true;
      
    }
  }
}

if (hasFeeder && hasSatellite) {
  showFeederSections = true;
  showSatelliteSections = true;
}

// Assuming you want to set these values to `this` context in a class
this.showFeederSections = showFeederSections;
this.showSatelliteSections = showSatelliteSections;
    console.log(  this.hospitalRelationDTO);
    
    this.getAllowedRoles();
    this.hospitalId = this.userInfo.hospitalId;
    this.serviceId = this.userInfo.serviceId;
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    // this.vendorStatus = this.userInfo.role.status;
    this.vendorStatus = "Vendor";
    // this.getInvoiceDetails();
    this.getLaundryDetails();
  }

  ngOnInit(): void {
    const that = this;
    document.addEventListener("visibilitychange", function (e) {
      if (!document.hidden) {
        that.getLaundryDetails();
      }
    });
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
  getLaundryDetails() {
    this.loadingPage = true;
    console.log(this.selectedHospital);
    this.invoiceService
      .getLaundryDetails(
        this.selectedHospital?.id ? this.selectedHospital?.id : this.hospitalId
      )
      .subscribe(
        (response) => {
          if (response) {
            this.itemsList = response;
            console.log("Laundry items: ", this.itemsList);
  
            // Reset counts
            this.satelliteReceivedCount = 0;
            this.satelliteSentCount = 0;
            this.feederReceivedCount = 0;
            this.feederSentCount = 0;
            this.intransitCount= 0;
            this.inprocessCount=0;
  
            // Count statuses
            this.itemsList.forEach(item => {
              switch (item.laundryStatus) {
                case 'satellite_received':
                  this.satelliteReceivedCount++;
                  // Count satellite_received into inprocessCount
                  break;
                case 'satellite_dispatch':
                  this.satelliteSentCount++;
                  this.intransitCount++;
                  // Count satellite_dispatch into inprocessCount
                  break;
                case 'feeder_collected':
                  this.feederReceivedCount++;
                  this.inprocessCount++;
                 // Count feeder_collected into intransitCount
                  break;
                case 'feeder_sent':
                  this.feederSentCount++;
                  // Count feeder_sent into intransitCount
                  break;
                default:
                  // Handle other statuses if needed
                  break;
              }
            });
          }
          this.loadingPage = false;
        },
        (error: any) => {
          console.error("Error fetching laundry details", error);
          this.loadingPage = false;
        }
      );
  }
  

  viewInvoice(invoice) {
    localStorage.setItem("laundry" + invoice.id, JSON.stringify(invoice));
    if (invoice.laundryStatus === "satellite_dispatch") {
      window.open(
        `${environment.hash}main/feeder-collected/${invoice.id}`,
        "_blank"
      );
    } else if (invoice.laundryStatus === "feeder_collected") {
      window.open(
        `${environment.hash}main/feeder-sent/${invoice.id}`,
        "_blank"
      );
    } else if (
      invoice.laundryStatus === "feeder_sent" ||
      invoice.laundryStatus === "satellite_received"
    ) {
      window.open(
        `${environment.hash}main/satellite-received/${invoice.id}`,
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

  filterInvoiceListServiceId(serviceId): void {
    // debugger;
    if (serviceId == -1) {
      this.invoiceList = this.completeInvoiceList;
    } else {
      this.invoiceList = this.completeInvoiceList.filter(
        (invoice) => invoice.serviceId == serviceId
      );
      this.filteredInvoices = this.completeInvoiceList.filter(
        (invoice) => invoice.serviceId == serviceId
      );
    }

    this.getSummary();
  }
}
