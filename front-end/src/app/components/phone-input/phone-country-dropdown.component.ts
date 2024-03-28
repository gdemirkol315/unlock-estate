import {Component, EventEmitter, Output} from '@angular/core';
import * as countryData from "country-telephone-data";

@Component({
  selector: 'phone-country-dropdown',
  templateUrl: './phone-country-dropdown.component.html',
  styleUrl: './phone-country-dropdown.component.scss'
})
export class PhoneCountryDropdownComponent {

  countries = countryData.allCountries;
  selectedCountry;
  phoneNumber: string;
  @Output() countryChange = new EventEmitter<any>();

  constructor() {
    this.selectedCountry = this.countries[0].iso2; // Default to the first country in the list
  }

  onCountryChange($event) {
    this.countryChange.emit($event.value);
  }

}
