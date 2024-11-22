import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  Validators,
  FormArray,
  FormGroup,
  ValidatorFn,
  AbstractControl,
} from "@angular/forms";
import { InvoiceService } from "../invoice.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { timeout } from "rxjs/operators";

@Component({
  selector: "app-feeder-laundry-in",
  templateUrl: "./feeder-laundry-in.component.html",
  styleUrls: ["./feeder-laundry-in.component.scss"],
})
export class FeederLaundryInComponent implements OnInit {
  hospitalList: any = [];
  hospitalRelationDTO: any = [];
  itemsList: any = [];
  invoiceDetail: FormArray;
  serviceDetails: any = [];
  filteredServiceDetails: any = [];
  invoiceForm: any;
  feederId: any;
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
  vendorListNew: any[] = [
    { id: "F1", title: "F1" },
    { id: "F2", title: "F2" },
    { id: "F3", title: "F3" },
    { id: "F4", title: "F4" },
  ];
  satelliteId: any;
  loadingAssets: boolean;
  feederHospitals: any[];
  laundryForm: FormGroup;
  selectedFeeder: any = {};
  satelliteHospitals: any[];
  assetDropDownPlaceHolder = "Assets are Loading..";
  currentDateTime: string;
  routeList: any = [];
  constructor(
    private activatedRoutes: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private builder: FormBuilder,
    private invoiceService: InvoiceService,
    private toaster: ToastrService // private service: DataService
  ) {
    this.activatedRoutes.params.subscribe((params) => {
      this.feederId = params.serviceId;
    });
    // this.resize = false;
    // this.button_display = false;
    this.hospitalList = JSON.parse(localStorage.getItem("hospitals"));
    console.log(this.hospitalList);

    this.vendorList = JSON.parse(localStorage.getItem("vendors"));

    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const hospitalId = this.userInfo.hospitalId;
    const username = this.userInfo.username;
    this.hospitalRelationDTO = JSON.parse(
      localStorage.getItem("hospitalRelationDTO")
    );
    console.log(this.hospitalRelationDTO);
    // this.vendorId = this.userInfo.vendor ? this.userInfo.vendor.id : -1;
    this.satelliteId = this.userInfo.hospitalId ? this.userInfo.hospitalId : -1;
    this.hospitalRelationDTO = JSON.parse(
      localStorage.getItem("hospitalRelationDTO")
    );
    this.feederHospitals = this.hospitalRelationDTO.filter(
      (hospital) => hospital.relationType === "feeder"
    );
    this.selectedFeeder = this.feederHospitals[0];

    this.satelliteHospitals = this.hospitalRelationDTO.filter(
      (hospital) => hospital.relationType === "satellite"
    );
    const currentDate = new Date();
    const formattedDate = this.formatDate(currentDate);
    const formattedMonth = this.formatMonth(currentDate);
    this.invoiceForm = this.builder.group({
      // batchNo: this.builder.control("", Validators.required),
      batchNo: this.builder.control(""),
      routeId: this.builder.control(
        this.routeList[0]?.id || null,
        Validators.required
      ),
      packageInfo: this.builder.control(this.userInfo?.hospital?.packageNo),
      feederId: this.builder.control(this.userInfo.hospitalId),
      vendorId: this.builder.control(
        this.satelliteHospitals[0]?.vendorId || -1
      ),
      laundryDate: this.builder.control(formattedDate, Validators.required),
      laundryMonth: this.builder.control(""),
      laundryType: this.builder.control("RECEIVE"),
      details: this.builder.array([]),
      active: "Y",
    });
    // this.invoiceForm.patchValue({
    //   feederId: this.selectedFeeder.id,
    //   vendorId: this.selectedFeeder.vendorId,
    // });
    this.laundryForm = this.builder.group({
      laundryDate: [""],
    });
  }

  customSearchFn(term: string, item: any) {
    //
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
    this.getLaundryRoutes();
    // this.getServiceDetails();
    this.cities = [
      { name: "Lahore", location: "Punjab", isActive: true, disabled: false },
      { name: "Karachi", location: "Sindh", isActive: false, disabled: true },
    ];

    //    this.getLaundryItems();
    const currentDate = new Date().toISOString().substring(0, 10);
    // this.invoiceForm = this.builder.group({
    //   laundryDate: [currentDate],
    //   batchNo: ['']
    // });

    // Extract the month from the current date and call getBatchNumber
    // const currentMonth = this.extractMonthFromDate(currentDate);
    // this.getBatchNumber(currentMonth);
    this.currentDateTime = new Date().toLocaleString();
  }

