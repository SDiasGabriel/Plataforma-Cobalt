import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobaltButton } from './cobalt-button';

describe('CobaltButton', () => {
  let component: CobaltButton;
  let fixture: ComponentFixture<CobaltButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobaltButton],
    }).compileComponents();

    fixture = TestBed.createComponent(CobaltButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
