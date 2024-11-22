import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentModalComponent } from './deployment-modal.component';

describe('DeploymentModalComponent', () => {
  let component: DeploymentModalComponent;
  let fixture: ComponentFixture<DeploymentModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
