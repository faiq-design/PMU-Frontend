import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormArray, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-noting-print",
  templateUrl: "./noting-print-component.html",
  styleUrls: ["./noting-print-component.scss"],
})
export class NotingPrintComponent implements OnInit {
  @Input() invoice;
  constructor() { }

  ngOnInit(): void {
    console.log("this.invoice: ",this.invoice);
  }

  getMonth(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'long' });
  }

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
