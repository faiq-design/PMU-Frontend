import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { InvoiceService } from "../layout/invoice.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.prod";
import { ChartjsComponent } from "../charts/chartjs/chartjs.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  invoiceStatusCards = [
    { icon: 'icon-icon11', title: 'Invoices Sent', number: '120/190,707', progress: 80, background: '#c2d9ef' },
    { icon: 'icon-icon1', title: 'Invoices Un-Paid', number: '120/190,707', progress: 50, background: '#a08164' },
    { icon: 'icon-icon3', title: 'Invoices Pre-Paid', number: '120/190,707', progress: 20, background: '#d8e3bc' },
    { icon: 'icon-icon4', title: 'Total Paid', number: '120,777/190,707', progress: 100, background: '#f7e6be' }
  ];
  
  circumference = 2 * Math.PI * 45;
  progress = 35;
  activeColor = '#009688';
  dashOffset = this.circumference - (this.progress / 100) * this.circumference;
  completeInvoiceList: any = [];
  @ViewChild("chartCanvas") chartCanvas: ElementRef<ChartjsComponent>;
  invoiceList: any = [];
  hospitalId: Number;
  vendorStatus: String;
  serviceId: any;
  userInfo: any = {};
  loading: boolean;
  vendorId: Number;
  activeButtonId: number  = -1;
  statusTotals: any = {
    Sent: { totalInvoices: 0, totalAmount: 0 },
    Paid: { totalInvoices: 0, totalAmount: 0 },
    Unpaid: { totalInvoices: 0, totalAmount: 0 },
    ppaid: { totalInvoices: 0, totalAmount: 0 },
  };

  invoiceTotals: any = {
    Vendor: { totalInvoices: 0 },
    Hospital: { totalInvoices: 0 },
    IC: { totalInvoices: 0 },
    Operations: { totalInvoices: 0 },
    Outsource: { totalInvoices: 0 },
    Audit: { totalInvoices: 0 },
    Finance: { totalInvoices: 0 },
  };

  barChartData = [];

  // barChartLabels = [
  //   "Vendor",
  //   "Hospital",
  //   "IC",
  //   "Operations",
  //   "Outsource",
  //   "Audit",
  //   "Finance",
  // ];

  barChartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,

            userCallback: function (label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                return label;
              }
            },
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  };

  barChartColors = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(102, 255, 178, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(102, 255, 178, 1)",
        "rgba(255, 159, 64, 1)",
      ],
    },
  ];

  doughnutPieChartData = [];

  doughnutPieChartLabels = [
    "Vendor",
    "Hospital",
    "IC",
    "Operations",
    "Outsource",
    "Audit",
    "Finance",
  ];

  doughnutPieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    legend: false,
  };

  doughnutPieChartColors = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 225, 0, 1)",
      ],
      borderColor: [
        "rgba(255,99,132,.2)",
        "rgba(54, 162, 235, .2)",
        "rgba(255, 206, 86, .2)",
        "rgba(75, 192, 192, .2)",
        "rgba(153, 102, 255, .2)",
        "rgba(255, 159, 64, .2)",
        "rgba(255, 225, 0, .2)",
      ],
    },
  ];

  toggleProBanner(event) {
    console.log("123");
    event.preventDefault();
    document.querySelector("body").classList.toggle("removeProbanner");
  }

  constructor(private invoiceService: InvoiceService, private router: Router) {
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.hospitalId = this.userInfo.hospitalId;
    this.serviceId = this.userInfo.serviceId;
    this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    this.vendorStatus = "Vendor";
    if (this.userInfo.role.id != 10) {
      this.getInvoiceDetails();
    }
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
            this.completeInvoiceList = response;
            console.log("invoice list: ", this.invoiceList);
            this.invoiceList.forEach((invoice) => {
              invoice.color = invoice.updatedDatetime
                ? this.getColorForDate(invoice.updatedDatetime)
                : "gray";
            });
            this.calculateStatusTotals();
            this.loading = false;
          }
        },
        (error: any) => {
          console.log("Error");
          this.loading = false;
        }
      );
  }

  ngOnInit() {}

  chart1Clicked(event: any) {
    // debugger;
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0]._index;
      let statusType: string;

      switch (clickedIndex) {
        case 0:
          statusType = "Sent";
          break;
        case 1:
          statusType = "Unpaid";
          break;
        case 2:
          statusType = "Paid";
          break;
        default:
          break;
      }

      if (statusType) {
        this.gotoInvoiceList(statusType);
      }
    }
  }
  chart2Clicked(event: any) {
    // debugger;
    if (event.active && event.active.length > 0) {
      const clickedIndex = event.active[0]._index;
      let statusType: string;

      switch (clickedIndex) {
        case 0:
          statusType = "Vendor";
          break;
        case 1:
          statusType = "Hospital";
          break;
        case 2:
          statusType = "IC";
          break;
        case 3:
          statusType = "Operations";
          break;
        case 4:
          statusType = "Outsource";
          break;
        case 5:
          statusType = "Audit";
          break;
        case 6:
          statusType = "Finance";
          break;
        default:
          break;
      }

      if (statusType) {
        this.gotoInvoiceList(statusType);
      }
    }
  }

  visitSaleChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  visitSaleChartOptions = {
    responsive: true,
    legend: false,
    scales: {
      yAxes: [
        {
          ticks: {
            display: false,
            min: 0,
            stepSize: 20,
            max: 80,
          },
          gridLines: {
            drawBorder: false,
            color: "rgba(235,237,242,1)",
            zeroLineColor: "rgba(235,237,242,1)",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
            drawBorder: false,
            color: "rgba(0,0,0,1)",
            zeroLineColor: "rgba(235,237,242,1)",
          },
          ticks: {
            padding: 20,
            fontColor: "#9c9fa6",
            autoSkip: true,
          },
          categoryPercentage: 0.4,
          barPercentage: 0.4,
        },
      ],
    },
  };

  visitSaleChartColors = [
    {
      backgroundColor: [
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
      ],
      borderColor: [
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
        "rgba(154, 85, 255, 1)",
      ],
    },
    {
      backgroundColor: [
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
      ],
      borderColor: [
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
        "rgba(254, 112, 150, 1)",
      ],
    },
    {
      backgroundColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
      ],
      borderColor: [
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
        "rgba(177, 148, 250, 1)",
      ],
    },
  ];

  trafficChartData = [];

  trafficChartLabels = ["Sent", "Unpaid", "Paid"];

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
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(75, 192, 192, 1)",
      ],
      borderColor: [
        "rgba(255, 99, 132, .2)",
        "rgba(54, 162, 235, .2)",
        "rgba(75, 192, 192, .2)",
      ],
    },
  ];

  calculateStatusTotals() {
    // debugger;
    let totalInvoiceCount = this.invoiceList.length;
    this.statusTotals = {
      Sent: { totalInvoices: 0, totalAmount: 0 },
      Paid: { totalInvoices: 0, totalAmount: 0 },
      Unpaid: { totalInvoices: 0, totalAmount: 0 },
      ppaid: { totalInvoices: 0, totalAmount: 0 },
    };

    this.invoiceTotals = {
      Vendor: { totalInvoices: 0 },
      Hospital: { totalInvoices: 0 },
      IC: { totalInvoices: 0 },
      Operations: { totalInvoices: 0 },
      Outsource: { totalInvoices: 0 },
      Audit: { totalInvoices: 0 },
      Finance: { totalInvoices: 0 },
    };

    // Iterate through each invoice
    this.invoiceList.forEach((invoice) => {
      // Get the invoice status
      let statusTitle = "Unpaid";

      // Check if the status is 'Vendor', 'Finance', or any other
      if (invoice.invoiceStatus == "Vendor") {
        statusTitle = "Sent";
      } else if (invoice.invoiceStatus == "Finance") {
        statusTitle = "Paid";
      }

      this.invoiceTotals[invoice.invoiceStatus].totalInvoices++;

      // Increment the total invoices count for the respective status title
      this.statusTotals[statusTitle].totalInvoices++;

      // Add the invoice amount to the total amount for the respective status title
      this.statusTotals[statusTitle].totalAmount += invoice.invoiceAmount;
      if (
        invoice.partialPayStatus == "FIRST_HALF_TO_PAY" ||
        invoice.partialPayStatus == "SECOND_HALF_TO_PAY"
      ) {
        this.statusTotals["ppaid"].totalInvoices++;
        this.statusTotals["ppaid"].totalAmount += invoice.remainingAmount;
      }
    });

    // Calculate percentages
    Object.keys(this.statusTotals).forEach((key) => {
      this.statusTotals[key].percentage = (
        (this.statusTotals[key].totalInvoices / totalInvoiceCount) *
        100
      ).toFixed();
      this.statusTotals[key].totalAmount = this.format(
        this.statusTotals[key].totalAmount
      );
    });
    Object.keys(this.statusTotals).forEach((key) => {
      this.statusTotals[key].totalAmount = this.format(
        this.statusTotals[key].totalAmount
      );
    });

    Object.keys(this.invoiceTotals).forEach((key) => {
      this.invoiceTotals[key].percentage = (
        (this.invoiceTotals[key].totalInvoices / totalInvoiceCount) *
        100
      ).toFixed();
    });
    // Object.keys(this.invoiceTotals).forEach((key) => {
    //   this.invoiceTotals[key].totalAmount = this.format(this.invoiceTotals[key].totalAmount);
    // });
    this.trafficChartData = [
      {
        data: [
          this.statusTotals["Sent"].totalInvoices,
          this.statusTotals["Unpaid"].totalInvoices,
          this.statusTotals["Paid"].totalInvoices,
        ],
      },
    ];
    this.doughnutPieChartData = [
      {
        data: [
          this.invoiceTotals["Vendor"].totalInvoices,
          this.invoiceTotals["Hospital"].totalInvoices,
          this.invoiceTotals["IC"].totalInvoices,
          this.invoiceTotals["Operations"].totalInvoices,
          this.invoiceTotals["Outsource"].totalInvoices,
          this.invoiceTotals["Audit"].totalInvoices,
          this.invoiceTotals["Finance"].totalInvoices,
        ],
      },
    ];
  }

  format(amount: any) {
    const amountString = amount.toString();
    const value = amountString.replace(/\D/g, "");
    return this.numberWithCommas(value);
  }

  numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  gotoInvoiceList(statusType: string) {
    // debugger;
    console.log("Clicked status type:", statusType); // Check the clicked status type in the console
    this.router.navigate(["/main/invoice-summary"], {
      queryParams: { status: statusType },
    });
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
    }
  }

  filterInvoiceListServiceId(serviceId): void {
    if (serviceId == -1) {
      this.invoiceList = this.completeInvoiceList;
      this.activeButtonId = -1;
    } else {
      this.invoiceList = this.completeInvoiceList.filter(
        (invoice) => invoice.serviceId == serviceId
      );
      this.activeButtonId = serviceId;
    }

    this.calculateStatusTotals();
  }

  getColorForDate(updatedDatetime: string): string {
    const inputDate = new Date(updatedDatetime);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const dayBeforeYesterday = new Date();
    dayBeforeYesterday.setDate(today.getDate() - 2);

    if (this.isSameDay(inputDate, today)) {
      return "green"; // Color for current day
    } else if (this.isSameDay(inputDate, yesterday)) {
      return "yellow"; // Color for previous day
    } else if (this.isSameDay(inputDate, dayBeforeYesterday)) {
      return "red"; // Color for day before previous day
    } else {
      return "red"; // Color for more than two days ago
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
