import { Directive, ElementRef, OnInit, HostListener } from "@angular/core";

@Directive({
  selector: "[appFormatNumber]",
})
export class FormatNumberDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    const value = this.el.nativeElement.value;
    if (value) {
      const formattedValue = this.format(value);
      this.el.nativeElement.value = formattedValue;
    }
  }

  @HostListener("input", ["$event"]) onInput(event: any) {
    const value = event.target.value;
    if (value) {
      const formattedValue = this.format(value);
      this.el.nativeElement.value = formattedValue;
    }
  }

  format(amount: any) {
    const amountString = amount.toString();
    const value = amountString.replace(/\D/g, "");
    return this.numberWithCommas(value);
  }

  numberWithCommas(x: string) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  formatAndUpdate() {
    const value = this.el.nativeElement.value;
    if (value) {
      const formattedValue = this.format(value);
      this.el.nativeElement.value = formattedValue;
    }
  }
}
