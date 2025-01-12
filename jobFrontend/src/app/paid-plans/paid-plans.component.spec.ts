import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidPlansComponent } from './paid-plans.component';

describe('PaidPlansComponent', () => {
  let component: PaidPlansComponent;
  let fixture: ComponentFixture<PaidPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaidPlansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaidPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
