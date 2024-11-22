import { Component, OnInit,Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-deployment-modal',
  templateUrl: './deployment-modal.component.html',
  styleUrls: ['./deployment-modal.component.scss']
})
export class DeploymentModalComponent {
  deploymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DeploymentModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.deploymentForm = this.fb.group({
      hospitalId: ['', Validators.required],
      deploymentDate: [data.date, Validators.required],
      deploymentLocation: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.deploymentForm.valid) {
      this.dialogRef.close(this.deploymentForm.value); // Return the form data
    }
  }
}
