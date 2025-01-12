import { Component, Inject, inject, viewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { UsersService } from '../services/users.service';
import { UserState } from '../store/users.state';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { ApplicationsService } from '../services/applications.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";

@Component({
  selector: 'app-applied-jobs',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    CommonModule,
    EmployeeFooterComponent
],
  templateUrl: './applied-jobs.component.html',
  styleUrl: './applied-jobs.component.css'
})
export class AppliedJobsComponent {

  user$: any;
  isBrowser: any;
  appliedJobs: any[] = [];
  jobInfo: any;
  applicantInfo: any[] = [];
  jobTempData: any;
  jobData: any[] = [];
  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  constructor(private store: Store, private serviceRouter: Router, private applicationsService: ApplicationsService, private jobsService: JobsService, private dialog: MatDialog, private usersService: UsersService ) {
    this.store = store;
    this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  router = inject(Router);

  ngOnInit(): void {
    if (this.isBrowser) {
      this.user$ = this.store.selectSnapshot(UserState.user);
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);

      if (isAuthenticated$ == false) {
        if (document.location.pathname != "/register") {
          this.router.navigateByUrl('login');
        }
      }

      this.applicationsService.getApplicationsByUser(this.user$.id).subscribe((data) => {
        console.log("data", data);
        this.appliedJobs = data;
        for (let job of this.appliedJobs) {
          this.jobsService.getJobById(job.job_id).subscribe((data) => {
            this.jobInfo = data;
            this.jobTempData = {
              id: job.id,
              salary: this.jobInfo.salary,
              company: this.jobInfo.company,
              location: this.jobInfo.location,
              status: job.status,
              job_id: job.job_id,
              job_title: job.job_title,
              applicant_id: job.applicant_id
            }
            this.jobData.push(this.jobTempData);
            console.log("jobData", this.jobData);
          })
        }})

      console.log("user", this.user$);
    }

    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      // console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  ngDoCheck(): void {
    // console.log("applied jobs", this.appliedJobs);
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      // console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }

      const elem2 = document.getElementById("searchFilterContainer");
      if (elem2 != null && elem2.style.display == "flex") {
        elem2.style.display = "none";
      }
    }
  }

  getEmployerInfo(jobId: any) {
    this.jobsService.getJobById(jobId).subscribe((data) => {
      this.jobInfo = data

      console.log(this.jobInfo);
      this.usersService.getUserById(data.employerId).subscribe((data) => {
        console.log(data);
        const dialogRef = this.dialog.open(JobDialogComponent, {
          data: data
        })
      })

    })

    this.dialog.afterAllClosed.subscribe(() => {
      console.log("dialog closed");
    })
  }

  getApplicantInfo(applicantId: any) {
    this.usersService.getUserById(applicantId).subscribe((data) => {
      console.log(data);
      this.applicantInfo = data

      const dialogRef = this.dialog.open(ApplicantDialogComponent, {
        data: this.applicantInfo
      })
    })

    this.dialog.afterAllClosed.subscribe(() => {
      console.log("dialog closed");
    })
  }

  deleteApplication(applicantId: any) {
    this.applicationsService.deleteApplication(applicantId).subscribe((data) => {
      console.log(data);
      location.reload();
    },
  (error: any) => {
    location.reload();
    console.log(error);
  })
  }

}


@Component({
  selector: 'job-dialog-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
  <div style="text-align: center;">
    <h1 mat-dialog-title class="dialog-title">Employer Information</h1>
    <div mat-dialog-content class="dialog-content">
      <p>
        <b> PHONE </b> <br>
        <mat-icon>phone</mat-icon>
        {{ data["phone_number"] }}
      </p>
      <p>
        <b> EMAIL </b> <br>
        <mat-icon>email</mat-icon>
        {{ data["username"] }}
      </p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onClose()">Close</button>
    </div>
    </div>
  `,
        styles: [`
          .dialog-title {
            color: #333;
            font-size: 20px;
          }

          .dialog-content {
            padding: 20px;
          }

          .mat-dialog-content {
            padding: 20px; /* Add padding to the content area */
          }
        `]

})
export class JobDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<JobDialogComponent>) {
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'applicant-dialog-component',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
  <div style="text-align: center;">
    <h1 mat-dialog-title class="dialog-title">Applicant Information</h1>
    <div mat-dialog-content class="dialog-content">
      <p>
        <b> NAME </b> <br>
        {{ data["name"] }}
      </p>
      <p>
        <b> PHONE </b> <br>
        <mat-icon>phone</mat-icon>
        {{ data["phone_number"] }}
      </p>
      <p>
        <b> EMAIL </b> <br>
        <mat-icon>mail</mat-icon>
        {{ data["username"] }}
      </p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onClose()">Close</button>
    </div>
    </div>
  `,
        styles: [`
          .dialog-title {
            color: #333;
            font-size: 20px;
          }

          .dialog-content {
            padding: 20px;
          }

          .mat-dialog-content {
            padding: 20px; /* Add padding to the content area */
          }
        `]

})
export class ApplicantDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ApplicantDialogComponent>) {
    console.log(data);
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
