import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsForm } from './payments-form';

describe('PaymentsForm', () => {
  let component: PaymentsForm;
  let fixture: ComponentFixture<PaymentsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
