import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { DecimalPipe } from "@angular/common";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-edit-janitorial-invoice",
  templateUrl: "./edit-janitorial-invoice.component.html",
  styleUrls: ["./edit-janitorial-invoice.component.scss"],
  providers: [DecimalPipe], // Provide DecimalPipe here
})
export class EditJanitorialInvoiceComponent implements OnInit {
  modalRef: NgbModalRef;
  attachmentRemarks: any = [];
  hospitalList: any = [];
  invoiceDetail: FormArray;
  serviceDetails: any = [];
  filteredServiceDetails: any = [];
  invoiceForm: any;
  serviceId: any;
  vendorId: any;
  userInfo: any = {};
  loading: boolean;
  loadingPage: boolean;
  totalAmountWithoutTax: number;
  taxAmount: number;
  totalNetAmount: number;
  remarkTypes: any = [];
  checkedStates: boolean[] = [];
  displayDialog: boolean = false;
  distinctCategories: any = [];
  data2: { name: string; population: number }[];
  cities: any = [];
  rowCategoryServices: any[] = [];
  penaltiesList: any[];
  penaltyRemarks: any = [];
  isInvoiceEditable: boolean;
  isServiceEditable: boolean;
  isDocumentEditable: boolean;
  ispenaltyEditable: boolean;
  isDocumentView: boolean;
  ispenaltyView: boolean;

