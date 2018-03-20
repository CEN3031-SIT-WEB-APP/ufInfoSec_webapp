import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class MediatorService {

	// meetingSignIn: Boolean = true;
  meetingSignIn: any = false;
  meetingSignInUpdated = new EventEmitter();

  constructor() { }

  getMeetingSignInState() {
  	return this.meetingSignInUpdated;
  }

  setMeetingSignInState (state) {
  	this.meetingSignIn = state;
  	this.meetingSignInUpdated.emit(this.meetingSignIn);
  }
}