  formatDate(date: Date): string {
    //
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatMonth(date: Date): string {
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}`;
  }
  getServiceDetails() {
    this.loadingPage = true;
    this.invoiceService
      .getServiceDetails(4, this.vendorId || -1, this.userInfo.hospitalId || -1)
      .subscribe(
        (response) => {
          if (response) {
            this.serviceDetails = response;
            console.log("this.serviceDetails: ", this.serviceDetails);
            // this.getRemarks();
            // this.getAssets();
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

  addNewService() {
    this.rowCategoryServices.splice(0, 0, []);
    this.details.insert(0, this.generateRow());
  }

  addAutoService() {
    //
    this.vendorId = this.invoiceForm.get("vendorId").value.id;
    this.satelliteId = this.satelliteId;
    // const i = this.hospitalList.findIndex(
    //   (e) => e.id == this.invoiceForm.get("hospitalId")?.value.id
    // );
    // this.invoiceForm
    //   .get("packageInfo")
    //   .setValue(this.hospitalList[i].packageNo);
    this.invoiceDetail = this.invoiceForm.get("details") as FormArray;
    this.invoiceDetail.clear();
    this.serviceDetails.forEach((element) => {
      if (element.hospitalId == this.satelliteId) {
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
  // addNewService() {
  //   //
  //   this.invoiceDetail = this.invoiceForm.get("details") as FormArray;
  //   this.rowCategoryServices.splice(0, 0, []);
  //   this.invoiceForm.controls.details.insert(0, this.generateRow());
  // }
  generateRow(): FormGroup {
    return this.builder.group({
      title: this.builder.control("", Validators.required),
      qty: this.builder.control(1, Validators.required),
      auto: this.builder.control("N"), // Adding auto control for conditional rendering
      id: this.builder.control(""),
      remarks: this.builder.control(""),
    });
  }
  deleteService(index) {
    this.invoiceForm.controls.details.removeAt(index);
    this.calculateTotalAmount();
  }
  onFeederSelect(id: number) {
    this.feederId = id;
    // Set the selected feeder ID to the feederId control of the form
    this.invoiceForm.patchValue({
      feederId: id,
    });
  }

  // onFeederSelect(id: number) {
  //   this.feederId = id;
  //   // Set the selected feeder ID to the feederId control of the form
  //   this.invoiceForm.patchValue({
  //     feederId: id,
  //   });
  // }

  deletePanelty(index) {
    this.invoiceForm.controls.panelties.removeAt(index);
    this.calculateTotalAmount();
  }
  getCategoryServices(event, rowIndex) {
    //
    this.rowCategoryServices[rowIndex] = [];
    const selectedTitle = event.value; // Assuming event.value is the title of the selected item
    const selectedItem = this.itemsList.find(
      (item) => item.title === selectedTitle.title
    );
    if (selectedItem) {
      this.rowCategoryServices[rowIndex].push(selectedItem);
      const detailFormGroup = this.details.at(rowIndex) as FormGroup;
      detailFormGroup.get("title").setValue(selectedItem.title);
      detailFormGroup.get("id").setValue(selectedItem.id);
      // Set other properties if needed
    }
    console.log(this.rowCategoryServices);
  }
  // generateRow() {
  //   return this.builder.group({
  //     title: this.builder.control("", Validators.required),

  //     qty: this.builder.control(1, Validators.required),

  //   });
  // }
  get invServices() {
    //
    return this.invoiceForm.get("details") as FormArray;
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

  createInvoice(data) {
    this.loading = true;
    const currentDate = new Date();
    const selectedDate = new Date(data.laundryDate);
    selectedDate.setHours(currentDate.getHours());
    selectedDate.setMinutes(currentDate.getMinutes());
    selectedDate.setSeconds(currentDate.getSeconds());
    const formattedLaundryDate = this.formatDateWithCurrentTime(selectedDate);
    console.log("data: ", data);

    data.routeId = data.routeId.id ? data.routeId.id : data.routeId;
    console.log("data: ", data);

    const newData = {
      ...data,
      createdDatetime: formattedLaundryDate,
      details: data.details.map((element) => {
        // Extract 'id' and keep the rest of the properties in 'rest'
        const { id, ...rest } = element;
        return {
          ...rest,
          serviceDetailId: id,
          satelliteDispatchQty: element.qty,
          remarks: element.remarks,
          title: element.title,
        };
      }),
    };
    //
    console.log("newData: ", newData);
    console.log("data:", JSON.stringify(newData));
    this.invoiceService.saveFeederLaundry(newData).subscribe(
      (response) => {
        console.log("Invoice saved successfully", response);
        this.router.navigate(["/main"]);
        this.loading = false;
        this.toaster.success("Laundry sent successfully");
      },
      (error) => {
        console.error("Error saving invoice", error);
        this.toaster.error("There was an error sending the laundry");
        this.loading = false;
      }
    );
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
    this.invoiceForm.patchValue({
      invoiceAmount: totalNetAmount,
      invoiceAmountWithoutTax: totalAmountWithoutTax,
      invoiceTaxAmount: taxAmount,
    });

    // this.formatNumberDirective.formatAndUpdate();
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

  // getCategoryServices(event, rowIndex) {
  //   //
  //   this.rowCategoryServices[rowIndex] = [];
  //   this.itemsList.forEach((element) => {
  //     if (element.title == event.value.title) {
  //       this.rowCategoryServices[rowIndex].push(element);
  //     }
  //   });
  //   console.log(this.rowCategoryServices);
  // }

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
    this.router.navigate(["/main/invoice-summary"]);
  }

  addNewPanelty() {
    this.invoiceForm.controls.panelties.insert(0, this.generatePanelty());
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
    return this.invoiceForm.get("panelties") as FormArray;
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
            if (element.hospital.id == this.satelliteId) {
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
  getLaundryItems() {
    this.loading = true;
    this.invoiceService.getLaundryItems(4).subscribe(
      (response) => {
        if (response) {
          this.itemsList = response;
          console.log("launry item: ", this.itemsList);
          this.loading = false;
        }
      },
      (error: any) => {
        console.log("Error");
        this.loading = false;
      }
    );
  }
  updateLaundryDate(event: any) {
    //
    const selectedDateString = event.target.value;
    if (selectedDateString) {
      const selectedDate = new Date(selectedDateString);
      const updatedDate = this.formatDateWithCurrentTime(selectedDate);
      this.laundryForm.controls["laundryDate"].setValue(updatedDate);
    }
  }
  formatDateWithCurrentTime(date: Date): string {
    const now = new Date();
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
    date.setMilliseconds(0);

    // Manually format date to 'YYYY-MM-DDTHH:mm:ss'
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  setInitialLaundryDate() {
    const now = new Date();
    const initialDate = this.formatDateWithCurrentTime(now);
    this.laundryForm.controls["laundryDate"].setValue(initialDate);
  }

  getBatchNumber(month: string) {
    this.loadingPage = true;
    this.invoiceService
      .getBatchNumber(this.satelliteId, this.selectedFeeder.id, month)
      .subscribe(
        (response) => {
          if (response) {
            this.invoiceForm.get("batchNo").setValue(response.batchNo);
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
  onLaundryDateChange() {
    const laundryDateValue = this.invoiceForm.get("laundryDate").value;
    if (laundryDateValue) {
      const month = this.extractMonthFromDate(laundryDateValue);
      this.getBatchNumber(month);
    }
  }

  extractMonthFromDate(date: string): string {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString("default", { month: "2-digit" });
    const year = dateObj.getFullYear();
    return `${year}-${month}`;
  }

  ////
  getLaundryRoutes() {
    // this.invoiceForm.get('routeId')?.setValue(1);
    // this.invoiceForm.patchValue({
    //   routeId: 1,
    // });
    this.loadingPage = true;
    this.invoiceService
      .getLaundryFeederRoutes(this.userInfo.hospitalId)
      .subscribe(
        (response) => {
          if (response) {
            this.routeList = response;
            this.invoiceForm.patchValue({
              routeId: this.routeList[0]?.id || null,
            });
            this.getSatelliteSentLaundryByFeederIdAndRouteId();
            // Trigger change detection manually
            this.cdRef.detectChanges();
            console.log("this.routeList: ", this.routeList);
            // this.loadingPage = false;
            //   this.titleService.setTitle(this.invoice.invoiceNo);
            //  this.initializeThings();
          }
        },
        (error: any) => {
          console.log("Error");
          this.loadingPage = false;
        }
      );
  }

  getSatelliteSentLaundryByFeederIdAndRouteId() {
    const routeId = this.invoiceForm.get("routeId").value?.id
      ? this.invoiceForm.get("routeId").value?.id
      : this.invoiceForm.get("routeId").value;
    const feederId = this.invoiceForm.get("feederId").value;
    console.log("");
    this.loadingPage = true;
    // Clear existing details
    this.details.clear();
    this.invoiceService
      .getSatelliteSentLaundryByFeederidAndRouteId(routeId, feederId)
      .subscribe(
        (response) => {
          if (response) {
            this.itemsList = response;
            console.log("launry item: ", this.itemsList);
            this.itemsList?.forEach((summary) => {
              // this.details.push(this.createDetailGroup(summary));
              const detailGroup = this.createDetailGroup(summary);
              this.details.push(detailGroup);

              // Subscribe to qty value changes for real-time validation
              //  const qtyControl = detailGroup.get('qty');
              //  qtyControl?.valueChanges.subscribe(() => {
              //   debugger;
              //    qtyControl.updateValueAndValidity(); // Ensure value is validated
              //  });

              //  // Ensure initial validation
              //  qtyControl?.updateValueAndValidity();
            });
            //   // Trigger change detection manually
            // this.cdRef.detectChanges();
            this.loadingPage = false;
          }
        },
        (error: any) => {
          console.log("Error");
          this.loadingPage = false;
        }
      );
  }

  
  get details(): FormArray {
    return this.invoiceForm.get("details") as FormArray;
  }

  createDetailGroup(summary: any): FormGroup {
    return this.builder.group(
      {
        id: [summary.id],
        title: [summary.title],
        stQty: [summary.qty],
        remarks: [""],
        qty: [summary.qty], // Initialize editedQty with the original qty or set to 0
      },
      { validator: this.qtyValidator() }
    );
  }

  // Custom validator function to ensure editedQty <= qty
  qtyValidator(): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const qty = group.get("qty")?.value;
      const stQty = group.get("stQty")?.value;

      return qty > stQty ? { invalidQty: true } : null;
    };
  }

  update() {
    console.log("update");
    // Trigger validation manually for all controls
    this.invoiceForm.updateValueAndValidity();
  }
}
