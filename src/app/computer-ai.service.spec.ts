import { TestBed } from '@angular/core/testing';

import { ComputerAiService } from './computer-ai.service';

describe('ComputerAiService', () => {
  let service: ComputerAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputerAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
