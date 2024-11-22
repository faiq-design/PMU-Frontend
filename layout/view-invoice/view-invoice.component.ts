import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ToastrService } from "ngx-toastr";
import { NotingPrintComponent } from "./noting-print-component/noting-print-component";

@Component({
  selector: "app-view-invoice",
  templateUrl: "./view-invoice.component.html",
  styleUrls: ["./view-invoice.component.scss"],
})
export class ViewInvoiceComponent implements OnInit {
  invoice: any = {};
  invoiceForm: any;
  userInfo: any = {};
  loading: boolean;
  totalAmountWithoutTax: number;
  taxAmount: number;
  totalNetAmount: number;

  remarkTypes: any;
  checkedStates: boolean[] = [];

  constructor(
    private activatedRoutes: ActivatedRoute,
    private router: Router,
    private builder: FormBuilder,
    private invoiceService: InvoiceService,
    private toaster: ToastrService,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {
    this.activatedRoutes.params.subscribe((params) => {
      this.invoice = JSON.parse(localStorage.getItem("invoice" + params.id));
    });
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    this.invoiceForm = this.builder.group({
      invoiceNo: this.invoice.invoiceNo,
      hospital: this.invoice.hospital.title,
      vendor: this.invoice.vendor.title,
      service: this.invoice.service.title,
      remarks: this.invoice.remarks,
      packageInfo: this.invoice.packageInfo,
      invoiceDate: this.invoice.invoiceDate,
      invoiceMonth: this.invoice.invoiceMonth,
      invoiceAmount: this.invoice.invoiceAmount,
      vendorStatus: this.invoice.invoiceStatus,
      details: this.builder.array([]),
      invoiceAmountWithoutTax: this.builder.control(0),
      invoiceTaxAmount: this.builder.control(0),
      documents: this.builder.array([]),
    });
    this.getDetails();
    this.getRemarks();
  }

  get invServices() {
    return this.invoiceForm.get("details") as FormArray;
  }

  getDetails() {
    this.invoice.details.forEach((element, index) => {
      this.invoiceForm.get("details").push(this.generateAutoService(element));
    });
    this.calculateTotalAmount();
  }

  ngOnInit(): void {}

  changeStatus() {
    const status = this.userInfo.role.title;
  }

  generateAutoService(element) {
    return this.builder.group({
      serviceDetail: element.serviceDetail,
      amount: element.amount,
      auto: element.auto,
      qty: element.qty,
      taxPercentage: element.taxPercentage,
      taxAmount: element.taxAmount,
      netAmount: element.netAmount,
    });
  }

  updateInvoice() {
    this.loading = true;
    this.invoiceService
      .updateInvoice(this.invoice.id, this.userInfo.role.title)
      .subscribe(
        (response) => {
          this.loading = false;
          this.toaster.success("Success");
          window.close();
        },
        (error: any) => {
          this.loading = false;
          console.log("Error");
          this.toaster.error("Error");
        }
      );
  }

  printPage() {
    // Hide sidebar and any other elements you don't want to print
    // document.body.classList.add('printingClass');
    const elementsToHide = document.querySelectorAll(".sidebar");
    elementsToHide.forEach((element: HTMLElement) => {
      element.style.display = "none";
    });

    const elementsToHide3 = document.querySelectorAll(".navbarnew");
    elementsToHide3.forEach((element: HTMLElement) => {
      element.style.display = "none";
    });

    // const elementsToHide2 = document.querySelectorAll('.printable');
    // elementsToHide2.forEach((element: HTMLElement) => {
    //   element.style.display = 'none';
    // });

    // Trigger the print function
    console.log("before window.print();");
    window.print();
    console.log("after window.print();");
    // document.body.classList.remove('printingClass');

    // Show the hidden elements after printing
    elementsToHide.forEach((element: HTMLElement) => {
      element.style.display = ""; // Restore original display property
    });
    // elementsToHide2.forEach((element: HTMLElement) => {
    //   element.style.display = ''; // Restore original display property
    // });
    elementsToHide3.forEach((element: HTMLElement) => {
      element.style.display = ""; // Restore original display property
    });
  }

  printPage2() {
    // // const elementsToHide = document.querySelectorAll('body > *:not(.printable)');
    // // const elementsToHide = document.querySelectorAll('body > :not(.printable)');

    // Hide all elements
    document.body.style.display = "none";

    // Show only printable elements
    const printableElements = document.querySelectorAll(".printable");
    printableElements.forEach((element: HTMLElement) => {
      element.style.display = "block";
    });

    // Trigger the print function
    console.log("before window.print();");
    window.print();
    console.log("after window.print();");

    // Restore display of all elements after printing
    document.body.style.display = "";
    printableElements.forEach((element: HTMLElement) => {
      element.style.display = "";
    });
  }

  calculateTotalAmount() {
    const detailsArray = this.invoiceForm.get("details") as FormArray;

    let totalNetAmount = 0;
    let totalAmountWithoutTax = 0;
    let taxAmount = 0;

    detailsArray.controls.forEach((control: FormGroup) => {
      totalNetAmount =
        totalNetAmount + parseFloat(control.get("netAmount").value);
      totalAmountWithoutTax =
        totalAmountWithoutTax + parseFloat(control.get("amount").value);
      taxAmount = taxAmount + parseFloat(control.get("taxAmount").value);
    });
    totalNetAmount = parseFloat(totalNetAmount.toFixed());
    this.totalNetAmount = totalNetAmount;

    totalAmountWithoutTax = parseFloat(totalAmountWithoutTax.toFixed());
    this.totalAmountWithoutTax = totalAmountWithoutTax;
    taxAmount = parseFloat(taxAmount.toFixed());
    this.taxAmount = taxAmount;
    this.invoiceForm.patchValue({
      invoiceAmountWithoutTax: totalAmountWithoutTax,
      invoiceTaxAmount: taxAmount,
    });
  }

  print() {
    // Generate the printable view dynamically
    const printableContent = this.generatePrintableContent();

    // Open a new window with the printable content
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printableContent);
    printWindow.document.close();

    // Delay the print call to ensure content is fully rendered
    // setTimeout(() => {
    printWindow.print();
    // }, 1000);
  }
  // print() {
  //   // Generate the printable view dynamically
  //   this.generatePrintableContent2().then(printableContent => {
  //     // Open a new window with the printable content
  //     const printWindow = window.open('', '_blank');
  //     printWindow.document.write(printableContent);
  //     printWindow.document.close();

