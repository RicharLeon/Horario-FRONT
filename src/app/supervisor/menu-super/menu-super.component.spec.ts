import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSuperComponent } from './menu-super.component';

describe('MenuSuperComponent', () => {
  let component: MenuSuperComponent;
  let fixture: ComponentFixture<MenuSuperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuSuperComponent]
    });
    fixture = TestBed.createComponent(MenuSuperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
