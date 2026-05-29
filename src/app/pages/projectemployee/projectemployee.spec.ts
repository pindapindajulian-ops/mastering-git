import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projectemployee } from './projectemployee';

describe('Projectemployee', () => {
  let component: Projectemployee;
  let fixture: ComponentFixture<Projectemployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projectemployee],
    }).compileComponents();

    fixture = TestBed.createComponent(Projectemployee);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
