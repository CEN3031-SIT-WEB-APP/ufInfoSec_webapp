import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from '../session.service';

class MockSessionService {
  private cachedLoggedIn = false;
  public getCachedLoggedIn() {
    return this.cachedLoggedIn;
  }
  public setCachedLoggedIn(newValue) {
    this.cachedLoggedIn = newValue;
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let element;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        RouterTestingModule,
        NgbModule.forRoot()
      ],
      providers: [
        {provide: SessionService, useClass: MockSessionService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('only \'about\' and \'sponsors\' should be shown when user is logged out', () => {
    expect(element.querySelector('#homeLink')).not.toBeTruthy();
    expect(element.querySelector('#aboutLink')).toBeTruthy();
    expect(element.querySelector('#sponsorsLink')).toBeTruthy();
    expect(element.querySelector('#profileLink')).not.toBeTruthy();
    expect(element.querySelector('#logOutButton')).not.toBeTruthy();
  });

  it('log out button should be shown when logged in', () => {
    let sessionService = TestBed.get(SessionService);
    sessionService.setCachedLoggedIn(true);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.querySelector('#homeLink')).toBeTruthy();
      expect(element.querySelector('#aboutLink')).toBeTruthy();
      expect(element.querySelector('#sponsorsLink')).toBeTruthy();
      expect(element.querySelector('#profileLink')).toBeTruthy();
      expect(element.querySelector('#logOutButton')).toBeTruthy();
    });
  });
});
