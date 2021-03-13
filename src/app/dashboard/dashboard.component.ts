import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.segmentForm = this.fb.group({
      video_link: ["https://codejudge-question-artifacts.s3.ap-south-1.amazonaws.com/q-94/big_buck_bunny_720p_2mb.mp4", [Validators.required]],
      segment_settings: [null, [Validators.required]],
      interval_duration: [null, [Validators.min(1)]],
      interval_range: this.fb.array([]),
      no_of_segments: [null]
    });
    this.combineForm = this.fb.group({
      width: [null, [Validators.required]],
      height: [null, [Validators.required]],
      segments: this.fb.array([])
    });
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
      start: [null, [Validators.required]],
      end: [null, [Validators.required]],
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
      video_url: [null, [Validators.required]],
      start: [null, [Validators.required]],
      end: [null, [Validators.required]],
    });

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
}
