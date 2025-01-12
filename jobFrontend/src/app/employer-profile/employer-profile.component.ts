import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout, UserState } from '../store/users.state';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FooterComponent } from "../footer/footer.component";
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FooterComponent
],
  templateUrl: './employer-profile.component.html',
  styleUrl: './employer-profile.component.css'
})
export class EmployerProfileComponent {
  user$: any;
  selectedFile: File | null = null;
  postForm: FormGroup;

  constructor(private store: Store, private serviceRouter: Router, private fb: FormBuilder, private usersService: UsersService, private dialog: MatDialog, private filesService: FilesService) {
    this.postForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    })
  }

  router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      const elem = document.getElementById("parent");
      console.log("elem", elem);
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
      console.log("elem", elem);
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

    dialogRef.afterClosed().subscribe((result: any) => {
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
      this.usersService.updateUser(this.user$.id, userData).subscribe((data: any) => {
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
      this.filesService.registerUserImage(fileData, this.user$.id).subscribe((data: any) => {
        console.log(data);
        location.reload();
      })
      location.reload();
    }
  }
}
