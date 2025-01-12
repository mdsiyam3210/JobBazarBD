import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringTipsComponent } from './hiring-tips.component';

describe('HiringTipsComponent', () => {
  let component: HiringTipsComponent;
  let fixture: ComponentFixture<HiringTipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiringTipsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringTipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
