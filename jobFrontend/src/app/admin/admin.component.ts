import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout, UserState } from '../store/users.state';
import { Router } from '@angular/router';
import { JobsService } from '../services/jobs.service';
import { UsersService } from '../services/users.service';
import { ApplicationsService } from '../services/applications.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', './admin.component.scss'],
})
export class AdminComponent {
  user$: any;
  isAuthenticated$: any;

  allJobs: any[] = [];
  allUsers: any[] = [];
  allApplied: any[] = [];

  employeeCount: any;
  employerCount: any;
  allJobsCount: any;
  appsCount: any;
  rejectedCount: any;
  acceptedCount: any;
  pendingCount: any;

  constructor(private store: Store, private serviceRouter: Router, private jobsService: JobsService, private usersService: UsersService, private applicationsService: ApplicationsService) {}

  router = inject(Router);

  ngOnInit(): void {

    this.user$ = this.store.selectSnapshot(UserState.user);
    this.isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
    if (this.user$) {
      if (this.user$.email != 'admin' && this.user$.role != 'ADMIN' && this.user$.password != '1234') {
        this.router.navigateByUrl('/login');
      }
    }

    this.jobsService.getJobs().subscribe((data) => {
      this.allJobs = data;
    })

    this.usersService.getAllUsers().subscribe((data) => {
      this.allUsers = data;
    })

    this.applicationsService.getAllApplications().subscribe((data) => {
      this.allApplied = data;
    })
  }

  ngDoCheck(): void {
    if (this.allJobs) {
      this.allJobsCount = this.allJobs.length;
    }

    if (this.allUsers) {
      this.employerCount = this.allUsers.filter((user: any) => user.role == 'EMPLOYER').length;
      this.employeeCount = this.allUsers.filter((user: any) => user.role == 'USER').length;
    }

    if (this.allApplied) {
      this.appsCount = this.allApplied.length;
      this.rejectedCount = this.allApplied.filter((app: any) => app.status == 'REJECTED').length;
      this.acceptedCount = this.allApplied.filter((app: any) => app.status == 'ACCEPTED').length;
      this.pendingCount = this.allApplied.filter((app: any) => app.status == 'PENDING').length;
    }

    // console.log(this.allApplied);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigateByUrl('/login');
  }
}
