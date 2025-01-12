import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerAllJobsComponent } from './employer-all-jobs.component';

describe('EmployerAllJobsComponent', () => {
  let component: EmployerAllJobsComponent;
  let fixture: ComponentFixture<EmployerAllJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployerAllJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployerAllJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
