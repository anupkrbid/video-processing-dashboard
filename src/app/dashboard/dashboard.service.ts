import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  processSegmentVideo(payload: any, segmentSetting: string): Observable<any> {
    // let apiUrl = environment.apiUrl; // http://3.80.98.122:4001
    let apiUrl = 'http://3.80.98.122:4001';
    switch (segmentSetting) {
      case 'Interval Duration': {
        apiUrl += '/api/process-interval';
        // {"interval_videos":[{"video_url":"https://cj-video-test.s3.amazonaws.com/video-proces-0.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/video-proces-1.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/video-proces-2.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/video-proces-3.mp4"}]}
        break;
      }
      case 'Range Duration': {
        apiUrl += '/api/process-range';
        // {"interval_videos":[{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-2c8ee1bc-8417-11eb-8bec-0242ac110004video-proces-0.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-2db7eb88-8417-11eb-8bec-0242ac110004video-proces-1.mp4"}]}
        // {"interval_videos":[{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-4aff274c-8417-11eb-8bec-0242ac110004video-proces-0.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-4cfa94fa-8417-11eb-8bec-0242ac110004video-proces-1.mp4"}]}
        break;
      }
      case 'Number of Segments': {
        apiUrl += '/api/process-segments';
        // {"interval_videos":[{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-95975ca2-8417-11eb-8bec-0242ac110004video-proces-0.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-97a0641c-8417-11eb-8bec-0242ac110004video-proces-1.mp4"},{"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-9934351a-8417-11eb-8bec-0242ac110004video-proces-2.mp4"}]}
        break;
      }
      default: {
        return throwError(new Error('Invalid Segment Setting (' + segmentSetting +')...!!!'));
      }
    }

    return this.httpClient
      .post(apiUrl, payload)
      .pipe(map((res: any) => res.interval_videos));
  }

  processCombineVideo(payload: any): Observable<any> {
    // let apiUrl = environment.apiUrl + ' /api/combine-video'; // http://3.80.98.122:4001
    let apiUrl = 'http://3.80.98.122:4001/api/combine-video';
    // {"video_url":"https://cj-video-test.s3.amazonaws.com/CJ-Video-Test-afd21b18-841f-11eb-8d32-0242ac110004video-proces-f.mp4"}
    return this.httpClient.post(apiUrl, payload);
  }
}

