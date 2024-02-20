import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateCreateComponent } from './real-estate-create.component';

describe('RealEstateCreateComponent', () => {
  let component: RealEstateCreateComponent;
  let fixture: ComponentFixture<RealEstateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
