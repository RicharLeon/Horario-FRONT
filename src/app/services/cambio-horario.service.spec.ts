import { TestBed } from '@angular/core/testing';

import { CambioHorarioService } from './cambio-horario.service';

describe('CambioHorarioService', () => {
  let service: CambioHorarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioHorarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
