import { Component, VERSION } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RestourantModel } from './model/restourant.mode';
import { RestaurantService } from './Service/restaurant.srvice';

interface WordCount {
  word: string;
  occurences: number;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  myForm: FormGroup;
  result: WordCount[] = [];
  isBusy: boolean;

  constructor(public restaurantService: RestaurantService) {}

  ngOnInit() {
    this.myForm = new FormGroup({
      text: new FormControl(''),
      url: new FormControl(''),
      source: new FormControl('input'),
    });
  }

  get f() {
    return this.myForm.controls;
  }

  onSubmit(form: FormGroup) {
    this.result = [];
    if (form.value.source === 'input') {
      this.result = this.findOcc(form.value.text);
    } else {
      this.loadRestourant(form.value.url);
    }
  }

  resetFormAndCleatTable() {
    this.f.text.setValue('');
    this.f.url.setValue('');
    this.result = [];
  }

  loadRestourant(url: string) {
    this.isBusy = true;
    return this.restaurantService
      .getRestourant(url)
      .subscribe((data: RestourantModel) => {
        this.result = this.findOcc(data.description);
        this.isBusy = false;
      });
  }

  findOcc(str): WordCount[] {
    let result: WordCount[] = [];
    str.split(/\s+/).forEach((x) => {
      var test: WordCount = { word: x, occurences: 1 };
      result.push(test);
    });
    return result;
  }
}