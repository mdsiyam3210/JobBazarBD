import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployerComponent } from './employer/employer.component';
import { ProfileComponent } from './profile/profile.component';
import { PaidPlansComponent } from './paid-plans/paid-plans.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';
import { CvInfoComponent } from './cv-info/cv-info.component';
import { EmployerAppliedJobsComponent } from './employer-applied-jobs/employer-applied-jobs.component';
import { EmployerProfileComponent } from './employer-profile/employer-profile.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { EmployerAllJobsComponent } from './employer-all-jobs/employer-all-jobs.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { AdminComponent } from './admin/admin.component';
import { CoursesComponent } from './courses/courses.component';
import { HiringTipsComponent } from './hiring-tips/hiring-tips.component';
// import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'employee', component: EmployeeComponent, children: [
    { path: 'profile', component: ProfileComponent },
    { path: 'paid_plans', component: PaidPlansComponent },
    { path: 'applied_jobs', component: AppliedJobsComponent},
    { path: 'cvInfo', component: CvInfoComponent},
    { path: 'notifications', component: NotificationsComponent},
    { path: 'courses', component: CoursesComponent}
  ] },
  { path: 'employer', component: EmployerComponent, children: [
    { path: 'job_apps', component: EmployerAppliedJobsComponent },
    { path: 'profile', component: EmployerProfileComponent },
    { path: 'paid_plans', component: PaidPlansComponent },
    { path: 'all_jobs', component: EmployerAllJobsComponent },
    { path: 'tips', component: HiringTipsComponent}
  ] },
  { path: 'admin', component: AdminComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'receipt', component: ReceiptComponent }
];
