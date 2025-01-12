import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { Logout, UserState } from '../store/users.state';
import { Store } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { JobsService } from '../services/jobs.service';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FooterComponent } from "../footer/footer.component";
import { ClientsCarouselComponent } from "../clients-carousel/clients-carousel.component";

@Component({
  selector: 'app-employer',
  standalone: true,
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    FooterComponent,
    ClientsCarouselComponent
],
  templateUrl: './employer.component.html',
  styleUrl: './employer.component.css'
})
export class EmployerComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isBrowser: any;
  opened = false;
  user$: any;
  jobs: any[] = [];
  jobId: any;
  postForm: FormGroup
  updateForm: FormGroup
  searchTerm: string = ''; // Search term from the input
  filterTerm: string = '';

  dataSource = new MatTableDataSource<any>(this.jobs);

  constructor(private store: Store, private serviceRouter: Router, private jobsService: JobsService, private dialog: MatDialog, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
    })

    this.updateForm = fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      salary: ['', Validators.required],
      location: ['', Validators.required],
      type: ['', Validators.required],
    })
  }



  router = inject(Router);

  ngOnInit(): void {
    if (this.isBrowser) {
      // location.reload();
      const elem = document.getElementById("btn");
      if (elem != null) {
        elem.style.display = "flex";
      }
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      console.log("user", this.user$);

      if (this.user$) {
        this.jobsService.getJobByEmployer(this.user$.id).subscribe((data) => {
          this.jobs = data.reverse();
          this.dataSource.data = this.jobs;
          console.log(this.jobs);
          console.log(this.dataSource.data)
        })
      }

      if (this.user$.role == "USER") {
        this.router.navigateByUrl("/employee")
      }

      if (typeof window !== 'undefined') {
        const elem = document.getElementById("parent");
        console.log("elem", elem);
        if (elem != null && elem.style.display == "none") {
          elem.style.display = "block";
        }
      }
    }
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "none") {
        elem.style.display = "block";
      }
      if (this.user$.role == "USER") {
        this.router.navigateByUrl("/employee")
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

  openDialog(templateRef: any) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      height: '550px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  onSubmit() {
    console.log("e");
    console.log(this.postForm.value);
    if (this.postForm.valid) {
      const formData = this.postForm.value;
      const jobData = {
        "title": formData.title,
        "description": formData.description,
        "salary": formData.salary,
        "location": formData.location,
        "type": formData.type,
        "employer": {
          "id": this.user$.id,
          "username": this.user$.email,
          "role": this.user$.role
        },
        "company": this.user$.name
      }
      this.jobsService.createJob(jobData).subscribe((data) => {
        console.log(data);
        location.reload();
      })
      console.log(formData);
      console.log("jobdata", jobData);
    }
  }

  deleteJob(id: any) {
    this.jobsService.deleteJob(id).subscribe((data) => {
      console.log(data);
      location.reload();
    })
  }

  updateJob(id: any, templateRef: any) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      height: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
    this.jobsService.getJobById(id).subscribe((data) => {
      console.log(data);
      this.updateForm.get('title')?.setValue(data.title);
      this.updateForm.get('description')?.setValue(data.description);
      this.updateForm.get('salary')?.setValue(data.salary);
      this.updateForm.get('location')?.setValue(data.location);
      this.updateForm.get('type')?.setValue(data.type);
      this.jobId = data.id;
    })
  }

  onSubmitUpdate() {
    if (this.updateForm.valid) {
      const formData = this.updateForm.value;
      const jobData = {
        "title": formData.title,
        "description": formData.description,
        "salary": formData.salary,
        "location": formData.location,
        "type": formData.type,
        "employer": {
          "id": this.user$.id,
          "username": this.user$.email,
          "role": this.user$.role
        },
        "company": this.user$.name
      }
      this.jobsService.updateJob(this.jobId, jobData).subscribe((data) => {
        console.log(data);
        location.reload();
      })
      console.log(jobData);
    }
  }


  logout() {
    sessionStorage.removeItem("userState");
    this.store.dispatch(new Logout()).subscribe(() => {
      location.reload();
    })
  }
}
