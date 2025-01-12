import { Component, inject } from '@angular/core';
import { CoverletterService } from '../services/coverletter.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { UserState } from '../store/users.state';
import { Router } from '@angular/router';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";
import { FilesService } from '../services/files.service';

@Component({
  selector: 'app-cv-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    EmployeeFooterComponent
],
  templateUrl: './cv-info.component.html',
  styleUrl: './cv-info.component.css'
})
export class CvInfoComponent {
  cvForm: FormGroup;
  cvData: any;
  user$: any;
  isAuthenticated$: any;
  selectedFile: File | null = null;

  constructor(private cvService: CoverletterService, private fb: FormBuilder, private store: Store, private serviceRouter: Router, private filesService: FilesService) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      phone_number: ['', [Validators.required]],
      location: ['', Validators.required],
      skills: ['', Validators.required],
      experience: ['', Validators.required],
      institute: ['', Validators.required],
      degree: ['', Validators.required],
      passing_year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // 4 digit year
      cgpa: ['', [Validators.required, Validators.min(0), Validators.max(4)]], // CGPA between 0 and 10
      email: ['', [Validators.required]],
    });
  }

  router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isAuthenticated$ = this.store.selectSnapshot(UserState.isAuthenticated);
      this.user$ = this.store.selectSnapshot(UserState.user);
      if (this.isAuthenticated$ == false) {
        this.router.navigateByUrl('login');
      }
      console.log(this.user$);
      console.log(this.isAuthenticated$);


      if (this.user$) {
        this.cvService.getCoverLetterByUser(this.user$.id).subscribe((data) => {
          console.log(data);
          this.cvData = data;
          if (this.cvData) {
            this.cvForm.get('location')?.setValue(this.cvData?.location);
            this.cvForm.get('skills')?.setValue(this.cvData?.skills);
            this.cvForm.get('experience')?.setValue(this.cvData?.experience);
            this.cvForm.get('institute')?.setValue(this.cvData?.institute);
            this.cvForm.get('degree')?.setValue(this.cvData?.degree);
            this.cvForm.get('passing_year')?.setValue(this.cvData?.passing_year);
            this.cvForm.get('cgpa')?.setValue(this.cvData?.cgpa);
          }
        })
        this.cvForm.get('email')?.setValue(this.user$?.email);
        this.cvForm.get('name')?.setValue(this.user$?.name);
        this.cvForm.get('phone_number')?.setValue(this.user$?.phone);
      }

        const elem = document.getElementById("parent");
        if (elem != null && elem.style.display == "block") {
          elem.style.display = "none";
        }
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

  createCv() {
    if (this.cvForm.valid) {
      console.log(this.cvForm.value);
      if (this.cvData) {
        this.cvService.updateCoverLetter(this.user$.id, this.cvForm.value).subscribe((data) => {
          console.log(data);
          location.reload();
        });
      }
      else if (!this.cvData) {
        const reqData = {
          user: this.user$.id,
          ...this.cvForm.value
        }
        console.log(reqData);
        this.cvService.createCoverLetter(reqData, this.user$.id).subscribe((data) => {
          console.log(data);
          location.reload();
        })
      }
    }
  }

  uploadCV(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    if (this.selectedFile != null) {
      const fileData = new FormData();
      fileData.append('file', this.selectedFile);
      this.filesService.registerCvFile(fileData, this.user$.id).subscribe((data: any) => {
        console.log(data);
        location.reload();
      })
      location.reload();
    }
  }
}

