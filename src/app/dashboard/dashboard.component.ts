import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  segmentForm: FormGroup;
  settings: any[] = [
    { value: 'Interval Duration', viewValue: 'Interval Duration' },
    { value: 'Range Duration', viewValue: 'Range Duration' },
    { value: 'Number of Segments', viewValue: 'Number of Segments' }
  ]
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.segmentForm = this.fb.group({
      video_link: ['https://codejudge-question-artifacts.s3.ap-south-1.amazonaws.com/q-94/big_buck_bunny_720p_2mb.mp4', [Validators.required]],
      segment_settings: [null, [Validators.required]],
      interval_duration: [null, [Validators.min(1)]],
      range_duration: this.fb.array([]),
      no_of_segments: [null]
    });
  }

  onSubmit() {
    console.log(this.segmentForm.value);
  }

  onInsertRange() {
    const rangeDurationFormArray = <FormArray> this.segmentForm.controls['range_duration'];
    const rangeDurationFormGroup = this.fb.group({
      start: [null, [Validators.required]],
      end: [null, [Validators.required]]
    });
    rangeDurationFormArray.insert(rangeDurationFormArray.length, rangeDurationFormGroup);
  }

  onDeleteRange(index) {
    const rangeDurationFormArray = <FormArray> this.segmentForm.controls['range_duration'];
    rangeDurationFormArray.removeAt(index);
  }
}
