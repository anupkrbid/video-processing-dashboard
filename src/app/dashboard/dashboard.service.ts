import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  private getApiUrl() {
    return environment.apiUrl;
  }

  processSegmentVideo(payload: any, segmentSetting: string): Observable<any> {
    let apiUrl = this.getApiUrl();

    switch (segmentSetting) {
      case 'Interval Duration': {
        apiUrl += '/api/process-interval';
        break;
      }
      case 'Range Duration': {
        apiUrl += '/api/process-range';
        break;
      }
      case 'Number of Segments': {
        apiUrl += '/api/process-segments';
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
    let apiUrl = `${this.getApiUrl()}/api/combine-video`;
    return this.httpClient.post(apiUrl, payload);
  }
}

