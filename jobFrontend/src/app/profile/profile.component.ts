import { Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UsersService } from '../services/users.service';
import { Logout, UserState } from '../store/users.state';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    EmployeeFooterComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  postForm: FormGroup
  selectedFile: File | null = null;

  constructor(private store: Store, private usersService: UsersService, private serviceRouter: Router, private fb: FormBuilder, private dialog: MatDialog, private filesService: FilesService) {
    this.store = store;

    this.postForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  router = inject(Router);

  user$: any;

  ngOnInit(): void {
    const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
    this.user$ = this.store.selectSnapshot(UserState.user);
    if (isAuthenticated$ == false) {
      this.router.navigateByUrl('login');
    }
    console.log(this.user$);
    console.log(isAuthenticated$);

    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }

    if (this.user$) {
      this.postForm.get('name')?.setValue(this.user$.name);
      this.postForm.get('phone')?.setValue(this.user$.phone);
      this.postForm.get('email')?.setValue(this.user$.email);
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

  editProfile(templateRef: any) {
    console.log(templateRef);
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      height: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
    });
  }

  onSubmit() {
    if (this.postForm.valid) {
      console.log(this.postForm.value);
      const userData = {
        name: this.postForm.value.name,
        phone_number: this.postForm.value.phone,
        username: this.postForm.value.email,
        password: this.postForm.value.password,
        role: this.user$.role
      }
      this.usersService.updateUser(this.user$.id, userData).subscribe((data) => {
        console.log(data);
        sessionStorage.removeItem("userState");
        this.store.dispatch(new Logout()).subscribe(() => {
          location.reload();
        })
      })
    }
  }

  changePicture(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    if (this.selectedFile != null) {
      const fileData = new FormData();
      fileData.append('file', this.selectedFile);
      this.filesService.registerUserImage(fileData, this.user$.id).subscribe((data) => {
        console.log(data);
        location.reload();
      })
      location.reload();
    }
  }
}
