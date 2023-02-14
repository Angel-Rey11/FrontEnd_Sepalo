import { TestBed } from '@angular/core/testing';

import { CallBDService } from './call-bd.service';

describe('CallBDService', () => {
  let service: CallBDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
