import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from'@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { EmployeeComponent } from "../employee/employee.component";
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { SetUser, UserState } from '../store/users.state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    EmployeeComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  name = "";
  isBrowser: any;
  adminUser = [{
    username: 'admin',
    password: '1234',
  }]

  constructor(private fb: FormBuilder, private serviceRouter: Router, private usersService: UsersService, private http: HttpClient, private store: Store) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.isBrowser = this.isBrowser = typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
  }

  router = inject(Router);

  ngOnInit(): void {
    if (this.isBrowser) {
      const elem = document.getElementById("btn");
      if (elem != null) {
        elem.style.display = "none";
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      if (formData.username == this.adminUser[0].username && formData.password == this.adminUser[0].password) {
        const userInfo = {
          name: this.adminUser[0].username,
          email: this.adminUser[0].username,
          id: "0",
          phone: "88801391139",
          isAuthenticated: true,
          role: "ADMIN"
        }
        //@ts-ignore
        this.store.dispatch(new SetUser(userInfo)).subscribe((data) => {
          console.log(data);
        })
        console.log(userInfo);
        this.router.navigate(['/admin']);
      }
      this.usersService.getUserByUsername(formData.username).subscribe((user) => {
        if (formData.password == user.password && user.role == 'USER') {
          // this.router.navigateByUrl('employee');
          console.log(user);
          const userInfo = {
            name: user.name,
            email: user.username,
            id: user.id,
            phone: user.phone_number,
            role: user.role,
            isAuthenticated: true,
          }
          this.store.dispatch(new SetUser(userInfo));
          this.router.navigate(['/employee']);
        }
        else if (formData.password == user.password && user.role == 'EMPLOYER') {
          console.log(user);
          const userInfo = {
            name: user.name,
            email: user.username,
            id: user.id,
            phone: user.phone_number,
            isAuthenticated: true,
            role: user.role
          }
          this.store.dispatch(new SetUser(userInfo));
          this.router.navigate(['/employer']);
        }
        else {
          const errorElement = document.getElementById("error-msg");
          if (errorElement != null) {
            errorElement.style.display = "block";
          }
        }
        this.name = formData.name;
      }, (error) => {
        const errorElement = document.getElementById("error-msg");
        if (errorElement != null) {
          errorElement.style.display = "block";
        }
      })
    }
  }
}
