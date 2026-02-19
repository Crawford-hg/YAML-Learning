import { TestBed } from '@angular/core/testing';

import { SwimLaneService } from './swim-lane-service';

describe('SwimLaneService', () => {
  let service: SwimLaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwimLaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
