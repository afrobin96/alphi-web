import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsForm } from './projects-form';

describe('ProjectsForm', () => {
  let component: ProjectsForm;
  let fixture: ComponentFixture<ProjectsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
