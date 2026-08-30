import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobaltInput } from './cobalt-input';

describe('CobaltInput', () => {
  let component: CobaltInput;
  let fixture: ComponentFixture<CobaltInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobaltInput],
    }).compileComponents();

    fixture = TestBed.createComponent(CobaltInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
