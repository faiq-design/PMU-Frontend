import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLaundryComponent } from './create-laundry.component';

describe('CreateLaundryComponent', () => {
  let component: CreateLaundryComponent;
  let fixture: ComponentFixture<CreateLaundryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLaundryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLaundryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
