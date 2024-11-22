import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormArray, FormGroup } from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
// import { EJComponents } from 'ej-angular2';
// import { DataService } from '../../services/data.service';
// import { Select2OptionData } from 'ng-select2';
import { FormatNumberDirective } from "../format-number.directive";
interface City {
  name: string;
  population: any;
}

@Component({
  selector: "app-approve-complaint",
  templateUrl: "./approve-complaint.component.html",
  styleUrls: ["./approve-complaint.component.scss"],
})
export class ApproveComplaintComponent implements OnInit {
  @ViewChild(FormatNumberDirective)
  formatNumberDirective!: FormatNumberDirective;
  hospitalList: any = [];
  invoiceDetail: FormArray;
  serviceDetails: any = [];
  filteredServiceDetails: any = [];
  complaintForm: any;
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
  hospitalAssets: any = [];
  filteredHospitalAssets: any = [];
  vendorList: any = [];
  hospitalId: any;
  loadingAssets: boolean;
  assetDropDownPlaceHolder = "Assets are Loading..";
  complaint: any;
  loadingData: boolean;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private invoiceService: InvoiceService,
    private toaster: ToastrService, // private service: DataService
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.complaint = JSON.parse(
        localStorage.getItem("complaint" + params.id)
      );
    });

    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.serviceId = this.userInfo.serviceId;
    this.hospitalId = this.userInfo.hospitalId ? this.userInfo.hospitalId : -1;
    console.log("this.complaint: ", this.complaint);
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    debugger;
    const formattedDateComplaint = this.formatDate(new Date(this.complaint.complaintDate));
    const formattedMonth = this.formatMonth(currentDate);
    this.complaintForm = this.builder.group({
      complaintNo: this.builder.control(
        this.complaint.complaintNo,
        Validators.required
      ),
      hospitalId: this.builder.control(this.complaint?.hospital?.id),
      // remarks: this.builder.control(""),
      packageInfo: this.builder.control(this.complaint?.hospital?.packageNo),
      serviceId: this.builder.control(this.complaint?.serviceId),
      vendorId: this.builder.control(this.complaint?.vendor?.id),
      vendorTitle: this.builder.control(this.complaint?.vendor?.title),
      complaintDate: this.builder.control(formattedDateComplaint, Validators.required),
      complaintMonth: this.builder.control(formattedMonth, Validators.required),
      resolveDate: this.builder.control(formattedDate, Validators.required),
      complaintStatus: this.builder.control("Created"),
      details: this.builder.array(this.complaint?.details),
      active: "Y",
    });
    console.log("this.complaintForm: ", this.complaintForm);
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
    this.cities = [
      { name: "Lahore", location: "Punjab", isActive: true, disabled: false },
      { name: "Karachi", location: "Sindh", isActive: false, disabled: true },
      { name: "Quetta", location: "Baloch", isActive: true, disabled: false },
      { name: "Lahore", location: "Punjab", isActive: true, disabled: false },
      { name: "Karachi", location: "Sindh", isActive: false, disabled: true },
      { name: "Quetta", location: "Baloch", isActive: true, disabled: false },
      { name: "Lahore", location: "Punjab", isActive: true, disabled: false },
      { name: "Karachi", location: "Sindh", isActive: false, disabled: true },
      { name: "Quetta", location: "Baloch", isActive: true, disabled: false },
      { name: "Lahore", location: "Punjab", isActive: true, disabled: false },
      { name: "Karachi", location: "Sindh", isActive: false, disabled: true },
      { name: "Quetta", location: "Baloch", isActive: true, disabled: false },
    ];

    // this.getServiceDetails();
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
        this.serviceId,
        this.vendorId || -1,
        this.hospitalId || -1
      )
      .subscribe(
        (response) => {
          if (response) {
            this.serviceDetails = response;
            console.log("this.serviceDetails: ", this.serviceDetails);
            // this.getRemarks();
            this.getAssets();
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
    // debugger;
    this.vendorId = this.complaintForm.get("vendorId").value.id;
    this.hospitalId = this.hospitalId;
    // const i = this.hospitalList.findIndex(
    //   (e) => e.id == this.complaintForm.get("hospitalId")?.value.id
    // );
    // this.complaintForm
    //   .get("packageInfo")
    //   .setValue(this.hospitalList[i].packageNo);
    this.invoiceDetail = this.complaintForm.get("details") as FormArray;
    this.invoiceDetail.clear();
    this.serviceDetails.forEach((element) => {
      if (element.hospitalId == this.hospitalId) {
        if (element.auto == "Y") {
          // this.invoiceDetail.push(this.generateAutoService(element));
        } else {
          this.filteredServiceDetails.push(element);
        }
      }
    });
    // console.log("this.hospitalAssets: ",this.hospitalAssets);
    // this.hospitalAssets.forEach((element) => {
    //   if (element.hospital.id == this.hospitalId) {
    //     const obj = {
    //       hospitalAssetId: element.id,
    //       title: element.asset.title,
    //     };
    //     this.filteredHospitalAssets.push(obj);
    //   }
    // });
    // console.log("this.filteredHospitalAssets: ",this.filteredHospitalAssets);
    this.distinctCategories = Array.from(
      this.filteredServiceDetails.reduce((categories, service) => {
        categories.add(service.category);
        return categories;
      }, new Set<string>())
    ).map((category) => ({ name: category }));
    // this.calculateTotalAmount();
  }
  addNewService() {
    this.invoiceDetail = this.complaintForm.get("details") as FormArray;
    this.rowCategoryServices.splice(0, 0, []);
    this.complaintForm.controls.details.insert(0, this.generateRow());
  }

  deleteService(index) {
    this.complaintForm.controls.details.removeAt(index);
    this.calculateTotalAmount();
  }

  deletePanelty(index) {
    this.complaintForm.controls.panelties.removeAt(index);
    this.calculateTotalAmount();
  }

  generateRow() {
    return this.builder.group({
      category: this.builder.control("", Validators.required),
      serviceDetailId: this.builder.control("", Validators.required),
      // amount: this.builder.control(0, Validators.required),
      // perUnitAmount: this.builder.control(0, Validators.required),
      qty: this.builder.control(1, Validators.required),
      auto: this.builder.control("N"),
      // taxPercentage: this.builder.control(0),
      // taxAmount: this.builder.control(0),
      // netAmount: this.builder.control(0, Validators.required),
      serviceDetailTitle: this.builder.control(""),
      hospitalAssetId: this.builder.control(""),
    });
  }
  get invServices() {
    return this.complaintForm.get("details") as FormArray;
  }
  generateAutoService(element) {
    return this.builder.group({
      category: element.category,
      serviceDetailId: element,
      perUnitAmount: element.amount,
      amount: element.amount,
      auto: element.auto,
      qty: element.qty,
      taxPercentage: element.taxPercentage,
      taxAmount: element.taxAmount,
      netAmount: element.netAmount,
      serviceDetailTitle: element.title,
      hospitalAssetId: -1,
    });
  }

  // createInvoice(data) {
  //   // debugger;
  //   this.loading = true;
  //   data.vendorId = this.vendorId;

  //   console.log("data in createInvoice: ", data);
  //   console.log("data:", JSON.stringify(data));
  //   // const documents = data.documents.filter(
  //   //   (value) => typeof value === "number"
  //   // );
  //   // const documentsObjects = documents.map((remarkId) => ({
  //   //   remarkId: remarkId,
  //   //   active: "Y",
  //   // }));

  //   const newData = {
  //     ...data,
  //     details: data.details.map((element) => ({
  //       ...element,
  //       // serviceDetailId:element?.hospitalAssetId?.id, 
  //       serviceDetailId:-1, 
  //       hospitalAssetId: element?.hospitalAssetId?.id || -1,
  //       complaintId: data.id
  //     })),

  //     // documents: documentsObjects,
  //     // panelties: data.panelties.map((element) => ({
  //     //   ...element,
  //     //   remarkId: element.remarkId.id,
  //     // })),
  //   };
  //   console.log("newData: ", newData);
  //   console.log("data:", JSON.stringify(newData));
  //   this.invoiceService.saveComplaint(newData).subscribe(
  //     (response) => {
  //       console.log("Complaint saved successfully", response);
  //       debugger;
  //       this.loading = false;
  //       this.toaster.success("Complaint created successfully");
  //       // window.close();
  //     },
  //     (error) => {
  //       console.error("Error saving Complaint", error);
  //       this.toaster.error("There was an error creating the Complaint");
  //       this.loading = false;
  //     }
  //   );
  // }

  handleDropdownChange(index, event) {
    const selectedValue = event.value;
    const formGroup = (this.complaintForm.get("details") as FormArray).at(
      index
    ) as FormGroup;

    // Patch the form group with the selected values
    formGroup.patchValue({
      category: selectedValue.category,
      serviceDetailId: selectedValue,
      // amount: selectedValue.amount,
      // perUnitAmount: selectedValue.amount,
      auto: selectedValue.auto,
      qty: selectedValue.qty,
      // taxPercentage: selectedValue.taxPercentage,
      // taxAmount: selectedValue.taxAmount,
      // netAmount: selectedValue.netAmount,
      serviceDetailTitle: selectedValue.title,
    });
    // this.calculateTotalAmount();
  }
  changeNetAmount(index) {
    const formGroup = (this.complaintForm.get("details") as FormArray).at(
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
    const detailsArray = this.complaintForm.get("details") as FormArray;

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
    this.complaintForm.patchValue({
      invoiceAmount: totalNetAmount,
      invoiceAmountWithoutTax: totalAmountWithoutTax,
      invoiceTaxAmount: taxAmount,
    });

    // this.formatNumberDirective.formatAndUpdate();
  }

  onCheckboxChange(remarkId: number, isChecked: boolean) {
    this.checkedStates[remarkId] = isChecked;
    const documentsArray = this.complaintForm.get("documents") as FormArray;
    if (isChecked) {
      documentsArray.push(this.builder.control(remarkId));
    } else {
      const existingIndex = documentsArray.value.indexOf(remarkId);
      if (existingIndex !== -1) {
        documentsArray.removeAt(existingIndex);
      }
    }
    console.log(this.complaintForm.get("documents") as FormArray);
  }

  getRemarks() {
    this.loadingPage = true;
    this.invoiceService
      .getRemarks(this.userInfo.role.id, this.userInfo.serviceId)
      .subscribe(
        (response) => {
          if (response) {
            this.remarkTypes = response;

            this.remarkTypes.forEach((remarkType) => {
              if (remarkType.id == 2) {
                remarkType.remarks.forEach((element) => {
                  this.penaltyRemarks.push(element);
                });
                console.log(this.penaltyRemarks);
              }
            });
          }
        },
        (error: any) => {
          this.loadingPage = false;
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
    this.router.navigate(["/main/complaint-list"]);
  }

  addNewPanelty() {
    this.complaintForm.controls.panelties.insert(0, this.generatePanelty());
  }

  generatePanelty() {
    return this.builder.group({
      remarkId: this.builder.control("", Validators.required),
      amount: this.builder.control(0, Validators.required),
      remarks: this.builder.control("", Validators.required),
      active: "Y",
    });
  }
  get paneltyServices() {
    return this.complaintForm.get("panelties") as FormArray;
  }

  deletePenalty(penalty: any) {
    const index = this.penaltyList.indexOf(penalty);
    if (index !== -1) {
      this.penaltyList.splice(index, 1);
    }
    console.log("this.penaltyList: ", this.penaltyList);
  }

  getAssets() {
    this.loadingPage = true;
    this.loadingAssets = true;
    console.log("in get assets");
    this.invoiceService.getAssets().subscribe(
      (response) => {
        if (response) {
          this.hospitalAssets = response;
          console.log(
            "this.hospitalAssets in get assets: ",
            this.hospitalAssets
          );

          console.log("this.hospitalAssets: ", this.hospitalAssets);
          let filteredHospitalAssets = [];
          this.hospitalAssets.forEach((element) => {
            if (element.hospital.id == this.hospitalId) {
              const obj = {
                hospitalAssetId: element.id,
                title: element.asset.title,
              };
              filteredHospitalAssets.push(obj);
              this.filteredHospitalAssets = filteredHospitalAssets;
            }
          });
          console.log(
            "this.filteredHospitalAssets: ",
            this.filteredHospitalAssets
          );

          this.assetDropDownPlaceHolder = "Select Asset";
        }
      },
      (error: any) => {
        this.loadingPage = false;
        this.loadingAssets = false;
        this.toaster.error("There was an error getting the data");
        console.log(error);
      }
    );
  }

  approveComplaint() {
    this.loadingData = true;
    this.loading = true;
    let complaint = this.complaint;
    debugger;
    complaint.complaintStatus = "Resolved";
    complaint.resolveDate = this.complaintForm.get("resolveDate").value;
    delete complaint.serviceDetail;

    for (let comp of complaint.details) {
    //  comp.complaintId = complaint.id;
      delete comp.serviceDetail;
    }
    this.invoiceService.updateComplaintStatus(complaint).subscribe(
      (response) => {
        // debugger;
        console.log("Complaint Resolved successfully", response);
        // console.log("editHospital before splice hospitalList: ",this.hospitalList);
        // let index = this.hospitalList.findIndex((e)=> e.id == this.selectedHospital.id);
        // if(index>-1){
        //   this.hospitalList.splice(index,1,this.selectedHospital);
        this.loadingData = false;
        this.loading = false;
        this.toaster.success("Complaint Resolved successfully");
       window.close();

        // to close all opened modal
        // this.modalService.dismissAll();

        // to close specific modal
      },
      (error) => {
        console.error("Error approving Complaint", error);
        this.toaster.error("Error approving Complaint");
        this.loadingData = false;
        this.loading = false;
      }
    );
  }
}
