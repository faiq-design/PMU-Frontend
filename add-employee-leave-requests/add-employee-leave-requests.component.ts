import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { environment } from "src/environments/environment.prod";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import { InvoiceService } from "../layout/invoice.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { DecimalPipe } from "@angular/common";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-add-employee-leave-requests",
  templateUrl: "./add-employee-leave-requests.component.html",
  styleUrls: ["./add-employee-leave-requests.component.scss"],
})
export class AddEmployeeLeaveRequestsComponent implements OnInit {
  one = 1;
  // chart1
  trafficChartData = [];

  trafficChartLabels = ["Entitled", "Availed"];

  trafficChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors = [
    {
      backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
      borderColor: ["rgba(255, 99, 132, .2)", "rgba(54, 162, 235, .2)"],
    },
  ];
  // chart1 ends

  // chart2
  trafficChartData2 = [];

  trafficChartLabels2 = ["Entitled", "Availed"];

  trafficChartOptions2 = {
    responsive: true,
    //   maintainAspectRatio: false,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  trafficChartColors2 = [
    {
      backgroundColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
      borderColor: ["rgba(255, 99, 132, .2)", "rgba(54, 162, 235, .2)"],
    },
  ];
  // chart2 ends

  // chart3 bar
  barChartData = [
    //   {
    //   label: '',
    //   data: [10, 19, 3, 5, 2, 3],
    //   borderWidth: 1,
    //   fill: false
    // }
  ];

  barChartLabels = ["Entitled", "Availed", "Remaining", "Rejected"];

  barChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
    scales: {
      yAxes: [
        {
          ticks: {
            min: 0, // start y-axis from 0
            stepSize: 5, // set interval to 5, or any smaller value that fits your data
          },
        },
      ],
    },
  };

  barChartColors = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "#4bc0c0",
        "#ff9f40",
      ],
      borderColor: ["rgba(255, 99, 132, .2)", "rgba(54, 162, 235, .2)"],
    },
  ];
  // chart3 ends bar

  visibleSidebar2 = false;
  feederList: any = [];
  satelliteList: any = [];
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
  intransitCount: number = 0;
  inprocessCount: number = 0;
  showSatelliteSections: boolean = false;
  showFeederSections: boolean = false;
  hrEmployeeLeaves: any = {};
  hospitalList: any;
  showModal: boolean = false;
  isSaving = false;
  leave: {
    remainingLeaves: any;
    noOfLeaves: any;
    leaveId: any;
    fromDate: any;
    toDate: any;
    status: any;
    employeeId: any;
    remarks: any;
  };
  leaveRemarks: any = [];
  remainingLeaves: any = 0;
  exceedLimit: boolean;
  lessLimit: boolean;
  casualLevaesBO: any;
  medicalLevaesBO: any;
  loadingPage2: boolean;
  note: boolean;
  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split("T")[0];
    // Initialize the leave object
    this.leave = {
      noOfLeaves: 1, // Set a default value
      leaveId: null, // Or any default value you need
      fromDate: formattedDate,
      toDate: formattedDate,
      status: "Pending",
      employeeId: userInfo.employeeId,
      remainingLeaves: null,
      remarks: null,
    };
  }

  ngOnInit(): void {
    // this.getAllHospitals();
    this.loadHrEmployeeData();
    this.getLeaveTypeRemarks();
  }
  loadHrEmployeeData() {
    this.loadingPage = true;
    const params: any = {};
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const deptId = userInfo.deptId; // Get deptId from userInfo
    const employeeId = userInfo.employeeId; // Get employeeId from userInfo

    // Determine which ID to send based on the conditions
    // let idToSend: number | null = null;

    // if (deptId > -1) {
    //     idToSend = deptId; // Send deptId
    // } else if (employeeId > -1) {
    //     idToSend = employeeId; // Send employeeId
    // }

    this.invoiceService.getEmployeeLeaveRequestsById(employeeId).subscribe(
      (response) => {
        if (response) {
          this.hrEmployeeLeaves = response?.leaveRequests;
          // this.remainingLeaves =response.remainingLeaves;
          console.log(this.hrEmployeeLeaves);
          //  console.log(this.remainingLeaves);
          this.loadingPage = false;
        }
      },
      (error: any) => {
        this.loadingPage = false;
        this.loadingNew = false;
      }
    );
  }

  leaveTypeChange() {
    this.note = true;
    const firstValidRemark = this.leaveRemarks.find(
      (remark) => remark.id == this.leave.leaveId
    );

    //  this.leave.leaveId=firstValidRemark?.id;
    this.leave.remainingLeaves = firstValidRemark?.remaining_leaves;
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split("T")[0];
    this.leave.fromDate = formattedDate;
    this.leave.toDate = formattedDate;
    this.leave.noOfLeaves = 1;
    console.log("this.leave: ", this.leave);
    this.noteCheck(this.leave.leaveId);
    this.calculateNoOfLeaves();
  }

  getLeaveTypeRemarks() {
    this.loadingPage2 = true;

    this.invoiceService
      .getLeaveTypeRemarks(4, this.userInfo.employeeId)
      .subscribe(
        (response) => {
          if (response) {
            this.leaveRemarks = response;
            console.log("leaveRemarks: ", this.leaveRemarks);
            this.casualLevaesBO = this.leaveRemarks.filter(
              (e) => e.id == 61
            )[0];

            const firstValidRemark = this.leaveRemarks.find(
              (remark) =>
                remark.remaining_leaves != null &&
                remark.remaining_leaves != "null"
            );

            this.leave.leaveId = firstValidRemark?.id;
            this.noteCheck(this.leave.leaveId);
            
            this.leave.remainingLeaves = firstValidRemark?.remaining_leaves;
        //    this.leave = firstValidRemark;
            const today = new Date(); // Get today's date
            const formattedDate = today.toISOString().split("T")[0];
            this.leave.fromDate = formattedDate;
            this.leave.toDate = formattedDate;

            this.trafficChartData = [
              {
                data: [
                  this.casualLevaesBO?.entitled_leaves,
                  this.casualLevaesBO?.consumed,
                ],
              },
            ];

            this.medicalLevaesBO = this.leaveRemarks.filter(
              (e) => e.id == 62
            )[0];
            this.trafficChartData2 = [
              {
                data: [
                  this.medicalLevaesBO?.entitled_leaves,
                  this.medicalLevaesBO?.consumed,
                ],
              },
            ];

            this.barChartData = [
              {
                data: [
                  this.casualLevaesBO?.entitled_leaves,
                  this.casualLevaesBO?.consumed,
                  25,
                  21,
                ],
              },
            ];

            this.loadingPage2 = false;
            this.calculateNoOfLeaves();
          }
        },
        (error: any) => {
          this.loadingPage2 = false;
          this.loadingNew = false;
        }
      );
  }

  noteCheck(leaveId){
    const excludedLeaveIds = [61, 69, 70];
    if(leaveId){
     
    if (!excludedLeaveIds.includes(parseInt(leaveId))) {
      console.log(`Leave ID ${leaveId} is NOT in the list of excluded IDs.`);
      this.note = true;
    } else {
      console.log(`Leave ID ${leaveId} is in the list of excluded IDs.`);
      this.note = false;
    }
    }
  }

  refreshList() {
    this.loadHrEmployeeData();
  }

  viewInvoice(hrEmployee) {
    localStorage.setItem(
      "employee" + hrEmployee.id,
      JSON.stringify(hrEmployee)
    );

    window.open(
      `${environment.hash}main/hr-employee-details/${hrEmployee.id}`,
      "_blank"
    );
  }

  formatDate(dateArray: any): string {
    // if (!dateArray || dateArray.length < 3) {
    if (!Array.isArray(dateArray) || !dateArray) {
      return dateArray; // Return an empty string if the date array is invalid
    }
    const year = dateArray[0];
    const month = String(dateArray[1]).padStart(2, "0"); // Add leading zero if needed
    const day = String(dateArray[2]).padStart(2, "0"); // Add leading zero if needed
    return `${year}-${month}-${day}`; // Return formatted date
  }

  openModal() {
    // Create a copy of the selected asset
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetLeaveData();
    // this.selectedField = {};
  }

  saveChanges() {
    this.isSaving = true;
    console.log("this.leave", this.leave);
    // Convert fromDate and toDate to the required string format
    // const formattedFromDate = this.leave.fromdate.toString();
    // const formattedToDate = this.leave.toDate.toString();

    // // Update the leave object with formatted dates
    // this.leave.fromdate = formattedFromDate;
    // this.leave.toDate = formattedToDate;

    // const leaveData = {
    //   ...this.leave,
    //   fromDate: new Date(this.leave.fromDate).toISOString().split('T')[0],
    //   toDate: new Date(this.leave.toDate).toISOString().split('T')[0]
    // };

    // console.log("this.leave", this.leave);
    this.invoiceService.submitLeaveRequest(this.leave).subscribe(
      (response) => {
        console.log("Leave request submitted successfully:", response);
        this.toastr.success("Leave request submitted successfully");
        this.isSaving = false;
        this.closeModal();
        this.router.navigate(["/main/employee-leave-requests"]);
        // Handle success (e.g., show a message, reset form, etc.)
      },
      (error) => {
        console.error("Error submitting leave request:", error);
        this.toastr.error("Error submitting leave request");
        this.isSaving = false;
        // Handle error (e.g., show an error message)
      }
    );
  }

  // enforceMaxLeaves() {
  //   if (this.leave.noOfLeaves > this.remainingLeaves) {
  //     this.leave.noOfLeaves = this.remainingLeaves;
  //   }
  // }
  enforceMaxandMinLeaves() {
    this.exceedLimit = false;
    this.lessLimit = false;

    if (this.leave.noOfLeaves > this.leave.remainingLeaves) {
      this.exceedLimit = true;
      this.leave.noOfLeaves = this.leave.remainingLeaves;
    } else if (this.leave.noOfLeaves < 0) {
      this.lessLimit = true;
      this.leave.noOfLeaves = 0;
    }
  }
  calculateNoOfLeaves(): void {
    this.exceedLimit = false;
    this.lessLimit = false;

    if (this.leave.fromDate && this.leave.toDate) {
      const startDate = new Date(this.leave.fromDate);
      const endDate = new Date(this.leave.toDate);

      // Calculate the difference in days
      const diffInTime = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInTime / (1000 * 3600 * 24) + 1; // Include start date
      if (this.leave.remainingLeaves !== null) {
        if (diffInDays > this.leave.remainingLeaves) {
          this.exceedLimit = true;
          this.leave.noOfLeaves = this.leave.remainingLeaves;
        } else if (diffInDays < 0) {
          this.lessLimit = true;
          //  this.leave.noOfLeaves = 0;
        } else {
          this.leave.noOfLeaves = diffInDays;
        }
      }
      else{
        this.leave.noOfLeaves = diffInDays;
      }
    } else {
      this.leave.noOfLeaves = 1; // Reset if dates are not selected
    }
  }

  isLeaveInputDisabled(): boolean {
    console.log("isLeaveInputDisabled");
    return (
      !this.leave.noOfLeaves ||
      !this.leave.leaveId ||
      !this.leave.fromDate ||
      !this.leave.toDate
    );
  }

  resetLeaveData() {
    const today = new Date(); // Get today's date
    const formattedDate = today.toISOString().split("T")[0];
    this.leave = {
      noOfLeaves: 0, // Set a default value
      leaveId: null, // Or any default value you need
      fromDate: formattedDate,
      toDate: formattedDate,
      status: "Pending",
      employeeId: this.userInfo?.employeeId,
      remainingLeaves: null,
      remarks: null,
    };
  }
}
