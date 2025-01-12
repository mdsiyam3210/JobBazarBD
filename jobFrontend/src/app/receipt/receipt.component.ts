import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngxs/store';
import { ReceiptState } from '../store/receipt.state';
import { Router } from '@angular/router';
import { UserState } from '../store/users.state';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.css'
})
export class ReceiptComponent {
  receipt: any;
  user$: any;

  constructor(private store: Store, private serviceRouter: Router) {}

  router = inject(Router);

  ngOnInit(): void {
    this.receipt = this.store.selectSnapshot(ReceiptState.receipt);
    this.user$ = this.store.selectSnapshot(UserState.user);

    // console.log(this.receipt);
  }

  ngAfterViewChecked() {
    // window.print()
  }

  printReceipt() {
    window.print();
    if (this.user$.role == "USER") {
      this.router.navigateByUrl("/employee")
    }
    else if (this.user$.role == "EMPLOYER") {
      this.router.navigateByUrl("/employer")
    }
  }

}
