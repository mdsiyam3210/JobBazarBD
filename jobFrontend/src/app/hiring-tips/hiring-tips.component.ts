import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hiring-tips',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatToolbarModule
  ],
  templateUrl: './hiring-tips.component.html',
  styleUrl: './hiring-tips.component.css'
})
export class HiringTipsComponent {
  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  tips = [
    { title: 'Write Clear Job Descriptions', description: 'Detail the role responsibilities and requirements to attract the right candidates.' },
    { title: 'Use Social Media', description: 'Leverage social platforms to reach a larger pool of talent.' },
    { title: 'Streamline the Interview Process', description: 'Ensure a quick and structured interview process to keep candidates engaged.' },
    { title: 'Focus on Company Culture', description: 'Highlight your company culture to attract candidates who align with your values.' },
    { title: 'Offer Competitive Compensation', description: 'Provide salaries and benefits that meet or exceed market standards.' },
  ];
}
