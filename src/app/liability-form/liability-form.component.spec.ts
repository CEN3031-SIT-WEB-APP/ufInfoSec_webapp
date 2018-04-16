import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiabilityFormComponent } from './liability-form.component';

describe('LiabilityFormComponent', () => {
  let component: LiabilityFormComponent;
  let fixture: ComponentFixture<LiabilityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiabilityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
