import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';

import { CustomValidator } from '../shared/custom.validator';
import { DashboardService } from './dashboard.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  segmentedVideoResult = [];
  combinedVideoResult = [];
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
      segments: this.fb.array([], [CustomValidator.sizeValidatorFn(), CustomValidator.rangeValidatorFn('start', 'end')])
    });

    console.log('Sample URL => https://codejudge-question-artifacts.s3.ap-south-1.amazonaws.com/q-94/big_buck_bunny_720p_2mb.mp4');
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
          interval_range: this.fb.array([], [CustomValidator.sizeValidatorFn(), CustomValidator.rangeValidatorFn('start', 'end')])
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

  onSegmentFormSubmit() {
    this.segmentedVideoResult = [];
    console.log(this.segmentForm.value);
    this.dashboardService
      .processSegmentVideo(this.segmentForm.value, this.segmentForm.value.segment_settings)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.segmentedVideoResult = res;
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
      start: [null, [Validators.required, Validators.min(0)]],
      end: [null, [Validators.required]]
    });

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
      start: [null, [Validators.required, Validators.min(0)]],
      end: [null, [Validators.required]]
    });

    segmentsFormArray.insert(segmentsFormArray.length, segmentsFormGroup);
  }

  onDeleteVideo(index) {
    const segmentsFormArray = <FormArray>(this.combineForm.controls["segments"]);
    segmentsFormArray.removeAt(index);
  }

  onCombineFormSubmit() {
    this.combinedVideoResult = [];
    console.log(this.combineForm.value);
    this.dashboardService
      .processCombineVideo(this.combineForm.value)
      .pipe(take(1))
      .subscribe(
        (res) => {
          this.combinedVideoResult = [res];
          console.log(res);
        },
        (err) => {
          console.error(err);
        }
      );
  }
}
