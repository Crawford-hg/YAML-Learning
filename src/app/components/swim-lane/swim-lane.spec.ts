import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimLane } from './swim-lane';

describe('SwimLane', () => {
  let component: SwimLane;
  let fixture: ComponentFixture<SwimLane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwimLane]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwimLane);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
