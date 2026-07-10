import { TestBed } from '@angular/core/testing';

import { Learner } from './learner';

describe('Learner', () => {
  let service: Learner;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Learner);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
