import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalButton } from './internal-button';

describe('InternalButton', () => {
  let component: InternalButton;
  let fixture: ComponentFixture<InternalButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalButton],
    }).compileComponents();

    fixture = TestBed.createComponent(InternalButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
