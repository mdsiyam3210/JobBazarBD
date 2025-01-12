import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngxs/store';
import { PaymentState, SetPayment } from '../store/payment.state';
import { Router } from '@angular/router';
import { text } from 'stream/consumers';
import { EmployeeFooterComponent } from "../employee-footer/employee-footer.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-paid-plans',
  standalone: true,
  imports: [
    MatListModule,
    MatGridListModule,
    MatCardModule,
    CommonModule,
    MatSlideToggleModule,
    MatSlideToggle,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    EmployeeFooterComponent,
    FooterComponent
],
  templateUrl: './paid-plans.component.html',
  styleUrl: './paid-plans.component.css'
})
export class PaidPlansComponent {
  titleText: any;
  footer: any;
  textColor: any;

  constructor(private store: Store, private serviceRouter: Router) {}

  router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }
    }
  }

  ngDoCheck(): void {
    if (typeof window !== 'undefined') {
      const elem = document.getElementById("parent");
      console.log("elem", elem);
      if (elem != null && elem.style.display == "block") {
        elem.style.display = "none";
      }

      const elem2 = document.getElementById("searchFilterContainer");
      if (elem2 != null && elem2.style.display == "flex") {
        elem2.style.display = "none";
      }
    }
    if (typeof window !== 'undefined') {
      if (document.location.pathname.includes("/employer")) {
        this.titleText = "Employer Dashboard";
        this.textColor = 'white';
        const footer1 = document.getElementById("footer1");
        const footer2 = document.getElementById("footer2");
        if (footer1 != null && footer2 != null) {
          footer1.style.display = "none";
        }
      }
      else if (document.location.pathname.includes("/employee")) {
        this.titleText = "Employee Dashboard";
        this.textColor = 'rgb(15, 82, 226)';
        const footer1 = document.getElementById("footer1");
        const footer2 = document.getElementById("footer2");
        const elem3 = document.getElementById("text");
        if (footer1 != null && footer2 != null && elem3 != null) {
          footer2.style.display = "none";
          elem3.style.color = 'rgb(15, 82, 226)'
        }
      }
    }

  }

  isYearly: boolean = false; // Default is Monthly
  currency: string = 'BDT'; // Example currency
  plans = [
    {
      name: 'Basic',
      price: this.isYearly ? 1000 : 100, // Annual = 120, Monthly = 10
      features: ['Monthly Application Limit - 75', 'Application Insights ✖', 'Email Support'],
      highlight: false
    },
    {
      name: 'Standard',
      price: this.isYearly ? 2000 : 200,
      features: ['Monthly Application Limit - 100', 'Application Insights ✓', 'Chat Support'],
      highlight: false
    },
    {
      name: 'Premium',
      price: this.isYearly ? 3000 : 300,
      features: ['Monthly Application Limit - 200', 'Application Insights ✓', 'Priority Support'],
      highlight: true // Popular plan
    },
    // {
    //   name: 'Enterprise',
    //   price: this.isYearly ? 960 : 80,
    //   features: ['Custom Solutions', 'Unlimited Storage', '24/7 Support'],
    //   highlight: false
    // }
  ];

  onPriceToggle() {
    this.plans.forEach(plan => {
      plan.price = this.isYearly ? (plan.price * 10) : plan.price / 10;
    });
  }

  subscribe(plan: any) {
    console.log(`Subscribed to ${plan.name}`);
    // window.print();
    const paymentInfo = {
      plan_name: plan.name,
      amount: plan.price
    }
    console.log(paymentInfo);
    this.store.dispatch(new SetPayment(paymentInfo))
    this.router.navigateByUrl('/payment');
  }

}
