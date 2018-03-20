import { TestBed, inject } from '@angular/core/testing';

import { MediatorService } from './mediator.service';

describe('MediatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediatorService]
    });
  });

  it('should be created', inject([MediatorService], (service: MediatorService) => {
    expect(service).toBeTruthy();
  }));
});
