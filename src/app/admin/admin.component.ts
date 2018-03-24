import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import { RestService } from '../rest.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

    formData: FormGroup;
    private users;
    private customTiles;
    private nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

    constructor(
        private requests: RestService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {


        //this.requests.meetingSet(5, 5);

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

    public getNums() {
    return this.nums;
    }

    // Opens the popup window for the admin to use
    public open(content: any) {
        this.modalService.open(content);
    }

}
