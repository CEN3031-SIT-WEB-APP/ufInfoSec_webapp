import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-liability-form',
  templateUrl: './liability-form.component.html',
  styleUrls: ['./liability-form.component.css']
})
export class LiabilityFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
