import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav'
import { title } from 'process';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ["./courses.component.css", "./courses.component.scss"]
})
export class CoursesComponent {
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

  categories = [
    { id: 1, name: 'Accounts & Finance', count: 2, icon: 'account_balance', courses: [
      {
        title: 'Financial Management for Non-Finance Managers',
        date: '28 Dec 2024 - 3 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Financial Analysis & Reporting',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
    ] },
    { id: 2, name: 'Administration', count: 4, icon: 'admin_panel_settings', courses: [
      {
        title: 'Administrative Skills for Office Managers',
        date: '28 Dec 2024 - 3 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Effective Office Administration',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Administrative Skills for Personal Assistants',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Administrative Skills for Receptionists',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      }
    ] },
    { id: 3, name: 'Banking & Financial', count: 5, icon: 'payments', courses: [
      {
        title: 'Banking Operations & Management',
        date: '28 Dec 2024 - 3 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Financial Management for Non-Finance Managers',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Financial Analysis & Reporting',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Banking Finance & Operations',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      },
      {
        title: 'Financial Training',
        date: '3 - 4 Jan 2025 (2 Sessions)',
      }
    ] },
    // Add more categories here...
  ];

  courses: any = [];

  loadCoursesByCategory(categoryId: any): void {
    this.courses = this.categories.find(c => c.id === categoryId)?.courses || [];
  }
}
