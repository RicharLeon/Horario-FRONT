import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemploTablasComponent } from './ejemplo-tablas.component';

describe('EjemploTablasComponent', () => {
  let component: EjemploTablasComponent;
  let fixture: ComponentFixture<EjemploTablasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EjemploTablasComponent]
    });
    fixture = TestBed.createComponent(EjemploTablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
