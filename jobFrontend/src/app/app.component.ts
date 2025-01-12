import { Component, inject, viewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import { StatePersistenceService } from './services/state-persistence.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuTrigger } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Logout, SetUser, UserState } from './store/users.state';
import { UsersService } from './services/users.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  opened = false;
  user$: any;
  currentPath: any
  homeLink: any;
  isAuthenticated$: any;
  appliedLink: any;
  profileLink: any;
  profileText: any;
  plansLink: any;
  appliedText: any;
  allJobs: any;
  allJobsText: any;
  employeeNotif: boolean = false;
  employerNotif: boolean = false;
  bgImage: any;
  sideNavColor: any;
  readonly menuTrigger = viewChild.required(MatMenuTrigger);

  constructor(
    private store: Store,
    private persistenceService: StatePersistenceService,
    private serviceRouter: Router,
    private usersService: UsersService
  ) {
    this.store = store;
    this.store.subscribe(() => {
      this.persistenceService.saveState();
    })
  }

  router = inject(Router);

  ngOnInit(): void {
    console.log("window", typeof window);
    // if (typeof window !== 'undefined') {
      this.isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (this.isAuthenticated$ == false) {
        if (typeof window !== 'undefined') {
          if (document.location.pathname != "/register") {
            this.router.navigateByUrl('login');
          }
        }
      else {
        if (typeof window !== 'undefined') {
          if (document.location.pathname == "/employer") {
            const elem = document.getElementById("sidenav");
            if (elem) {
              // elem.style.display = "block";
              this.opened = true;
            }
            this.homeLink = "employer";
            this.appliedLink = "employer/job_apps"
            this.profileLink = "employer/profile"
            this.profileText = "Company Profile"
            this.plansLink = "employer/paid_plans"
            this.appliedText = "Job Applications"
            this.allJobs = "employer/all_jobs"
            this.allJobsText = "All Job Postings"
            this.employeeNotif = false;
            this.bgImage = "employerContentBg"
            this.sideNavColor = "employerSidenav"
            this.employerNotif = true;
          }
          else if (document.location.pathname == "/employee") {
            const elem = document.getElementById("sidenav");
            if (elem) {
              // elem.style.display = "block";
              this.opened = true;
            }
            this.homeLink = "employee";
            this.appliedLink = "employee/applied_jobs"
            this.profileLink = "employee/profile"
            this.profileText = "User Profile"
            this.plansLink = "employee/paid_plans"
            this.appliedText = "Applied Jobs"
            this.allJobs = "employee/cvInfo"
            this.allJobsText = "CV Information"
            this.employeeNotif = true;
            this.bgImage = "employeeContentBg"
            this.sideNavColor = "employeeSidenav"
            this.employerNotif = false;
          }

          else if (document.location.pathname == "/login" || document.location.pathname == "/register") {
            const elem = document.getElementById("sidenav");
            if (elem) {
              // elem.style.display = "none";
              this.opened = false;
            }
          }
        }
      }
      // }
      console.log("user", this.user$);
      console.log("current path", this.currentPath);

    }
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      if (document.location.pathname.includes("/employer")) {
        const elem = document.getElementById("sidenav");
        if (elem) {
          elem.style.display = "flex";
          this.opened = true;
        }
        this.homeLink = "employer";
        this.appliedLink = "employer/job_apps"
        this.profileLink = "employer/profile"
        this.profileText = "Company Profile"
        this.plansLink = "employer/paid_plans"
        this.appliedText = "Job Applications"
        this.allJobs = "employer/all_jobs"
        this.allJobsText = "All Job Postings"
        this.employeeNotif = false;
        this.bgImage = "employerContentBg"
        this.sideNavColor = "employerSidenav"
        this.employerNotif = true;
      }
      else if (document.location.pathname.includes("/employee")) {
        const elem = document.getElementById("sidenav");
        if (elem) {
          elem.style.display = "flex";
          this.opened = true;
        }
        this.homeLink = "employee";
        this.appliedLink = "employee/applied_jobs"
        this.profileLink = "employee/profile"
        this.profileText = "User Profile"
        this.plansLink = "employee/paid_plans"
        this.appliedText = "Applied Jobs"
        this.allJobs = "employee/cvInfo"
        this.allJobsText = "CV Information"
        this.employeeNotif = true;
        this.bgImage = "employeeContentBg"
        this.sideNavColor = "employeeSidenav"
        this.employerNotif = false;
      }

      else if (document.location.pathname == "/login" || document.location.pathname == "/register") {
        const elem = document.getElementById("sidenav");
        if (elem) {
          // elem.style.display = "none";
          this.opened = false;
        }
      }
      else if (document.location.pathname.includes("/admin")) {
        this.bgImage = 'adminContentBg'
      }
    }
  }

  checkPath() {
    this.currentPath = window.location.pathname;
  }

  goProfile() {
    console.log("user profile function", this.user$);
    console.log("user profile email", this.user$.email);
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

  logout() {
    sessionStorage.removeItem("userState");
    this.store.dispatch(new Logout()).subscribe(() => {
      location.reload();
    })
  }

  title = 'frontend';
}
