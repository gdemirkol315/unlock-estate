import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateDetailComponent } from './real-estate-detail.component';

describe('RealEstateDetailComponent', () => {
  let component: RealEstateDetailComponent;
  let fixture: ComponentFixture<RealEstateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealEstateDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealEstateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
