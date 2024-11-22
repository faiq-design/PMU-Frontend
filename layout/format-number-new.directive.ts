import { Directive, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormatNumberNew]'
})
export class FormatNumberNewDirective implements OnInit, OnDestroy {

  private rawValue: string;
  private valueChangesSubscription: Subscription;

  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnInit() {
    this.rawValue = this.control.control?.value;
    this.formatNumber();
    this.valueChangesSubscription = this.control.control.valueChanges.subscribe(value => {
      this.rawValue = value;
      this.formatNumber();
    });
  }

  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }

  @HostListener('blur') onBlur() {
    this.formatNumber();
  }

  @HostListener('focus') onFocus() {
    this.el.nativeElement.value = this.rawValue;
  }

  private formatNumber() {
    const value = this.control.control?.value;
    if (value) {
      this.rawValue = value;
      this.el.nativeElement.value = new Intl.NumberFormat().format(value);
    }
  }
}
