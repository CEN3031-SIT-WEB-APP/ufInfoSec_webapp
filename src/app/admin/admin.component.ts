import { Component, OnInit } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { NgForm, FormGroup, FormBuilder, FormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { RestService } from '../rest.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {
  private results;
  private users;
  public orderForm: FormGroup;
  private cands = ['President', 'VP', 'Secretary', 'Treasurer'];
  private myOptions: IMultiSelectOption[];
  private optionsModel: number[];
  formData: FormGroup;
  private customTiles;

  // Settings configuration for the dropdown checkbox
  mySettings: IMultiSelectSettings = {
    enableSearch: false,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default',
    dynamicTitleMaxItems: 0,
    displayAllSelectedText: false,
  };

  notifications = {
    emptyField: false,
    existingPoll: false,
    electionResults: false,
    createElectionWarning: false,
    endingElection: false,
    deletingResults: false
  }
    public signInForm: FormGroup;
    signInNotifications = { emptyField: false }
    private nums = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

    public createMeetingForm: FormGroup;
    createMeetingNotifications = { emptyField: false }
    private weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    private reoccuringBool = ['Yes', 'No'];
    private createBool = ['Create', 'Remove'];

    private title = 'Admin Page';


  constructor(private sessionService: SessionService, private requests: RestService, private modalService: NgbModal,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.myOptions = [{ id: 'President', name: 'President' }, { id: 'VP', name: 'VP' },
    { id: 'Treasurer', name: 'Treasurer' }, { id: 'Secretary', name: "Secretary" }];

    this.formData = this.formBuilder.group({ name: [], description: [], link: [] });

    // get current home tiles from backend
    this.requests.customTiles().subscribe(
      success => { this.customTiles = success; },
      failure => { console.log(failure); }
    );

    this.requests.userList('/list_users').subscribe(
      success => {
        for (let i = 0; success[i] !== undefined; i++) {
          const user = success[i];
          user['mass_mail_optin'] = (user['mass_mail_optin'] === 1) ? 'Yes' : 'No';
        }
        this.users = success;
      },
      failure => { console.log(failure); }
    );

    this.orderForm = this.formBuilder.group({
      candidates: this.formBuilder.array([this.createQuestion()])
    });

    if (!this.sessionService.getElection()) {
      this.getResults();
    }
    
    this.signInForm = this.formBuilder.group({
        signInInfo: this.formBuilder.array([ this.createSignInArr()])
    });

    this.createMeetingForm = this.formBuilder.group({
        createMeetingInfo: this.formBuilder.array([ this.createCreateMeetingArr()])
    }); 
  }

  // Returns an array of all the accounts that gets diplayed in the webpage
  public getUsers() {
    return this.users;
  }

  private isNotDuplicate(item) {
    let val = true;
    // for every existing custom home tile
    this.customTiles.forEach(function (ct) {
      // check each field
      if (ct.name === item.name && ct.link === item.link
        && ct.description === item.description) {
        val = false;
      }
    });
    return val;
  }

  public getCustomTiles() { return this.customTiles; }

  // adds a new cutom tile to general home page
  public addTile(formData: FormGroup) {
    const item = formData.value;
    // check if all fields are filled
    if (item.name !== null && item.description !== null && item.link !== null) {
      // check item is already not an existing home tile
      if (this.isNotDuplicate(item)) {
        this.requests.addTile(item); // backend add tile
        window.open(item.link, '_blank');
        this.formData.reset(); // reset entry fields
        this.customTiles.push(item); // update custom tiles list
      }
    }
  }

  // deletes a curent home tile
  public deleteTile(id, index) {
    this.requests.deleteTile(id); // backend delete (uniquely identified by id)
    this.customTiles.splice(index, 1); // delete frontend element
  }

  // Opens the popup window for the admin to use
  public open(content: any) {
    this.modalService.open(content);
  }

  //Creates FormGroups that get added to the formArray
  createQuestion(): FormGroup {
    return this.formBuilder.group({
      candidate: ['', [
        Validators.required
      ]],
      position: [, [
        Validators.required
      ]]
    });
  }

  //Adds formgroups to the formArray
  public addItem(): void {
    const control = <FormArray>this.orderForm.controls['candidates'];
    control.push(this.createQuestion());
  }

  //Checks to make sure that there are no empty fields in the form
  private emptyForm(form: any) {
    if (form.candidates.length === 0) {
      return true;
    }
    for (let x of form.candidates) {
      if (x.candidate === '') {
        return true;
      }
      if (!x.position || x.position.length === 0) {
        return true;
      }
    }
    return false;
  }

  //Sends the formgroup to be turned into a post request
  public onSubmit(formValue: any) {
    if (this.emptyForm(formValue.value)) {
      this.notifications.emptyField = true;
      return;
    }
    if (!this.notifications.createElectionWarning) {
      this.notifications.createElectionWarning = true;
      return;
    }

    this.sessionService.createPoll(this.orderForm).subscribe(
      res => {
        if (res === 'Success') {
          alert('Success!  The election has been created.  Navigate to the home page to vote!');
        }
        else {
          this.notifications.existingPoll = true;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  //Deletes elments from form after clicking "x" button
  public deleteField(i) {
    const control = <FormArray>this.orderForm.controls['candidates'];
    control.removeAt(i);
  }

  // Encapsulation yo
  public getCandidates() {
    return this.cands;
  }

  // Ends the election
  public endElection() {
    if (!this.notifications.endingElection) {
      this.notifications.endingElection = true;
      return;
    }
    this.requests.endElection().subscribe(
      res => {
        window.location.reload();
      },
      err => {
        console.log(err);
      }
    );
  }

  // Gets the users session
  public getSession() {
    return this.sessionService;
  }

  // Gets the results of an election
  public getResults() {
    this.requests.getElectionResults().subscribe(
      res => {
        this.notifications.electionResults = true;
        this.results = res;
      },
      err => {
        if (err.status === 405) {
        }
        if (err.status === 400) {
          // TODO: generic error accessing database
        }
      });
  }

  public getPresidentResults() {
    let arr = [];
    for (let item in this.results.president) { arr.push(item); }
    return arr;
  }

  public getVpResults() {
    let arr = [];
    for (let item in this.results.vp) { arr.push(item); }
    return arr;
  }

  public getTreasurerResults() {
    let arr = [];
    for (let item in this.results.treasurer) { arr.push(item); }
    return arr;
  }

  public getSecretaryResults() {
    let arr = [];
    for (let item in this.results.secretary) { arr.push(item); }
    return arr;
  }

  // Deletes all votes and calculated results from the database
  public deleteResults() {
    if (!this.notifications.deletingResults) {
      this.notifications.deletingResults = true;
      return;
    }
    this.requests.deleteElectionResults().subscribe(
      res => {
        window.location.reload();
      },
      err => {
        console.log(err);   // TODO: This should be turned into an error message that displays on the screen
      }
    );
  }

  // Checks that there currently is an election
  public getElection() {
    return this.sessionService.getElection();
  }

// ------- sign in modal stuff --------
    
    createSignInArr(): FormGroup {
        return this.formBuilder.group({
            member: ['',[Validators.required]],
            signInCount: ['', [Validators.required]]
        });
    }

    public addItemToSignInArray(): void {
        const control = <FormArray>this.signInForm.controls['signInInfo'];
        control.push(this.createSignInArr());
    }


    private emptySignInForm(form: any) {
        for (let x of form.signInInfo) {
            if (x.member === '') {
                return true;
            }
            if (x.signInCount.length === 0) {
                return true;
            }
        }
    }

    //called when submit button
    public onSignInSubmit(formValue: any) {
        if (this.emptySignInForm(formValue.value)) {
          this.signInNotifications.emptyField = true;
          return;
        }
        let data = {email:formValue.value.signInInfo[0].member, val:parseInt(formValue.value.signInInfo[0].signInCount)};
        let func = "meeting set";
        this.sessionService.meetingSignIn(data, func).subscribe(
            //res => {
                //if (res === "Success") {alert('You have successfully signed in!');}
                //else { alert('There was a problem signing in');}
            //},
            //err => {
                //alert('An error was encountered');
            //}
        );
    }

    public onSignInCountSubmit (formValue: any) {
        if (this.emptySignInForm(formValue.value)) {
          this.signInNotifications.emptyField = true;
          return;
        }
        //MAKE SESSION SERVICE FUNCTION HERE
    }

    public getNums() {
        return this.nums;
    }

    // get page title
    public getTitle() {
        return this.title;
    }

// ------- create meeting modal stuff --------

    createCreateMeetingArr(): FormGroup {
        return this.formBuilder.group({
            weekDay: ['',[Validators.required]],
            startTime: ['', [Validators.required]],
            endTime : ['', [Validators.required]],
            reoccuring : ['', Validators.required],
            create : ['', Validators.required]
        });
    }

    private emptyCreateMeetingForm(form: any) {
        for (let x of form.createMeetingInfo) {
            if (x.weekDay === '' || x.startTime === '' || x.endTime === '' || x.reoccuring === '' || x.create === '') {
                return true;
            }
        }
    }

    //called when submit button
    public onCreateMeetingSubmit(formValue: any) {
        if (this.emptyCreateMeetingForm(formValue.value)) {
          this.createMeetingNotifications.emptyField = true;
          return;
        }


        //alter values here so they can have more user friendly default values
        if (formValue.value.createMeetingInfo[0].reoccuring === 'Yes') {
        formValue.value.createMeetingInfo[0].reoccuring = '1';
        }
        else {
        formValue.value.createMeetingInfo[0].reoccuring = '0';
        }
        if (formValue.value.createMeetingInfo[0].create === 'Create') {
        formValue.value.createMeetingInfo[0].create = '1';
        }
        else {
        formValue.value.createMeetingInfo[0].create = '0';
        }

        if (formValue.value.createMeetingInfo[0].weekDay === 'Sunday') {
        formValue.value.createMeetingInfo[0].weekDay = '0';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Monday') {
        formValue.value.createMeetingInfo[0].weekDay = '1';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Tuesday') {
        formValue.value.createMeetingInfo[0].weekDay = '2';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Wednesday') {
        formValue.value.createMeetingInfo[0].weekDay = '3';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Thursday') {
        formValue.value.createMeetingInfo[0].weekDay = '4';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Friday') {
        formValue.value.createMeetingInfo[0].weekDay = '5';
        }
        if (formValue.value.createMeetingInfo[0].weekDay === 'Saturday') {
        formValue.value.createMeetingInfo[0].weekDay = '6';
        }

        formValue.value.createMeetingInfo[0].startTime = (formValue.value.createMeetingInfo[0].startTime).concat(':00');
        formValue.value.createMeetingInfo[0].endTime = (formValue.value.createMeetingInfo[0].endTime).concat(':00');
 
        let data = {
            day_of_week: Number(formValue.value.createMeetingInfo[0].weekDay),
            start_time: formValue.value.createMeetingInfo[0].startTime , 
            end_time: formValue.value.createMeetingInfo[0].endTime, 
            reoccuring: Number(formValue.value.createMeetingInfo[0].reoccuring)
        };

        this.sessionService.createMeeting(data, formValue.value.createMeetingInfo[0].create).subscribe(
            res => {
               if (res.status === 200) {alert('You have successfully created a meeting!');}
                else { alert('There was a problem creating a meeting');}
            },
            err => {
                alert('An error was encountered when trying to create the meeting');
            }
        );
    }

    public getDays() {
        return this.weekDays;
    }

    public getReoccuring() {
        return this.reoccuringBool;
    }
    
    public getCreate() {
        return this.createBool;
    }
}
