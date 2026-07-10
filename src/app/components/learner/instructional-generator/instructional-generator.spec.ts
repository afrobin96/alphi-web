import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionalGenerator } from './instructional-generator';

describe('InstructionalGenerator', () => {
  let component: InstructionalGenerator;
  let fixture: ComponentFixture<InstructionalGenerator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionalGenerator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructionalGenerator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
