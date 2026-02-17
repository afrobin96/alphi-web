import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantillaHome } from './plantilla-home';

describe('PlantillaHome', () => {
  let component: PlantillaHome;
  let fixture: ComponentFixture<PlantillaHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantillaHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantillaHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