  //     // Trigger the print dialog
  //     printWindow.print();
  //   });
  // }

  generatePrintableContent(): string {
    // Generate the printable content dynamically here
    // You can use template literals or other methods to create the HTML content
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Processing Recommendation</title>
        <style>
            /* Minor styling to maintain spacing and text size */
            body {
                font-family: monospace; /* Assuming typewriter-like font for spacing */
                font-size: 16px;
                line-height: 1.5;
            }
            .title {
                font-weight: bold;
                text-decoration: underline; /* Simulate underline */
            }
            .signature{
              font-weight: bold;
            }
            .container{
              margin: 30px;
              margin-top: 50px;
            }
            .right-align {
                text-align: right;
            }
            .labelText{
              color: blue;
            }
        </style>
    </head>
    <body>
    <div class="container"> 
        <p class="title">SUBJECT: MONTHLY INVOICE OF <span class="labelText"> ${
          this.invoice.vendor.title
        } </span> AGAINST
         OUTSOURCED SECURITY SERVICES
         PERTAINING TO DHQ/THQ HOSPITAL <span class="labelText"> ${
           this.invoice.hospital.title
         } </span> FOR 
         THE MONTH OF <span class="labelText"> ${this.getMonth(
           this.invoice.invoiceMonth
         )} </span></p>
        <p>&nbsp;</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The subject invoice worth Rs
         <span class="labelText"> ${
           this.invoice.invoiceAmount
         } </span> was submitted by
         the service provider and same has been examined, scrutinized and verified by Admin Officer, Finance 
         & Budget Officer, HR & Legal Officer, IT Statistical Officer and the Medical Suprintendent of the said hospital.</p>
        <p>2.   The Medical Suprintendent, after deduction of Rs ____ as penalties has recommended the amount
         worth Rs ____ for payment to the service provider.</p>
        <p>3.   Submitted for further processing and necessary action please.</p>
        <p class="right-align signature" >PROJECT OFFICER(OPERATIONS)</p>
        <br>
        <p class="signature">4.DIRECTOR OPERATIONS</p>
        <br>
        <p class="signature">5.DIRECTOR OUTSOURCING</p>
        
</div>
    </body>
    </html>
    
    `;
  }

  //   generatePrintableContent2(){
  //     // Resolve the component factory for NotingPrintComponent
  //    const componentFactory = this.resolver.resolveComponentFactory(NotingPrintComponent);
  //    // Create the component dynamically
  //    const componentRef = this.container.createComponent(componentFactory);
  //    // Pass any necessary data to the component (replace 'yourInvoiceObject' with your actual data)
  //    componentRef.instance.invoice = this.invoice;

  //    // Create a new element to hold the component's template
  //    const printableElement = this.renderer.createElement('div');
  //    // Append the dynamically created component to the printable element
  //    printableElement.appendChild(componentRef.location.nativeElement);

  //    // Return the innerHTML of the printableElement
  //    return printableElement.innerHTML;
  //  }

  // async generatePrintableContent2() {
  //   // Resolve the component factory for NotingPrintComponent
  //   const componentFactory = this.resolver.resolveComponentFactory(NotingPrintComponent);
  //   // Create the component dynamically
  //   const componentRef = this.container.createComponent(componentFactory);

  //   // Wait for the component to be fully initialized
  //   await componentRef.instance.ngOnInit();
  //   componentRef.instance.invoice = this.invoice;
  //   // Get the HTML representation of the component
  //   const printableContent = componentRef.location.nativeElement.outerHTML;
  //   // Destroy the component to clean up
  //   componentRef.destroy();
  //   // Return the HTML representation of the component
  //   return printableContent;
  // }

  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long" });
  }

  navigate() {
    this.router.navigate(["/main/invoice-summary"]);
  }

  // documents tab working
  getRemarks() {
    this.loading = true;
    this.invoiceService
      .getRemarks(this.userInfo.role.id, this.userInfo.serviceId)
      .subscribe(
        (response) => {
          if (response) {
            this.remarkTypes = response;
            console.log("this.reamrkTypes: ", this.remarkTypes);

            this.remarkTypes.forEach((remarkType) => {
              if (remarkType.id == 1) {
                const documentsArray = this.invoiceForm.get(
                  "documents"
                ) as FormArray;
                remarkType.remarks.forEach((remark) => {
                  documentsArray.push(this.builder.control(remark.id)); // Initialize checkbox control
                });
              }
            });
          }
        },
        (error: any) => {
          this.loading = false;
          this.toaster.error("There was an error getting the data");
          console.log(error);
        }
      );
  }

  onCheckboxChange(index: number, isChecked: boolean) {
    const documentsArray = this.invoiceForm.get("documents") as FormArray;
    const i = this.remarkTypes.findIndex((e) => e.id == 1);
    const remarkId = this.remarkTypes[i].remarks[index].id;
    if (isChecked) {
      documentsArray.push(this.builder.control(remarkId));
    } else {
      const existingIndex = documentsArray.value.indexOf(remarkId);
      if (existingIndex !== -1) {
        documentsArray.removeAt(existingIndex);
      }
    }
    this.checkedStates[index] = isChecked;
    console.log(this.invoiceForm.get("documents") as FormArray);
  }
  // documents tab working ends

  // penalties tab working
  penaltyList: any[] = [];
  penaltyOptions: any[] = [
    { label: "Penalty 1", value: "Option 1" },
    { label: "Penalty 2", value: "Option 2" },
    { label: "Penalty 3", value: "Option 3" },
  ];

  addRow() {
    this.penaltyList.push({
      penalty: null,
      id: this.generateRandomNumberId(6),
      amount: "",
      remark: "",
      saved: "N",
    });
    console.log("this.penaltyList: ", this.penaltyList);
  }

  savePenalty(penalty: any) {
    console.log("Penalty saved:", penalty);
    const index = this.penaltyList.indexOf(penalty);
    const obj = {
      penalty: penalty.penalty,
      id: penalty.id,
      amount: penalty.amount,
      remark: penalty.remark,
      saved: "Y",
    };
    if (index !== -1) {
      this.penaltyList.splice(index, 1, obj);
    }
    console.log("this.penaltyList: ", this.penaltyList);
  }

  deletePenalty(penalty: any) {
    const index = this.penaltyList.indexOf(penalty);
    if (index !== -1) {
      this.penaltyList.splice(index, 1);
    }
    console.log("this.penaltyList: ", this.penaltyList);
  }
  generateRandomNumberId(length: number): string {
    const numbers = "0123456789";
    const numbersLength = numbers.length;
    let randomNumberId = "";
    for (let i = 0; i < length; i++) {
      randomNumberId += numbers.charAt(
        Math.floor(Math.random() * numbersLength)
      );
    }
    return randomNumberId;
  }
  // penalties tab working ends
}

// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'getMonth'
// })
// export class GetMonthPipe implements PipeTransform {
//   transform(value: string): string {
//     const date = new Date(value);
//     const month = date.toLocaleString('en-US', { month: 'long' });
//     return month;
//   }
// }
