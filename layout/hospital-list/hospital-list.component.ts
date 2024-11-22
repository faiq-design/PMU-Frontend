import { Component, OnInit } from "@angular/core";
import { InvoiceService } from "../invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-hospital-list",
  templateUrl: "./hospital-list.component.html",
  styleUrls: ["./hospital-list.component.scss"],
})
export class HospitalListComponent implements OnInit {
  invoiceList: any = [];
  hospitalId: Number;
  hospitalStatus: String;
  serviceId: Number;
  userInfo: any = {};
  loading: boolean;
  hospitalList: any;
  name: any;
  selectedHospital: any = {};
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
    this.hospitalId = this.userInfo.hospital ? this.userInfo.hospital.id : -1;
    // this.hospitalStatus = this.userInfo.role.status;
    this.hospitalStatus = "Hospital";

    // this.getInvoiceDetails();

    // this.hospitalList = JSON.parse(localStorage.getItem("hospitals"));
  }

  ngOnInit(): void {
    this.getAllHospitals();
  }

  viewInvoice(invoice) {
    localStorage.setItem("invoice" + invoice.id, JSON.stringify(invoice));
    window.open(`/#/main/view-invoice/${invoice.id}`, "_blank");
  }

  editModal(mediumModalContent, hospital) {
    this.selectedHospital = {};
    this.selectedHospital = { ...hospital };
    console.log("editModal is clicked hospital: ", hospital);
    console.log(
      "editModal is clicked selectedHospital: ",
      this.selectedHospital
    );
    console.log("editModal is clicked hospitalList: ", this.hospitalList);
    this.modalRef = this.modalService.open(mediumModalContent);
  }

  editHospital() {
    this.loadingData = true;
    console.log("editHospital this.selectedHospital: ", this.selectedHospital);
    console.log("editHospital hospitalList: ", this.hospitalList);
    this.invoiceService.editHospital(this.selectedHospital).subscribe(
      (response) => {
        // debugger;
        console.log("Hospital saved successfully", response);
        console.log(
          "editHospital before splice hospitalList: ",
          this.hospitalList
        );
        let index = this.hospitalList.findIndex(
          (e) => e.id == this.selectedHospital.id
        );
        if (index > -1) {
          this.hospitalList.splice(index, 1, this.selectedHospital);
        }
        console.log(
          "editHospital after splice hospitalList: ",
          this.hospitalList
        );
        this.loadingData = false;
        this.toaster.success("Hospital created successfully");

        // to close all opened modal
        // this.modalService.dismissAll();

        // to close specific modal
        if (this.modalRef) {
          this.modalRef.close();
        }
      },
      (error) => {
        console.error("Error saving Hospital", error);
        this.toaster.error("There was an error creating the Hospital");
        this.loadingData = false;
      }
    );
  }

  getAllHospitals() {
    this.loading = true;
    this.invoiceService.getAllHospitals().subscribe(
      (response) => {
        if (response) {
          const hospitalList = response;
          this.hospitalList = hospitalList.filter(
            (h) => h.type == "HOSPITAL" 
          );
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
}
