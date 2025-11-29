import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksForm } from './tasks-form';

describe('TasksForm', () => {
  let component: TasksForm;
  let fixture: ComponentFixture<TasksForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
