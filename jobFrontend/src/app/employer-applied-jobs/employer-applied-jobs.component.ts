import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserState } from '../store/users.state';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { title } from 'process';
import { table } from 'console';
import { CommonModule } from '@angular/common';
import { ApplicationsService } from '../services/applications.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoverletterService } from '../services/coverletter.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from "../footer/footer.component";
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-employer-applied-jobs',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    FooterComponent
],
  templateUrl: './employer-applied-jobs.component.html',
  styleUrl: './employer-applied-jobs.component.css'
})
export class EmployerAppliedJobsComponent {
  isAuthenticated$: any;
  form: FormGroup;
  user$: any;
  applications: any[] = [];
  jobs: any[] = [];
  coverletter: any[] = [];
  tableData: any[] = [];
  applicationTableData: any[] = [];
  applicationDisplayedColumns: string[] = ['id', 'name', 'status', 'actions'];
  displayedColumns: string[] = ['id', 'title', 'type', 'actions'];
  cvData: any[] = [];
  cvDisplayedColumns: string[] = ['id', 'email', 'name', 'phone_number', 'degree', 'cgpa', 'institute', 'experience', 'location', 'passing_year', 'skills', 'actions'];

  constructor(private store: Store, private serviceRouter: Router, private jobsService: JobsService, private applicationsService: ApplicationsService, private cvService: CoverletterService, private fb: FormBuilder, private filesService: FilesService) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      phone_number: [''],
      degree: [''],
      cgpa: [''],
      institute: [''],
      experience: [''],
      location: [''],
      passing_year: [''],
      skills: [''],
    });
  }

  router = inject(Router);

  private _alert = inject(MatSnackBar);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
      this.isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (this.isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      console.log("user", this.user$);

      if (this.user$) {
        this.jobsService.getJobByEmployer(this.user$.id).subscribe((data) => {
          console.log(data);
          this.jobs = data;

          this.tableData = this.jobs.map(job => ({
            id: job.id,
            title: job.title,
            type: job.type
          }));

          console.log("tableData", this.tableData);
          // for (let job of this.jobs) {
          //   let jobInfo = {
          //     id: job["id"],
          //     title: job["title"],
          //     type: job["type"],
          //   }
          //   console.log("jobInfo", jobInfo)
          //   this.tableData.push(jobInfo)
          //   console.log(this.tableData);
        })
      }
      this.jobInfo();
    }
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  applicationInfo(jobId: number) {
    this.hideJobTable();
    this.showAppTable();
    this.coverletter = [];
    console.log("jobId", jobId)
    this.applicationsService.getApplicationsForJob(jobId).subscribe((data) => {
      this.applications = data;
      console.log("app table", this.applicationTableData)
      console.log(data);

      this.applicationTableData = this.applications.map(application => ({
        id: application["id"],
        name: application["applicant_name"],
        status: application["status"],
        applicant_id: application["applicant_id"]
      }));
    })
  }

  jobInfo() {
    this.hideAppTable();
    this.hideCvTable();
    this.showJobTable();
    this.coverletter = [];
  }

  cvInfo(userId: any) {
    this.showCvTable();
    this.cvService.getCoverLetterByUser(userId).subscribe((data) => {
      this.coverletter = [data];
      this.form.get('name')?.setValue(this.coverletter[0].name);
      this.form.get('email')?.setValue(this.coverletter[0].email);
      this.form.get('phone_number')?.setValue(this.coverletter[0].phone_number);
      this.form.get('degree')?.setValue(this.coverletter[0].degree);
      this.form.get('cgpa')?.setValue(this.coverletter[0].cgpa);
      this.form.get('institute')?.setValue(this.coverletter[0].institute);
      this.form.get('experience')?.setValue(this.coverletter[0].experience);
      this.form.get('location')?.setValue(this.coverletter[0].location);
      this.form.get('passing_year')?.setValue(this.coverletter[0].passing_year);
      this.form.get('skills')?.setValue(this.coverletter[0].skills);
      console.log(this.coverletter);
      this.hideAppTable();
    })
  }

  hideCvTable() {
    const elem = document.getElementById("cvTable")
    if (elem != null) {
      elem.style.display = "none";
    }
  }

  showCvTable() {
    const elem = document.getElementById("cvTable")
    if (elem != null) {
      elem.style.display = "block";
    }
  }

  jobDecision(appId: number, decision: string) {
    console.log("jobId", appId)
    console.log("decision", decision)
    this.applicationsService.makeApplicationDecision(appId, decision).subscribe((data) => {
      console.log(data);
      if (decision == "ACCEPTED") {
        this._alert.open("Application accepted successfully!", 'close', { duration: 3000 });
      }
      else if (decision == "REJECTED") {
        this._alert.open("Application rejected successfully!", 'close', { duration: 3000 });
      }
      location.reload();
    })
  }

  hideJobTable() {
    const elem = document.getElementById("jobTable")
    if (elem != null) {
      elem.style.display = "none";
    }
  }

  showJobTable() {
    const elem = document.getElementById("jobTable")
    if (elem != null) {
      elem.style.display = "block";
    }
  }

  showAppTable() {
    const elem = document.getElementById("appTable")
    if (elem != null) {
      elem.style.display = "block";
    }
  }

  hideAppTable() {
    const elem = document.getElementById("appTable")
    if (elem != null) {
      elem.style.display = "none";
    }
  }
}
