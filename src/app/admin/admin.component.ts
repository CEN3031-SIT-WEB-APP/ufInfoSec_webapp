import { Component, OnInit } from '@angular/core';
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

    formData: FormGroup;
    private users;
    private customTiles;

    public signInForm: FormGroup;
    signInNotifications = { emptyField: false }
    private nums = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

    private title = 'Admin Page';

    constructor(
        private requests: RestService,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private sessionService: SessionService
    ) { }

    ngOnInit() {

        const fb: FormBuilder = new FormBuilder();
        this.formData = fb.group({ name: [], description: [], link: [] });

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

        this.signInForm = this.formBuilder.group({
            signInInfo: this.formBuilder.array([ this.createSignInArr()])
        });

        var date = new Date;
        const data = {
            day_of_week: date.getDay(),
            start_time: date.getHours().toString().concat(":00:00"),
            end_time: (date.getHours() + 1).toString().concat(":00:00"),
            reoccuring: true,
        };
        //await queryAsync('INSERT INTO `meeting` SET ?', meetingInsert);
        this.sessionService.createMeeting(data);

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

    public getUsers() {
        return this.users;
    }

    public getCustomTiles() {
        return this.customTiles;
    }

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

// ------- modal stuff --------
    
    //opens the modal
    public open(content: any) {
        this.modalService.open(content);
    }

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
}
