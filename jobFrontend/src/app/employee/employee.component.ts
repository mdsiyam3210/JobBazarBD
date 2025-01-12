import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, inject, Input, Output, ViewChild, viewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { JobsService } from '../services/jobs.service';
import { UsersService } from '../services/users.service';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { Dialog } from '@angular/cdk/dialog';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MediaMatcher} from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list'
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngxs/store';
import { Logout, SetUser, UserState } from '../store/users.state';
import { CoverletterService } from '../services/coverletter.service';
import { ApplicationsService } from '../services/applications.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FooterComponent } from "../footer/footer.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";
import { ClientsCarouselComponent } from "../clients-carousel/clients-carousel.component";


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    RouterModule,
    MatGridListModule,
    MatSlideToggle,
    ReactiveFormsModule,
    MatPaginatorModule,
    FontAwesomeModule,
    FooterComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    EmployeeFooterComponent,
    ClientsCarouselComponent
],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent {
  @Output() formSubmitted = new EventEmitter();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  showDialog: boolean = false;
  opened = false;
  isBrowser: any;
  searchTerm: string = ''; // Search term from the input
  filterTerm: string = '';

  jobs: any[] = []
  dataSource = new MatTableDataSource<any>(this.jobs);
  // @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  // readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  readonly dialog = inject(MatDialog);

  constructor(private jobsService: JobsService, private usersService: UsersService, private serviceRouter: Router, private store: Store, private coverLetterService: CoverletterService, private applicationsService: ApplicationsService, private cdr: ChangeDetectorRef, library: FaIconLibrary) {
    this.store = store;
    this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
    library.addIcons(faFacebook, faTwitter);
  }

  router = inject(Router);
  private _alert = inject(MatSnackBar);
  faFacebook = faFacebook;
  faTwitter = faTwitter;

  user$: any
  page: any;


  ngOnInit(): void {
    if (this.isBrowser) {
      // location.reload();
      const elem = document.getElementById("btn");
      if (elem != null) {
        elem.style.display = "flex";
      }
      this.jobsService.getJobs().subscribe((data) => {
        this.jobs = data.reverse();
        this.dataSource.data = this.jobs;
        console.log(this.jobs);
        console.log(this.dataSource.data)
      });
      console.log("init");
      console.log(this.jobs)  // Select the user from the state
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      console.log("user", this.user$);

      if (typeof window !== 'undefined') {
        const elem = document.getElementById("parent");
        console.log("elem", elem);
        if (elem != null && elem.style.display == "none") {
          elem.style.display = "block";
        }
      }

      if (this.user$.role == "EMPLOYER") {
        this.router.navigateByUrl("/employer")
      }
    }

    if (this.user$) {
      this.applicationsService.getApplicationsByUser(this.user$.id).subscribe((data) => {
        console.log(data)
        for (let application of data) {

        }
      })
    }

  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "none") {
        elem.style.display = "block";
      }

      const elem2 = document.getElementById("searchFilterContainer");
      if (elem2 != null && elem2.style.display == "none") {
        elem2.style.display = "flex";
      }

      if (this.user$.role == "EMPLOYER") {
        this.router.navigateByUrl("/employer")
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
    console.log(this.dataSource.paginator.pageIndex);
  }

  applySearch(): void {
    if (this.searchTerm) {
      this.dataSource.filteredData = this.jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      console.log(this.searchTerm);
    } else {
      this.dataSource.filteredData = [...this.jobs];
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.dataSource.filteredData = [...this.jobs];
  }

  applyFilter(): void {
    if (this.filterTerm) {
      this.dataSource.filteredData = this.jobs.filter(
        (job) =>
          job.type.toLowerCase().includes(this.filterTerm.toLowerCase())
      );
      console.log(this.filterTerm);
    }
    else {
      this.dataSource.filteredData = [...this.jobs];
    }
  }

  clearFilter(): void {
    this.filterTerm = ''
    this.dataSource.filteredData = [...this.jobs];
  }

  home() {
    this.ngOnInit();
    this.hidePaidPlans();
    console.log(this.user$);
    const element = document.getElementById("card")
    if (element != null) {
      element.style.display = "flex";
    }
    this.jobsService.getJobs().subscribe((data) => {
      this.jobs = data
    });
    console.log(this.jobs);
  }

  hideHome() {
    // this.jobs = [];
    console.log("hiding home")
    const element = document.getElementById("card")
    if (element != null) {
      element.style.display = "none";
    }
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigateByUrl('/login');
  }


  goPaidPlans() {
    this.hideHome();
    const elem = document.getElementById("paidPlans");
    if (elem != null) {
      elem.style.display = "block";
    }
  }

  hidePaidPlans() {
    const elem = document.getElementById("paidPlans");
    if (elem != null) {
      elem.style.display = "none";
    }
  }

  goProfile() {
    console.log("user profile function", this.user$);
    console.log("user profile email", this.user$.email)
    this.usersService.getUserByUsername(this.user$.email).subscribe((user) => {
      const userInfo = {
        name: user.name,
        email: user.username,
        id: user.id,
        phone: user.phone_number,
        isAuthenticated: true,
        role: user.role
      }
      console.log(userInfo)
      console.log(user)
      this.store.dispatch(new SetUser(userInfo));
      this.router.navigate(['/profile']);
    })
  }

  openDialog(jobId: any) {
    // console.log(form.value);
    console.log("job_id", jobId);
    if (jobId) {
      console.log("work")
      const dialogRef = this.dialog.open(
        DialogContent,
        {
        // restoreFocus: false,
        data: jobId,
        }
      );
      // dialogRef.afterClosed().subscribe(() => this.menuTrigger().focus());
      this.dialog.afterAllClosed.subscribe(() => {
        console.log("dialog closed");
      })
    }
    else {
      console.log("no work")
    }
    // const dialogElem = this.dialog.open(DialogContent)
    // dialogElem?.afterOpened().subscribe(() => this.menuTrigger().focus());
    // this.dialog.afterAllClosed.subscribe(() => {
    //   console.log("dialog closed");
    // })


  }

  submitForm(form: any) {
    this.formSubmitted.emit(form);
    console.log(form);
  }

  applyForJob(jobId: any) {
    let coverletter: any;

    this.coverLetterService.getCoverLetterByUser(this.user$.id).subscribe((data) => {
      coverletter = data;
      if (coverletter == null) {
        const snackBarRef = this._alert.open('PLEASE FILL YOUR CV BEFORE APPLYING', 'OK', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })

        snackBarRef.afterDismissed().subscribe(() => {
          this.router.navigateByUrl('employee/cvInfo')
        })
      }
      console.log(coverletter.user_id);

      const jobData = {
        "jobId": jobId,
        "userId": this.user$.id,
        "status": "PENDING",
        "coverLetter": {
          "id": coverletter.id,
          "user_id": coverletter.user_id
        }
      }
      console.log(jobData)

      this.applicationsService.applyForJob(jobData).subscribe((data) => {
        console.log(data);
      },
      (error: any) => {
        if (error.message == "Http failure response for http://localhost:8080/api/applications: 500 OK") {
          this._alert.open('YOU HAVE ALREADY APPLIED FOR THIS JOB', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
        }
        if (error.message == "Http failure during parsing for http://localhost:8080/api/applications") {
          this._alert.open('SUCCESSFULLY APPLIED', 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
        }
      }
    )

    })
  }

  isYearly: boolean = false; // Default is Monthly
  currency: string = 'BDT'; // Example currency
  plans = [
    {
      name: 'Basic',
      price: this.isYearly ? 120 : 10, // Annual = 120, Monthly = 10
      features: ['Monthly Application Limit - 75', 'Application Insights ✖', 'Email Support'],
      highlight: false
    },
    {
      name: 'Standard',
      price: this.isYearly ? 240 : 20,
      features: ['Monthly Application Limit - 100', 'Application Insights ✓', 'Chat Support'],
      highlight: false
    },
    {
      name: 'Premium',
      price: this.isYearly ? 480 : 40,
      features: ['Unlimited Users', '100GB Storage', 'Priority Support'],
      highlight: true // Popular plan
    },
    {
      name: 'Enterprise',
      price: this.isYearly ? 960 : 80,
      features: ['Custom Solutions', 'Unlimited Storage', '24/7 Support'],
      highlight: false
    }
  ];

  onPriceToggle() {
    this.plans.forEach(plan => {
      plan.price = this.isYearly ? (plan.name === 'Premium' ? 480 : plan.price * 12) : plan.price / 12;
    });
  }

  subscribe(plan: any) {
    console.log(`Subscribed to ${plan.name}`);
  }
}

@Component({
  selector: 'dialog-content',
  templateUrl: 'dialog.html',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DialogContent {
  jobData: any[string] = []
  employer: any[string] = []

  // constructor(private jobsService: JobsService, public dialogRef: MatDialogRef<EmployeeComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private usersService: UsersService) {
  //   // console.log("dialog ref data", this.data.jobId);
  //   this.data.jobId;
  //   // this.data;
  // }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DialogContent>, private jobsService: JobsService, private usersService: UsersService) {
    console.log("data", data);
  }

  ngOnInit(): void {
    if (this.data != null) {
      this.jobsService.getJobById(this.data).subscribe((tempJobData) => {
        this.jobData = tempJobData;
        console.log("inside", this.jobData);
        this.usersService.getUserById(tempJobData.employerId).subscribe((tempEmployer) => {
          this.employer = tempEmployer;
          console.log(this.employer);
        })
      });
    }
  }

  ngDoCheck(): void {

  }


}
