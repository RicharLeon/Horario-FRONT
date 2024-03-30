import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioHorarioComponent } from './cambio-horario.component';

describe('CambioHorarioComponent', () => {
  let component: CambioHorarioComponent;
  let fixture: ComponentFixture<CambioHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambioHorarioComponent]
    });
    fixture = TestBed.createComponent(CambioHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
