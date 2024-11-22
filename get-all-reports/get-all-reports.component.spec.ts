import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllReportsComponent } from './get-all-reports.component';

describe('GetAllReportsComponent', () => {
  let component: GetAllReportsComponent;
  let fixture: ComponentFixture<GetAllReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAllReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