  invoice: any;
  showFirstDiv: boolean = true;
  btnTitle: String;
  roles: any;
  checkedRemarks: any = [];
  createInvoiceData: any;
  createInvoiceStatus: any;
  createInvoicepartialPayStatus: any;
  loadingRemarks: boolean;
  courierRemarks: any = [];
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private invoiceService: InvoiceService,
    private toaster: ToastrService,
    private activatedRoutes: ActivatedRoute,
    private decimalPipe: DecimalPipe,
    private modalService: NgbModal,
    private titleService: Title
  ) {

    this.invoiceForm = this.builder.group({
      id: [''],
      invoiceNo: [''],
      remarks: [''],
      packageInfo: [''],
      invoiceDate: [''],
      invoiceMonth: [''],

      sTaxNo: [''],
      ntn: [''],

      invoiceAmount: [''],
      vendorStatus: [''],
      details: this.builder.array([]),
      documents: this.builder.array([]),
      panelties: this.builder.array([]),
      invoiceAmountWithoutTax: [''],
      invoiceTaxAmount: [''],
      hospitalId: [''],
      serviceId: [''],
      vendorId: [''],
      invoiceStatus: [''],
      panelty: [''],
      paneltyTax: [''],
      active: ['Y'],
      chequeNo: [''],
      financeRemarks: [''],
      partialPayStatus: [''],
      paidAmount: [''],
      remainingAmount: [''],
      amountToBePaid: ['0']
    });

    this.activatedRoutes.params.subscribe((params) => {
      this.invoice = JSON.parse(localStorage.getItem("invoice" + params.id));

          ////
          if (!this.invoice) {
            this.getInvoiceById(params.id);
          } else {
            this.initializeThings();
          }

    });
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.roles = JSON.parse(localStorage.getItem("roles"));

   
  }
  initializeThings() {
    this.invoiceForm.patchValue({
      id: this.invoice.id,
      invoiceNo: this.invoice.invoiceNo,
      remarks: this.invoice.remarks,
      packageInfo: this.invoice.packageInfo,
      invoiceDate: this.invoice.invoiceDate,
      invoiceMonth: this.invoice.invoiceMonth,

      sTaxNo: this.invoice.vendor.sTaxNo,
      ntn: this.invoice.vendor.ntn,

      invoiceAmount: this.invoice.invoiceAmount,
      vendorStatus: this.invoice.invoiceStatus,
      // details: this.builder.array([]),
      // documents: this.builder.array([]),
      // panelties: this.builder.array([]),
      invoiceAmountWithoutTax: this.invoice.invoiceAmountWithoutTax,
      invoiceTaxAmount: this.invoice.invoiceTaxAmount,
      hospitalId: this.invoice.hospital.id,
      serviceId: this.invoice.service.id,
      vendorId: this.invoice.vendor.id,
      invoiceStatus: this.invoice.invoiceStatus,
      panelty: this.invoice.panelty,
      paneltyTax: this.invoice.paneltyTax,
      active: "Y",
      chequeNo: this.invoice.chequeNo,
      financeRemarks: this.invoice.financeRemarks,
      partialPayStatus: this.invoice.partialPayStatus,
      paidAmount: this.invoice.paidAmount,
      remainingAmount: this.invoice.remainingAmount,
      amountToBePaid:
        this.invoice.partialPayStatus == "FIRST_HALF_TO_PAY"
          ? (this.invoice.invoiceAmount * 0.7).toFixed()
          : this.invoice.partialPayStatus == "SECOND_HALF_TO_PAY"
          ? (this.invoice.invoiceAmount * 0.3).toFixed()
          : 0,
    });

    this.totalAmountWithoutTax = this.invoice.invoiceAmountWithoutTax;
    this.taxAmount = this.invoice.invoiceTaxAmount;
    this.totalNetAmount = this.invoice.invoiceAmount;

    this.getServiceDetails();
    if (this.invoice.invoiceStatus == this.userInfo.role.status) {
      if (
        this.userInfo.role.title == "Hospital" ||
        this.userInfo.role.title == "Outsource" ||
        this.userInfo.role.title == "Audit"
      ) {
        this.isServiceEditable = true;
        this.isDocumentEditable = true;
        this.ispenaltyEditable = true;
        this.isInvoiceEditable = true;
      }
    }

    if (this.userInfo.role.title == "Vendor") {
      this.isDocumentView = true;
    } else if (
      this.userInfo.role.title == "Hospital" ||
      this.userInfo.role.title == "Outsource" ||
      this.userInfo.role.title == "Audit"
    ) {
      this.isDocumentView = true;
      this.ispenaltyView = true;
    } else if (
      this.userInfo.role.title == "Operations" ||
      this.userInfo.role.title == "Finance"
    ) {
      this.ispenaltyView = true;
    } else if (
      this.userInfo.role.title == "Admin" ||
      this.userInfo.role.title == "Developer"
    ) {
      this.ispenaltyView = true;
      this.isDocumentView = true;
    }

    if (this.userInfo.role.title == "IC") {
      this.btnTitle = "Send";
    } else if (this.userInfo.role.title == "Audit") {
      this.btnTitle = "Pay";
    } else {
      this.btnTitle = "Approve";
    }
  }

  customSearchFn(term: string, item: any) {
    // debugger;
    console.log("term: ", term);
    console.log("item: ", item);
    term = term.toLowerCase();
    // return item.name.toLowerCase().indexOf(term) > -1 || item.location.toLowerCase() === term;
    return (
      item.name.toLowerCase().indexOf(term) > -1 ||
      item.location.toLowerCase().indexOf(term) > -1
    );
  }
  selectedLocation = "Punjab";
  ngOnInit() {
    console.log("penaltyServices:", this.penaltyServices.value);
  //  this.titleService.setTitle(this.invoice.invoiceNo);
  }

  formatDate(date: Date): string {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // formatDate(date: Date): string {
  //   const year = date.getFullYear();
  //   const month = ("0" + (date.getMonth() + 1)).slice(-2);
  //   const day = ("0" + date.getDate()).slice(-2);
  //   const hours = ("0" + date.getHours()).slice(-2);
  //   const minutes = ("0" + date.getMinutes()).slice(-2);
  //   const seconds = ("0" + date.getSeconds()).slice(-2);
  //   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // }

  formatMonth(date: Date): string {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}`;
  }
  getServiceDetails() {
    this.loadingPage = true;
    this.invoiceService
      .getServiceDetails(
        this.invoice.service.id,
        this.invoice.vendor.id,
        this.invoice.hospital.id || -1
      )
      .subscribe(
        (response) => {
          if (response) {
            this.serviceDetails = response;
            console.log(this.serviceDetails, "service detail");
            this.getRemarks();
            this.addAutoService();
            this.loadingPage = false;
          }
        },
        (error: any) => {
          this.toaster.error("There was an error getting the data");
          console.log(error);
          this.loadingPage = false;
        }
      );
  }

  addAutoService() {
    this.invoiceDetail = this.invoiceForm.get("details") as FormArray;
    this.serviceDetails.forEach((element) => {
      if (element.hospitalId == this.invoiceForm.get("hospitalId").value) {
        const i = this.invoice.details.findIndex(
          (e) => e.serviceDetailId == element.id
        );
        if (i > -1) {
          this.invoiceDetail.push(
            this.generateAutoService(this.invoice.details[i], element)
          );
        }
        this.filteredServiceDetails.push(element);
      }
    });
    this.distinctCategories = Array.from(
      this.filteredServiceDetails.reduce((categories, service) => {
        categories.add(service.category);
        return categories;
      }, new Set<string>())
    ).map((category) => ({ name: category }));
  }
  addNewService() {
    this.invoiceDetail = this.invoiceForm.get("details") as FormArray;
    this.rowCategoryServices.splice(0, 0, []);
    this.invoiceForm.controls.details.insert(0, this.generateRow());
  }

  deleteService(index) {
    this.invoiceForm.controls.details.removeAt(index);
    this.calculateTotalAmount();
  }

  generateRow() {
    return this.builder.group({
      category: this.builder.control("", Validators.required),
      serviceDetailId: this.builder.control("", Validators.required),
      amount: this.builder.control(0, Validators.required),
      perUnitAmount: this.builder.control(0, Validators.required),
      qty: this.builder.control(1, Validators.required),
      auto: this.builder.control("N"),
      taxPercentage: this.builder.control(0),
      taxAmount: this.builder.control(0),
      netAmount: this.builder.control(0, Validators.required),
      serviceDetailTitle: this.builder.control(""),
    });
  }
  get invServices() {
    return this.invoiceForm.get("details") as FormArray;
  }
  generateAutoService(element, serviceDetail) {
    return this.builder.group({
      category: serviceDetail.category,
      serviceDetailId: serviceDetail,
      perUnitAmount: element.amount,
      amount: element.amount,
      auto: "Y",
      qty: element.qty,
      taxPercentage: element.taxPercentage,
      taxAmount: element.taxAmount,
      netAmount: element.netAmount,
      serviceDetailTitle: serviceDetail.title,
      hospitalAssetTitle: element.hospitalAsset
        ? element.hospitalAsset.assetNo +
          " (" +
          element.hospitalAsset.asset.title +
          " - " +
          element.hospitalAsset.location +
          ")"
        : "NA",
      hospitalAssetId: element.hospitalAssetId,
    });
  }

  courierTrackingNum = "";
  courierRemarkId = -1;
  createInvoiceNew(data, status, partialPayStatus, hospitalApproveModal) {
    // debugger;
    this.createInvoiceData = data;
    this.createInvoiceStatus = status;
    this.createInvoicepartialPayStatus = partialPayStatus;

    if (this.userInfo.role.title == "Hospital") {
      this.modalRef = this.modalService.open(hospitalApproveModal);
    } else {
      this.createInvoice(data, status, partialPayStatus);
    }
  }

  submitInvoice() {
    // debugger;
    this.courierTrackingNum;
    this.courierRemarkId;
    this.createInvoiceData.courierTrackingNum = this.courierTrackingNum;
    this.createInvoiceData.courierRemarkId = this.courierRemarkId;
    this.createInvoiceData;
    this.createInvoice(
      this.createInvoiceData,
      this.createInvoiceStatus,
      this.createInvoicepartialPayStatus
    );
  }

  createInvoice(data, status, partialPayStatus) {
    this.loading = true;
    const filteredDocuments = this.checkedRemarks.filter(
      (item) => item.attached == "Y" || item.preExist == "Y"
    );

    const newData = {
      ...data,
      invoiceStatus: this.getStatus(
        status,
        data.invoiceStatus,
        partialPayStatus
      ),
      remainingAmount:
        partialPayStatus == "SECOND_HALF_TO_PAY" || partialPayStatus == "PAID"
          ? data.remainingAmount
          : data.invoiceAmount,
      partialPayStatus: partialPayStatus,
      details: data.details.map((element) => ({
        ...element,
        serviceDetailId: element.serviceDetailId.id,
      })),
      documents: filteredDocuments,
      panelties: data.panelties.map((element) => ({
        ...element,
        remarkId: element.remarkId.id,
      })),
    };
    this.invoiceService.editInvoice(newData).subscribe(
      (response) => {
        console.log("Invoice saved successfully", response);
        this.loading = false;
        this.toaster.success("Success");
        window.close();
      },
      (error) => {
        console.error("Error saving invoice", error);
        this.toaster.error("There was an error creating the invoice");
        this.loading = false;
      }
    );
  }

  payPartialnvoice(data) {
    const newData = {
      ...data,
      partialPayStatus:
        data.partialPayStatus == "FIRST_HALF_TO_PAY"
          ? "SECOND_HALF_TO_PAY"
          : data.partialPayStatus == "SECOND_HALF_TO_PAY"
          ? "PAID"
          : "NA",
      paidAmount: Number(data.paidAmount) + Number(data.amountToBePaid),
      remainingAmount: data.remainingAmount - data.amountToBePaid,
    };
    this.createInvoice(newData, 1, newData.partialPayStatus);
  }

  handleDropdownChange(index, event) {
    const selectedValue = event.value;
    const formGroup = (this.invoiceForm.get("details") as FormArray).at(
      index
    ) as FormGroup;

    // Patch the form group with the selected values
    formGroup.patchValue({
      category: selectedValue.category,
      serviceDetailId: selectedValue,
      amount: selectedValue.amount,
      perUnitAmount: selectedValue.amount,
      auto: selectedValue.auto,
      qty: selectedValue.qty,
      taxPercentage: selectedValue.taxPercentage,
      taxAmount: selectedValue.taxAmount,
      netAmount: selectedValue.netAmount,
      serviceDetailTitle: selectedValue.title,
    });
    this.calculateTotalAmount();
  }
  changeNetAmount(index) {
    const formGroup = (this.invoiceForm.get("details") as FormArray).at(
      index
    ) as FormGroup;
    const qty = formGroup.get("qty").value;
    if (qty && qty > 0) {
      const taxPercentage = formGroup.get("taxPercentage").value;
      const amount = formGroup.get("perUnitAmount").value * qty;

      const taxAmount = (amount * (taxPercentage / 100)).toFixed();
      const netAmount = (amount - parseFloat(taxAmount)).toFixed();
      //  const totalamount = amount * qty;

      formGroup.patchValue({
        taxAmount: taxAmount,
        netAmount: netAmount,
        amount: amount,
        // amount: totalamount,
      });
      this.calculateTotalAmount();
    } else {
      formGroup.patchValue({
        qty: 1,
      });
    }
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
    this.calculateTotalPenalty();

    this.invoiceForm.patchValue({
      invoiceAmount:
        totalAmountWithoutTax -
        taxAmount -
        this.invoiceForm.get("panelty").value +
        this.invoiceForm.get("paneltyTax").value,
      invoiceAmountWithoutTax: totalAmountWithoutTax,
      invoiceTaxAmount: taxAmount,
    });
    //     const invoiceAmount =
    //   totalAmountWithoutTax -
    //   taxAmount -
    //   this.invoiceForm.get("panelty").value +
    //   this.invoiceForm.get("paneltyTax").value;

    // // Format the invoice amounts with commas
    // const formattedInvoiceAmount = invoiceAmount.toLocaleString();
    // const formattedTotalAmountWithoutTax = totalAmountWithoutTax.toLocaleString();
    // const formattedTaxAmount = taxAmount.toLocaleString();

    // // Patch the values to the form
    // this.invoiceForm.patchValue({
    //   invoiceAmount: formattedInvoiceAmount,
    //   invoiceAmountWithoutTax: formattedTotalAmountWithoutTax,
    //   invoiceTaxAmount: formattedTaxAmount,
    // });
  }

  onCheckboxChange(remarkId: number, isChecked: boolean) {
    this.checkedStates[remarkId] = isChecked;
    const documentsArray = this.invoiceForm.get("documents") as FormArray;
    if (isChecked) {
      documentsArray.push(this.builder.control(remarkId));
    } else {
      const existingIndex = documentsArray.value.indexOf(remarkId);
      if (existingIndex !== -1) {
        documentsArray.removeAt(existingIndex);
      }
    }
    console.log(this.invoiceForm.get("documents") as FormArray);
  }

  getRemarks() {
    this.loadingPage = true;
    this.loadingRemarks = true;
    this.invoiceService
      .getRemarks(this.userInfo.role.id, this.invoice.serviceId)
      .subscribe(
        (response) => {
          if (response) {
            this.loadingRemarks = false;
            this.remarkTypes = response;
            const i = this.remarkTypes.findIndex((e) => e.id == 1);
            if (i > -1) {
              this.attachmentRemarks.push(this.remarkTypes[i].remarks);
              this.remarkTypes[i].remarks.forEach((element) => {
                const j = this.invoice.documents.findIndex(
                  (e) => e.remarkId == element.id
                );
                if (j > -1) {
                  const obj = {
                    remarkId: element.id,
                    description: element.description,
                    verified: this.invoice.documents[j].verified,
                    remarks: this.invoice.documents[j].remarks,
                    attached: this.invoice.documents[j].active,
                    preExist: "Y",
                    active: this.invoice.documents[j].active,
                  };
                  this.checkedRemarks.push(obj);
                } else {
                  const obj = {
                    remarkId: element.id,
                    description: element.description,
                    verified: "N",
                    remarks: "",
                    attached: "N",
                    preExist: "N",
                    active: "Y",
                  };
                  this.checkedRemarks.push(obj);
                }
              });
            } else {
              this.invoice.documents.forEach((element) => {
                const obj = {
                  remarkId: element.remarkId,
                  description: element.description,
                  verified: element.verified,
                  remarks: element.remarks,
                  attached: element.active,
                  preExist: "Y",
                  active: element.active,
                };
                this.checkedRemarks.push(obj);
              });
            }

            //   this.invoice.documents.forEach((element) => {
            //     const j = this.remarkTypes[i].remarks.findIndex(
            //       (e) => e.id == element.remarkId
            //     );
            //     if (j > -1) {
            //       const obj = {
            //         remarkId: this.remarkTypes[i].remarks[j].id,
            //         description: this.remarkTypes[i].remarks[j].description,
            //         verified: element.verified,
            //         remarks: element.remarks,
            //       };

            //       console.log(this.checkedRemarks);
            //       this.checkedRemarks.push(obj);
            //       this.remarkTypes[i].remarks.splice(j, 1);
            //       // this.onCheckboxChange(element.remarkId, true);
            //     } else {
            //       this.invoiceForm.controls.documents.insert(
            //         0,
            //         this.builder.control(element.remarkId)
            //       );
            //     }
            //   });
            // } else {
            //   this.invoice.documents.forEach((element) => {
            //     this.invoiceForm.controls.documents.insert(
            //       0,
            //       this.builder.control(element.remarkId)
            //     );
            //   });
            // }

            this.remarkTypes.forEach((remarkType) => {
              if (remarkType.id == 2) {
                remarkType.remarks.forEach((element) => {
                  this.penaltyRemarks.push(element);
                });
              }
            });

            this.remarkTypes.forEach((remarkType) => {
              if (remarkType.id == 3) {
                remarkType.remarks.forEach((element) => {
                  this.courierRemarks.push(element);
                });
              }
            });
            // debugger;
            console.log(" this.courierRemarks: ", this.courierRemarks);

            this.addExistingpenalty();
            this.calculateTotalAmount();
          }
        },
        (error: any) => {
          this.loadingPage = false;
          this.loadingRemarks = false;
          this.toaster.error("There was an error getting the data");
          console.log(error);
        }
      );
  }

  getCategoryServices(event, rowIndex) {
    this.rowCategoryServices[rowIndex] = [];
    this.filteredServiceDetails.forEach((element) => {
      if (element.category == event.value.name) {
        this.rowCategoryServices[rowIndex].push(element);
      }
    });
  }
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

  // deletePenalty(penalty: any) {
  //   const index = this.penaltyList.indexOf(penalty);
  //   if (index !== -1) {
  //     this.penaltyList.splice(index, 1);
  //   }
  //   console.log("this.penaltyList: ", this.penaltyList);
  // }
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

  navigate() {
    this.router.navigate(["/main/invoice-summary"]);
  }

  addNewpenalty() {
    this.invoiceForm.controls.panelties.insert(0, this.generatepenalty());
  }

  addExistingpenalty() {
    this.invoice.panelties.forEach((element) => {
      const i = this.penaltyRemarks.findIndex((e) => e.id == element.remarkId);
      if (i > -1) {
        this.invoiceForm.controls.panelties.insert(
          0,
          this.generateExistingpenalty(element, this.penaltyRemarks[i])
        );
      }
    });
  }

  generatepenalty() {
    // debugger;
    return this.builder.group({
      remarkId: this.builder.control("", Validators.required),
      amount: this.builder.control(0, Validators.required),
      remarks: this.builder.control("", Validators.required),
      auto: "N",
      active: "Y",
      remarkTitle: this.builder.control(""),
      taxPercentage: this.builder.control(0),
      taxAmount: this.builder.control(0),
      hospitalAmount: this.builder.control(0),
      outsourceAmount: this.builder.control(0),
      auditAmount: this.builder.control(0),
    });
  }

  generateExistingpenalty(element, penaltyRemark) {
    console.log("element", element);
    console.log("amount", element.amount);
    if (this.userInfo.role.title == "Hospital") {
      element.hospitalAmount = element.amount;
    } else if (this.userInfo.role.title == "Outsource") {
      element.outsourceAmount = element.amount;
    } else if (this.userInfo.role.title == "Audit") {
      element.auditAmount = element.amount;
    }
    console.log("element.outsourceAmount", element.outsourceAmount);
    return this.builder.group({
      remarkId: penaltyRemark,
      amount: element.amount,
      remarks: element.remarks,
      auto: "Y",
      active: "Y",
      remarkTitle: penaltyRemark.description,
      taxPercentage: element.taxPercentage,
      taxAmount: element.taxAmount,
      hospitalAmount: element.hospitalAmount,
      outsourceAmount: element.outsourceAmount,
      auditAmount: element.auditAmount,
    });
  }
  get penaltyServices() {
    // debugger;
    return this.invoiceForm.get("panelties") as FormArray;
  }
  // getHospitalAmount(index: number): number {
  //   // debugger;
  //   const penaltyGroup = this.penaltyServices.at(index) as FormGroup;
  //   const hospitalAmountControl = penaltyGroup.get('hospitalAmount') as FormControl;

  //   let outsourceAmountControl = penaltyGroup.get('outsourceAmount') as FormControl;
  //   outsourceAmountControl.setValue(hospitalAmountControl.value);

  //   console.log('penaltyGroup:', penaltyGroup);
  //   console.log('hospitalAmountControl:', hospitalAmountControl);

  //   // this.formatDate.pactValues({
  //   //   outsourceAmount = hospitalAmountControl.value;
  //   // })

  //   return hospitalAmountControl.value;
  // }

  getAuditAmount(index: number): number {
    // debugger;
    const penaltyGroup = this.penaltyServices.at(index) as FormGroup;
    const hospitalAmountControl = penaltyGroup.get(
      "outsourceAmount"
    ) as FormControl;

    let outsourceAmountControl = penaltyGroup.get("auditAmount") as FormControl;
    outsourceAmountControl.setValue(hospitalAmountControl.value);

    console.log("penaltyGroup:", penaltyGroup);
    console.log("hospitalAmountControl:", hospitalAmountControl);

    // this.formatDate.pactValues({
    //   outsourceAmount = hospitalAmountControl.value;
    // })

    return hospitalAmountControl.value;
  }

  deletepenalty(index) {
    this.invoiceForm.controls.panelties.removeAt(index);
    const penaltyArray = this.invoiceForm.get("panelties") as FormArray;
    let totalPenaltyAmount = 0;
    let penaltyTaxAmount = 0;
    penaltyArray.controls.forEach((control: FormGroup) => {
      totalPenaltyAmount =
        totalPenaltyAmount + parseFloat(control.get("amount").value);
      penaltyTaxAmount =
        penaltyTaxAmount + parseFloat(control.get("taxAmount").value);
    });
    totalPenaltyAmount = parseFloat(totalPenaltyAmount.toFixed());
    penaltyTaxAmount = parseFloat(penaltyTaxAmount.toFixed());
    this.invoiceForm.patchValue({
      panelty: totalPenaltyAmount,
      paneltyTax: penaltyTaxAmount,
    });
  }

  printPage() {
    // Hide sidebar and any other elements you don't want to print
    // document.body.classList.add('printingClass');
    // this.showFirstDiv = false;

    const elementsToHidenew = document.querySelectorAll(".newClass");
    elementsToHidenew.forEach((element: HTMLElement) => {
      element.style.display = "none";
    });

    const elementsToHidenew2 = document.querySelectorAll(".newClass2");
    elementsToHidenew2.forEach((element: HTMLElement) => {
      element.style.display = "";
      element.style.display = "block";
    });

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

    elementsToHidenew.forEach((element: HTMLElement) => {
      element.style.display = ""; // Restore original display property
    });

    elementsToHidenew2.forEach((element: HTMLElement) => {
      element.style.display = "none"; // Restore original display property
    });

    // this.showFirstDiv = true;
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
         <span class="labelText"> ${this.formatNumber(
           this.invoice.invoiceAmount
         )} </span> was submitted by
         the service provider and same has been examined, scrutinized and verified by Admin Officer, Finance 
         & Budget Officer, HR & Legal Officer, IT Statistical Officer and the Medical Suprintendent of the said hospital.</p>
        <p>2.   The Medical Suprintendent, after deduction of Rs 
        <span class="labelText">
         ${this.formatNumber(this.invoice.panelty)} 
         </span>
        as penalties has recommended the amount
         worth Rs 
         <span class="labelText"> 
         ${this.formatNumber(
           this.getAmountPayable(
             this.invoice.invoiceAmountWithoutTax,
             this.invoice.panelty
           )
         )} 
         </span>
         for payment to the service provider.</p>
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

  htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Print Content</title>
    </head>
    <body>
        <h1>This is the content to be printed</h1>
        <p>More content...</p>
    </body>
    </html>
`;
  printHTML() {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.write(this.htmlContent);
    doc.close();
    iframe.contentWindow.print();
  }

  formatNumber(num) {
    const formattedNumber = this.decimalPipe.transform(num, "1.0-0");
    return formattedNumber;
  }

  addPenaltiesTotal() {
    const arr = this.invoice?.panelties;
    let sum = 0;
    arr?.forEach((e) => {
      sum = e.amount;
    });
    return sum;
  }
  getAmountPayable(invoiceAmount: any, paneltiesTotal: any) {
    return invoiceAmount - paneltiesTotal;
  }
  getStatus(approvalStatus, invoiceStatus, partialPayStatus) {
    if (approvalStatus == 1) {
      if (
        partialPayStatus == "NA" ||
        partialPayStatus == "FIRST_HALF_TO_PAY" ||
        partialPayStatus == "PAID"
      ) {
        return this.userInfo.role.title;
      } else {
        return this.invoice.invoiceStatus;
      }
    } else {
      const i = this.roles.findIndex((e) => e.title == invoiceStatus);
      return this.roles[i].status;
    }
  }

  calculatePenaltyAmount(index) {
    // debugger;
    let amount = 0;
    const formGroup = (this.invoiceForm.get("panelties") as FormArray).at(
      index
    ) as FormGroup;
    if (formGroup.value.remarkId.id) {
      if (this.userInfo.role.title == "Hospital") {
        amount = formGroup.value.hospitalAmount;
      } else if (this.userInfo.role.title == "Outsource") {
        amount = formGroup.value.outsourceAmount;
      } else if (this.userInfo.role.title == "Audit") {
        amount = formGroup.value.auditAmount;
      }
      const index = this.penaltyRemarks.findIndex(
        (e) => e.id == formGroup.value.remarkId.id
      );
      const taxAmount = (
        amount *
        (this.penaltyRemarks[index].paneltyTaxPercentage / 100)
      ).toFixed();
      formGroup.patchValue({
        amount: amount,
        taxAmount: taxAmount,
        taxPercentage: this.penaltyRemarks[index].paneltyTaxPercentage,
      });
      this.calculateTotalAmount();
    }
  }

  calculateTotalPenalty() {
    const penaltyArray = this.invoiceForm.get("panelties") as FormArray;
    let totalPenaltyAmount = 0;
    let penaltyTaxAmount = 0;
    penaltyArray.controls.forEach((control: FormGroup) => {
      totalPenaltyAmount =
        totalPenaltyAmount + parseFloat(control.get("amount").value) || 0;
      penaltyTaxAmount =
        penaltyTaxAmount + parseFloat(control.get("taxAmount").value) || 0;
    });
    totalPenaltyAmount = parseFloat(totalPenaltyAmount.toFixed());
    penaltyTaxAmount = parseFloat(penaltyTaxAmount.toFixed());
    this.invoiceForm.patchValue({
      panelty: totalPenaltyAmount,
      paneltyTax: penaltyTaxAmount,
    });
  }

  toggleVerified(index): void {
    const currentItem = this.checkedRemarks[index];
    currentItem.verified = currentItem.verified === "Y" ? "N" : "Y";
  }

  toggleAttached(index): void {
    const currentItem = this.checkedRemarks[index];
    currentItem.attached = currentItem.attached === "Y" ? "N" : "Y";
    currentItem.active = currentItem.attached;
  }

  sortedCheckedRemarks(): any[] {
    // Sort checkedRemarks by 'attached' property ('Y' first, then 'N')
    return this.checkedRemarks.sort((a, b) => {
      if (a.attached === "Y" && b.attached === "N") {
        return -1; // 'a' (attached) comes before 'b' (not attached)
      } else if (a.attached === "N" && b.attached === "Y") {
        return 1; // 'b' (attached) comes before 'a' (not attached)
      } else {
        return 0; // Maintain current order if both are 'Y' or both are 'N'
      }
    });
  }

  submitModal(mediumModalContent) {
    this.modalRef = this.modalService.open(mediumModalContent);
  }

  ////
  getInvoiceById(invoiceId) {
    this.loadingPage = true;
    this.invoiceService
      .getInvoiceById(
        invoiceId
      )
      .subscribe(
        (response) => {
          if (response) {
            this.invoice = response;
            console.log("invoice: ", this.invoice);
            this.loadingPage = false;
            this.titleService.setTitle(this.invoice.invoiceNo);
           this.initializeThings();
          
          }
        },
        (error: any) => {
          console.log("Error");
          this.loadingPage = false;
        }
      );
  }
}
