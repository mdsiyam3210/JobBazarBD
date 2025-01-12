import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from '../store/users.state';
import { ApplicationsService } from '../services/applications.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { table } from 'console';
import { JobsService } from '../services/jobs.service';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    CommonModule,
    EmployeeFooterComponent
],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  user$: any;
  isAuthenticated$: any
  tableData: any[] = [];
  displayedColumns: string[] = ["id", "message", "actions"];

  constructor(private store: Store, private serviceRouter: Router, private applicationsService: ApplicationsService, private jobsService: JobsService) {

  }

  router = inject(Router);

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
    this.user$ = this.store.selectSnapshot(UserState.user);
    if (this.isAuthenticated$ == false) {
      this.router.navigateByUrl('login');
    }
    console.log(this.user$);
    console.log(this.isAuthenticated$);

    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }

    if (this.user$) {
      this.applicationsService.getApplicationsByUser(this.user$.id).subscribe((data) => {
        let id: number = 0;
        console.log("data", data);
        for (let app of data) {
          id += 1;
          if (app["status"] == "ACCEPTED" || app["status"] == "REJECTED") {
            this.tableData.push(
              { id: id,
                message: `Your application to ${app["job_title"]} has been :- ${app["status"]}`
              })
            console.log(this.tableData);
          }
        }
      })
    }
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      const elem2 = document.getElementById("searchFilterContainer");
      if (elem2 != null && elem2.style.display == "flex") {
        elem2.style.display = "none";
      }
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  goToApplications() {
    this.router.navigateByUrl("employee/applied_jobs")
  }
}
