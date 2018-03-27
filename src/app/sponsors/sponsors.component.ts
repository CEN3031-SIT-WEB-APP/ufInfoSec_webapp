import { Component, OnInit } from '@angular/core';

@Component({
  	selector: 'app-sponsors',
  	templateUrl: './sponsors.component.html',
 	styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {

	private title = 'Sponsors\' Page';

  	constructor() { }

  	ngOnInit() {
  	}

  	// get page title
    public getTitle() {
        return this.title;
    }

}
