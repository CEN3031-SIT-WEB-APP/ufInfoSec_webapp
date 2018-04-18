import { Component, OnInit } from '@angular/core';

@Component({
  	selector: 'app-about',
  	templateUrl: './about.component.html',
  	styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

	private title = 'About';

  	constructor() { }

  	ngOnInit() {
  	}

  	// get page title
    public getTitle() {
        return this.title;
    }

}
