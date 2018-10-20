import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexityItemComponent } from './complexity-item.component';

describe('ComplexityItemComponent', () => {
  let component: ComplexityItemComponent;
  let fixture: ComponentFixture<ComplexityItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexityItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexityItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
