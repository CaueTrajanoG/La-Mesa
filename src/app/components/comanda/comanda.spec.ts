import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Comanda } from './comanda';

describe('Comanda', () => {
  let component: Comanda;
  let fixture: ComponentFixture<Comanda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comanda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Comanda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
