import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditJanitorialInvoiceComponent } from './edit-janitorial-invoice.component';

describe('EditJanitorialInvoiceComponent', () => {
  let component: EditJanitorialInvoiceComponent;
  let fixture: ComponentFixture<EditJanitorialInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditJanitorialInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditJanitorialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
