import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerAppliedJobsComponent } from './employer-applied-jobs.component';

describe('EmployerAppliedJobsComponent', () => {
  let component: EmployerAppliedJobsComponent;
  let fixture: ComponentFixture<EmployerAppliedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerAppliedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerAppliedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
