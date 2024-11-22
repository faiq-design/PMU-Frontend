import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJanitorialInvoiceComponent } from './create-janitorial-invoice.component';

describe('CreateJanitorialInvoiceComponent', () => {
  let component: CreateJanitorialInvoiceComponent;
  let fixture: ComponentFixture<CreateJanitorialInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateJanitorialInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJanitorialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
