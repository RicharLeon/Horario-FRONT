import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponderCambioHorarioComponent } from './responder-cambio-horario.component';

describe('ResponderCambioHorarioComponent', () => {
  let component: ResponderCambioHorarioComponent;
  let fixture: ComponentFixture<ResponderCambioHorarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResponderCambioHorarioComponent]
    });
    fixture = TestBed.createComponent(ResponderCambioHorarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
