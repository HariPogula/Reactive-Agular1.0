import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "./../model/course";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  constructor(private http: HttpClient) {}

  getAllCourses(): Observable<Course[]> {
    return (
      this.http
        .get<Course[]>("/api/courses")
        // To get results after "Payload" property.
        .pipe(
          map((res) => res["payload"]),
          shareReplay()
        )
    );
  }
}
