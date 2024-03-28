import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneCountryDropdownComponent } from './phone-country-dropdown.component';

describe('PhoneInputComponent', () => {
  let component: PhoneCountryDropdownComponent;
  let fixture: ComponentFixture<PhoneCountryDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneCountryDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneCountryDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
