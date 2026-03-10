import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPayment } from './modal-payment';

describe('ModalPayment', () => {
  let component: ModalPayment;
  let fixture: ComponentFixture<ModalPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
