import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { DashboardService } from './dashboard.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  segmentForm: FormGroup;
  combineForm: FormGroup;
  settings: any[] = [
    { value: "Interval Duration", viewValue: "Interval Duration" },
    { value: "Range Duration", viewValue: "Range Duration" },
    { value: "Number of Segments", viewValue: "Number of Segments" },
  ];
  urlRegex = /^(http(s)?:\/\/|www\.).*(\.mp4)$/;
  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.segmentForm = this.fb.group({
      video_link: [null, [Validators.required, Validators.pattern(this.urlRegex)]],
      segment_settings: [null, [Validators.required]]
    });
    this.combineForm = this.fb.group({
      width: [null, [Validators.required, Validators.min(1)]],
      height: [null, [Validators.required, Validators.min(1)]],
      segments: this.fb.array([], [this.sizeValidatorFn()])
    });
  }

  onSegmentSettingChanged() {
    const segmentFormValue = this.segmentForm.value;
    const setting = this.segmentForm.get('segment_settings').value;
    switch (setting) {
      case 'Interval Duration': {
        this.segmentForm = this.fb.group({
          video_link: [segmentFormValue.video_link, [Validators.required, Validators.pattern(this.urlRegex)]],
          segment_settings: [segmentFormValue.segment_settings, [Validators.required]],
          interval_duration: [null, [Validators.required, Validators.min(1)]]
        });
        break;
      }
      case 'Range Duration': {
        this.segmentForm = this.fb.group({
          video_link: [segmentFormValue.video_link, [Validators.required, Validators.pattern(this.urlRegex)]],
          segment_settings: [segmentFormValue.segment_settings, [Validators.required]],
          interval_range: this.fb.array([], [this.sizeValidatorFn()])
        }); //  can add { updateOn:'blur' } as 2nd param to this.fb.group for added features
        break;
      }
      case 'Number of Segments': {
        this.segmentForm = this.fb.group({
          video_link: [segmentFormValue.video_link, [Validators.required, Validators.pattern(this.urlRegex)]],
          segment_settings: [segmentFormValue.segment_settings, [Validators.required]],
          no_of_segments: [null, [Validators.required, Validators.min(1)]]
        });
        break;
      }
    }
    this.segmentForm.updateValueAndValidity();
  }

  sizeValidatorFn(): ValidatorFn  {
    return function (array: FormArray): { [key: string]: any } | null {
      console.log('sizeValidatorFn Fired');
      return array.length > 0 ? null : {
        invalidSize: true
      };
    }
  }

  rangeValidatorFn(smallerControlName: string, biggerControlName: string): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
      console.log('rangeValidatorFn Fired');
      const smallerNo = control.get(smallerControlName).value;
      const biggerNo = control.get(biggerControlName).value;
      console.log(smallerNo, biggerNo);
      return smallerNo < biggerNo ? null : {
        invalidRange: true
      };
    }
  }

  onSegmentFormSubmit() {
    console.log(this.segmentForm.value);
    this.dashboardService
      .processSegmentVideo(this.segmentForm.value, this.segmentForm.value.segment_settings)
      .pipe(take(1))
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onAddRangeDuration() {
    const intervalRangeFormArray = <FormArray>(this.segmentForm.controls["interval_range"]);
    const intervalRangeFormGroup = this.fb.group({
      start: [null, [Validators.required, Validators.min(1)]],
      end: [null, [Validators.required, Validators.min(2)]]
    }, [this.rangeValidatorFn('start', 'end')]);

    intervalRangeFormArray.insert(intervalRangeFormArray.length, intervalRangeFormGroup);
  }

  onDeleteRangeDuration(index) {
    const intervalRangeFormArray = <FormArray>(this.segmentForm.controls["interval_range"]);
    intervalRangeFormArray.removeAt(index);
  }

  onAddVideo() {
    const segmentsFormArray = <FormArray>(this.combineForm.controls["segments"]);
    const segmentsFormGroup = this.fb.group({
      video_url: [null, [Validators.required, Validators.pattern(this.urlRegex)]],
      start: [null, [Validators.required, Validators.min(1)]],
      end: [null, [Validators.required, Validators.min(2)]]
    }, [this.rangeValidatorFn('start', 'end')]);

    segmentsFormArray.insert(segmentsFormArray.length, segmentsFormGroup);
  }

  onDeleteVideo(index) {
    const segmentsFormArray = <FormArray>(this.combineForm.controls["segments"]);
    segmentsFormArray.removeAt(index);
  }

  onCombineFormSubmit() {
    console.log(this.combineForm.value);
    this.dashboardService
      .processCombineVideo(this.combineForm.value)
      .pipe(take(1))
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // can be called after form creation to set a event listener on changes and change vallidation / note: this is not ngOnChanges
  // onChanges() {
  //   this.recipeForm.get('category').valueChanges.subscribe(val => {
  //     const subCategoryControl = this.recipeForm.get('subcategory');
  //     if (val) {
  //       //update our validators
  //       subCategoryControl.setValidators(Validators.required);
  //       //update formControl validity based on new validators
  //       subCategoryControl.updateValueAndValidity();
  //     }
  //     else {
  //       //remove validators cause we don't want them if no category val
  //       subCategoryControl.setValidators(null);
  //       //update formControl validity based on new validators
  //       //in case they were marked as invalid from previously
  //       subCategoryControl.updateValueAndValidity();
  //     }
  //   });
}
