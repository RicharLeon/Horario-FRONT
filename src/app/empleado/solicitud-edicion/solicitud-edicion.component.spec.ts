import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudEdicionComponent } from './solicitud-edicion.component';

describe('SolicitudEdicionComponent', () => {
  let component: SolicitudEdicionComponent;
  let fixture: ComponentFixture<SolicitudEdicionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolicitudEdicionComponent]
    });
    fixture = TestBed.createComponent(SolicitudEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
