import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-clients-carousel',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './clients-carousel.component.html',
  styleUrls: ['./clients-carousel.component.css', './clients-carousel.component.scss']
})
export class ClientsCarouselComponent {

}
