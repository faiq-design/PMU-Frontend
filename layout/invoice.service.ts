import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Config } from "src/assets/config";

  //const BASE_URL = ["https://itms.pmuhealth.gop.pk/"];
  const BASE_URL = ["http://localhost:8080/"];
//const BASE_URL = Config.BASE_URI;

@Injectable({
  providedIn: "root",
})
export class InvoiceService {

  
  // Set headers if needed

  constructor(private http: HttpClient) {}

  private dataSource = new Subject();
  data = this.dataSource.asObservable();

  // return this.http.post(url, this.UrlEncodeMaker(obj), this.httpOptions);
  UrlEncodeMaker(obj) {
    let url = "";
    for (const key in obj) {
      url += `${key}=${obj[key]}&`;
    }
    const newUrl = url.substring(0, url.length - 1);
    return newUrl;
  }

  private createAuthorizationHeader() {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
    } else {
      console.log("JWT token not found in the Local Storage");
    }
    return null;
  }

  getServiceDetails(serviceId, vendorId, hospitalId): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/service-details?service_id=${serviceId}&vendor_id=${vendorId}&hospital_id=${hospitalId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getServiceDetailsComplaint(serviceId, vendorId, hospitalId): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/service-details-complaint?service_id=${serviceId}&vendor_id=${vendorId}&hospital_id=${hospitalId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getRemarks(roleId, serviceId): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/get-remarks-by-role?roleId=${roleId}&serviceId=${serviceId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getInvoiceDetails(
    hospitalId,
    serviceId,
    vendorStatus,
    vendorId
  ): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/get-invoices?hospitalId=${hospitalId}&serviceId=${serviceId}&vendorStatus=${vendorStatus}&vendorId=${vendorId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getInvoiceById(invoiceId): Observable<any> {
    return this.http.get(
      BASE_URL + `app/get-invoice-by-id?invoiceId=${invoiceId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getInvoiceById2(id: number): Promise<any> {
    return this.http
      .get(BASE_URL + `app/get-invoice-by-id?invoiceId=${id}`, {
        headers: this.createAuthorizationHeader(),
      })
      .toPromise();
  }

  saveInvoice(invoiceData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/save-invoice";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, invoiceData, { headers: headers });
    // return this.http.post<any>(url, invoiceData, { headers: this.createAuthorizationHeader() });
  }

  saveComplaint(complaintData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/save-complaint";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, complaintData, { headers: headers });
  }

  editInvoice(invoiceData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/edit-invoice";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, invoiceData, { headers: headers });
  }

  updateInvoice(invoiceId, status): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });
    return this.http.post(
      BASE_URL + `app/update-invoice?invoiceId=${invoiceId}&status=${status}`,
      null,
      { headers: headers }
    );
  }

  getAssets(): Observable<any> {
    return this.http.get(BASE_URL + `app/assets`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  editVendor(vendorData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/edit-vendor";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, vendorData, { headers: headers });
  }

  getAllVendors(): Observable<any> {
    return this.http.get(BASE_URL + `app/get-vendors`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  getAllHospitals(): Observable<any> {
    return this.http.get(BASE_URL + `app/get-hospitals`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  editHospital(hospitalData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/edit-hospital";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, hospitalData, { headers: headers });
  }

  getComplaintDetails(
    hospitalId,
    serviceId,
    complaintStatus,
    vendorId
  ): Observable<any> {
    // 
    return this.http.get(
      BASE_URL +
        `app/get-complaints?hospitalId=${hospitalId}&serviceId=${serviceId}&complaintStatus=${complaintStatus}&vendorId=${vendorId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  updateComplaintStatus(modifiedComplaint: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/update-complaint-controller";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, modifiedComplaint, { headers: headers });
  }

  getInvoiceNumber(serviceId, vendorId, month, service): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/get-invoice-no?serviceId=${serviceId}&vendorId=${vendorId}&service=${service}&month=${month}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getComplaintNumber(serviceId, hospitalId, month, service): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/get-complaint-no?serviceId=${serviceId}&hospitalId=${hospitalId}&service=${service}&month=${month}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getLaundryItems(serviceId: number): Observable<any> {
    return this.http.get(
      BASE_URL + `app/laundry-items?service_id=${serviceId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  saveLaundry(laundryInventory: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/save-laundry-inventory";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, laundryInventory, { headers: headers });
  }

  // getLaundryDetails(
  //   hospitalId:number
  // ): Observable<any> {
  //   return this.http.post(
  //     BASE_URL +
  //       `app/get-laundry-inventory?hospitalId=${hospitalId}`,
  //     {
  //       headers: this.createAuthorizationHeader(),
  //     }
  //   );
  // }
  getLaundryDetails(hospitalId: number): Observable<any> {
    return this.http.post(
      BASE_URL + `app/get-laundry-inventory?hospitalId=${hospitalId}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  editLaundry(invoiceData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "app/edit-laundry-inventory";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, invoiceData, { headers: headers });
  }

  getBatchNumber(setelliteId, feederId, month): Observable<any> {
    return this.http.get(
      BASE_URL +
        `app/get-laundry-batch-no?setelliteId=${setelliteId}&feederId=${feederId}&month=${month}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getHopitalServiceList(serviceId): Observable<any> {
    return this.http.get(
      BASE_URL + `app/hospital-services?service_id=${serviceId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getAllReports(obj: any): Observable<Blob> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "download-report";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, obj, { headers: headers });
  }

  viewHtmlReport(obj: any): Observable<Blob> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "view-html-report";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, obj, { headers: headers });
  }

  getReportById(reportId: number): Observable<any> {
    return this.http.post(
      BASE_URL + `app/${reportId}`,
      {},
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  // downloadResource(reportRequest: any, url: string): Observable<any> {
  //   const path = `${BASE_URL}/${url}`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   return this.http.post<any>(path, reportRequest, {
  //     headers: headers,
  //     responseType: 'blob' as 'json' // Corrected this line
  //   });
  // }

  downloadResource(reportRequest: any): Observable<Blob> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "download-csv-Report";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<Blob>(url, reportRequest, {
      headers: headers,
      responseType: "blob" as "json",
    });
  }

  viewResource(reportRequest: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "view-excel-Report";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, reportRequest, { headers: headers });
  }

  createReport(reportRequest: any): Observable<string> {
    const url = BASE_URL + "api/create-report";
    const jwtToken = localStorage.getItem("jwtToken");
    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });
    return this.http.post<string>(url, reportRequest, { headers: headers });
  }

  // getLaundryRoutes(
  //   feederId
  // ): Observable<any> {
  //   return this.http.get(
  //     BASE_URL +
  //       `laundryRoutes/feeder?feederId=${feederId}`,
  //     {
  //       headers: this.createAuthorizationHeader(),
  //     }
  //   );
  // }

  getLaundryRoutes(feederId: number): any {
    return this.http.get(BASE_URL + `laundryRoutes/feeder/${feederId}`, {
      headers: this.createAuthorizationHeader(),
      // }).toPromise();
    });
  }
  getLaundryFeederRoutes(feederId: number): any {
    return this.http.get(
      BASE_URL + `laundryRoutes/feeder/feederRoute/${feederId}`,
      {
        headers: this.createAuthorizationHeader(),
        // }).toPromise();
      }
    );
  }
  getSatelliteSentLaundryByFeederidAndRouteId(
    routeId: number,
    feederId: number
  ): any {
    return this.http.get(
      BASE_URL + `api/satellite-inventories/route/${routeId}/${feederId}`,
      {
        headers: this.createAuthorizationHeader(),
        // }).toPromise();
      }
    );
  }
  saveFeederLaundry(laundryInventory: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "laundryFeederInventories";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, laundryInventory, { headers: headers });
  }

  // saveInvoice(invoiceData: any): Observable<any> {
  //   const jwtToken = localStorage.getItem("jwtToken");
  //   const url = BASE_URL + "app/save-invoice";

  //   // Set headers if needed
  //   const headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + jwtToken,
  //   });

  //   // Make the HTTP post request
  //   return this.http.post<any>(url, invoiceData, { headers: headers });
  // }

  uploadDsrSaleTarget(formData: FormData): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "uploadDsrSaleTarget";

    // Set headers if needed
    const headers = new HttpHeaders({
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, formData, { headers });
  }

  downloadVendorData(): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "export";

    // Set headers if needed
    const headers = new HttpHeaders({
      Authorization: "Bearer " + jwtToken,
    });
    return this.http.get(url, { headers: headers, responseType: "blob" });
  }
  getSatelliteInventoryDetail(): Observable<any> {
    return this.http.get(BASE_URL + `api/satellite-inventories`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  editLaundrys(invoiceData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "add-satellite-receive";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, invoiceData, { headers: headers });
  }

  // getVendorAndFeeder(satelliteId: number): any {
  //   return this.http.get(  BASE_URL +
  //     `laundry-feeders/${satelliteId}`,
  //   {
  //     headers: this.createAuthorizationHeader(),
  //   // }).toPromise();
  // });
  // }

  getVendorAndFeeder(satelliteId: number): Observable<any> {
    return this.http.get(
      `${BASE_URL}laundry-feeders?satelliteId=${satelliteId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  // sendSatelliteLaundry(laundryInventory: any): Observable<any> {
  //   const jwtToken = localStorage.getItem("jwtToken");
  //   const url = BASE_URL + "save";

  //   // Set headers if needed
  //   const headers = new HttpHeaders({
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + jwtToken,
  //   });

  //   // Make the HTTP post request
  //   return this.http.post<any>(url, laundryInventory, { headers: headers });
  // }

  sendSatelliteLaundry(laundryInventory: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "send-satellite-inventory";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request with responseType 'text'
    return this.http.post(url, laundryInventory, {
      headers: headers,
      responseType: "text" as "json",
    });
  }

  getActiveRoutes(): Observable<any> {
    return this.http.get(BASE_URL + `api/satellite-inventories/active-routes`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  saveDeployment(depData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/deployments/create";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, depData, { headers: headers });
  }

  editDeployment(depData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/deployments/edit";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, depData, { headers: headers });
  }

  getDeploymentData(startDate, endDate, hospitalId): Observable<any> {
    return this.http.get(
      BASE_URL +
        `api/deployments/by-date-range?startDate=${startDate}&endDate=${endDate}&hospitalId=${hospitalId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getFieldDetails(startDate, endDate): Observable<any> {
    return this.http.get(
      BASE_URL +
        `api/deployments/by-date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  updateData(updatedData: any): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/deployments/update";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.put<any>(url, updatedData, { headers: headers });
  }

  getFeederDetails(feederId): Observable<any> {
    return this.http.get(
      BASE_URL + `api/laundry-feeder-inventories?feederId=${feederId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }

  getSatelliteDetails(satelliteId): Observable<any> {
    return this.http.get(
      BASE_URL + `api/laundry-satellite-inventories?satelliteId=${satelliteId}`,
      {
        headers: this.createAuthorizationHeader(),
      }
    );
  }
  getAssetDetails(hospitalId: number, assetId: number): Observable<any> {
    return this.http.get(BASE_URL + `api/hospital-assets/${hospitalId}/${assetId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateAsset(
    id: number,
    nonFunctionalValue: number,
    remarksValue: string
  ): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/hospital-assets/update/" + id; // Updated endpoint

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Create the body with both nonFunctional and remarks values
    const body = {
      nonFunctional: nonFunctionalValue,
      remarks: remarksValue,
    };

    // Make the HTTP PUT request
    return this.http.put<any>(url, body, { headers: headers });
  }

  getAllAssets(): Observable<any> {
    return this.http.get(BASE_URL + `api/hospital-assets`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllHREmployees(id: number | null): Observable<any> {
    const params = id !== null ? new HttpParams().set('id', id.toString()) : null;
    return this.http.get(BASE_URL + `api/employees/all`, {
      headers: this.createAuthorizationHeader(),
      params: params,
    });
  }
  updateLeaveStatus(data: { id: number;leaveId:number,employeeCode:number,noOfLeaves:number, status: string,paneltyTaxPercentage:string }): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL+`api/employees/update`;
  
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwtToken}`,
    });
    return this.http.put<any>(url, data, { headers: headers });
  }

  getEmployeeLeaveRequestsById(id: number | null): Observable<any> {
    const params = id !== null ? new HttpParams().set('id', id.toString()) : null;
    return this.http.get(BASE_URL + `api/employees/get-employee-leave-requests-by-id`, {
      headers: this.createAuthorizationHeader(),
      params: params,
    });
  }

  getEmployeeListByDepId(id: number | null): Observable<any> {
    const params = id !== null ? new HttpParams().set('id', id.toString()) : null;
    return this.http.get(BASE_URL + `api/employees/get-employees-by-dep-id`, {
      headers: this.createAuthorizationHeader(),
      params: params,
    });
  }

  getLeaveTypeRemarks(id, employeeId): Observable<any> {
    
  //   let params = new HttpParams();
  //   if (id !== null) {
  //       params = params.set('id', id.toString());
  //   }
  //   if (employeeId !== null) {
  //     params = params.set('employeeId', employeeId.toString());
  // }
    

  //   return this.http.get(BASE_URL + `get-leave-type-remarks`, {
  //       headers: this.createAuthorizationHeader(),
  //       params: params,
  //   });
  return this.http.get(
    BASE_URL + `get-leave-type-remarks?id=${id}&employeeId=${employeeId}`,
    {
      headers: this.createAuthorizationHeader(),
    }
  );
}


  submitLeaveRequest(leave: any) {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/employees/leave-requests";

    // Set headers if needed
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + jwtToken,
    });

    // Make the HTTP post request
    return this.http.post<any>(url, leave, { headers: headers });
  }

  getAllLeaveBalances(): Observable<any> {
    return this.http.get(BASE_URL + `api/employees/leave-balances`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateHrEmployee(formData: FormData): Observable<any> {
    const jwtToken = localStorage.getItem("jwtToken");
    const url = BASE_URL + "api/employees/update-employee";

    // Only set Authorization header
    const headers = new HttpHeaders({
        Authorization: "Bearer " + jwtToken,
    });

    return this.http.post(url, formData, { headers: headers });
}

getAllDepartments(departmentId): Observable<any> {
  return this.http.get(BASE_URL + `api/employees/departments?departmentId=${departmentId}`, {
    headers: this.createAuthorizationHeader(),
  });
}

 getAllEmployees(employeeId): Observable<any> {
    return this.http.get(BASE_URL + `api/employees/employees?employeeId=${employeeId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }
  
}
