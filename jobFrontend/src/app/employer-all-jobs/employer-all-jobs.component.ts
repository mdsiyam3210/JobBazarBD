import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserState } from '../store/users.state';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from '../services/users.service';
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-employer-all-jobs',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FooterComponent
],
  templateUrl: './employer-all-jobs.component.html',
  styleUrl: './employer-all-jobs.component.css'
})
export class EmployerAllJobsComponent {
  user$: any;
  jobs: any[] = [];
  constructor(private store: Store, private serviceRouter: Router, private jobsService: JobsService, private dialog: MatDialog) {}

  router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }

    this.jobsService.getJobs().subscribe((data) => {
      this.jobs = data
    });
    console.log("init");
    console.log("jobs", this.jobs)  // Select the user from the state
    const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
    this.user$ = this.store.selectSnapshot(UserState.user);
    if (isAuthenticated$ == false) {
      this.router.navigateByUrl('login');
    }
    console.log("user", this.user$);
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  // openDialog(jobId: any) {
  //   // console.log(form.value);
  //   console.log("job_id", jobId);
  //   if (jobId) {
  //     console.log("work")
  //     const dialogRef = this.dialog.open(
  //       JobDialogContent,
  //       {
  //       // restoreFocus: false,
  //       data: jobId,
  //       }
  //     );
  //     // dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
  //     this.dialog.afterAllClosed.subscribe(() => {
  //       console.log("dialog closed");
  //     })
  //   }
  //   else {
  //     console.log("no work")
  //   }
  //   // const dialogElem = this.dialog.open(DialogContent)
  //   // dialogElem?.afterOpened().subscribe(() => this.menuTrigger().focus());
  //   // this.dialog.afterAllClosed.subscribe(() => {
  //   //   console.log("dialog closed");
  //   // })


  // }
}

// @Component({
//   selector: 'job-dialog-content',
//   template: ``,
//   standalone: true,
//   imports: [
//     MatDialogContent,
//     MatDialogActions,
//     MatDialogClose,
//     MatButtonModule,
//     MatIconModule
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })

// export class JobDialogContent {
//   jobData: any[string] = []
//   employer: any[string] = []

//   // constructor(private jobsService: JobsService, public dialogRef: MatDialogRef<EmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private usersService: UsersService) {
//   //   // console.log("dialog ref data", this.data.jobId);
//   //   this.data.jobId;
//   //   // this.data;
//   // }

//   constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<JobDialogContent>, private jobsService: JobsService, private usersService: UsersService) {
//     console.log("data", data);
//   }

//   ngOnInit(): void {
//     if (this.data != null) {
//       this.jobsService.getJobById(this.data).subscribe((tempJobData) => {
//         this.jobData = tempJobData;
//         console.log("inside", this.jobData);
//         this.usersService.getUserById(tempJobData.employerId).subscribe((tempEmployer) => {
//           this.employer = tempEmployer;
//           console.log(this.employer);
//         })
//       });
//     }
//   }

//   ngDoCheck(): void {

//   }


// }
