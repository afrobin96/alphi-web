import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersForm } from './members-form';

describe('MembersForm', () => {
  let component: MembersForm;
  let fixture: ComponentFixture<MembersForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
