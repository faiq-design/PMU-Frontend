import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-vendor-list",
  templateUrl: "./vendor-list.component.html",
  styleUrls: ["./vendor-list.component.scss"],
})
export class VendorListComponent implements OnInit {
  invoiceList: any = [];
  hospitalId: Number;
  vendorStatus: String;
  serviceId: Number;
  userInfo: any = {};
  loading: boolean;
  vendorId: Number;
  vendorList: any;
  name: any;
  selectedVendor: any = {};
  modalRef: NgbModalRef; // Declare a modal reference variable
  loadingData: boolean;
  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    private modalService: NgbModal,
    private toaster: ToastrService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.hospitalId = this.userInfo.hospitalId;
    this.serviceId = this.userInfo.serviceId;
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    // this.vendorStatus = this.userInfo.role.status;
    this.vendorStatus = "Vendor";

    // this.getInvoiceDetails();

    // this.vendorList = JSON.parse(localStorage.getItem("vendors"));
  }

  ngOnInit(): void {
    this.getAllVendors();
  }

  getInvoiceDetails() {
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

  editModal(mediumModalContent, vendor) {
    this.selectedVendor = {};
    this.selectedVendor = { ...vendor };
    console.log("editModal is clicked vendor: ", vendor);
    console.log("editModal is clicked selectedVendor: ", this.selectedVendor);
    console.log("editModal is clicked vendorList: ", this.vendorList);
    this.modalRef = this.modalService.open(mediumModalContent);
  }

  editVendor() {
    this.loadingData = true;
    console.log("editVendor this.selectedVendor: ", this.selectedVendor);
    console.log("editVendor vendorList: ", this.vendorList);
    this.invoiceService.editVendor(this.selectedVendor).subscribe(
      (response) => {
        // debugger;
        console.log("Vendor saved successfully", response);
        console.log("editVendor before splice vendorList: ", this.vendorList);
        let index = this.vendorList.findIndex(
          (e) => e.id == this.selectedVendor.id
        );
        if (index > -1) {
          this.vendorList.splice(index, 1, this.selectedVendor);
        }
        console.log("editVendor after splice vendorList: ", this.vendorList);
        this.loadingData = false;
        this.toaster.success("Vendor created successfully");

        // to close all opened modal
        // this.modalService.dismissAll();

        // to close specific modal
        if (this.modalRef) {
          this.modalRef.close();
        }
      },
      (error) => {
        console.error("Error saving Vendor", error);
        this.toaster.error("There was an error creating the Vendor");
        this.loadingData = false;
      }
    );
  }

  getAllVendors() {
    this.loading = true;
    this.invoiceService.getAllVendors().subscribe(
      (response) => {
        if (response) {
          this.vendorList = response;
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
