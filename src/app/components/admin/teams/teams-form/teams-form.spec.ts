import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsForm } from './teams-form';

describe('TeamsForm', () => {
  let component: TeamsForm;
  let fixture: ComponentFixture<TeamsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
