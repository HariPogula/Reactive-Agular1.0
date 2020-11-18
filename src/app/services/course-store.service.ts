import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { Course, sortCoursesBySeqNo } from "../model/course";

import { LoadingService } from "./loading.service";
import { MessageService } from "./message.service";

@Injectable({
  providedIn: "root",
})
export class CourseStoreService {
  private courseSubject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.courseSubject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messageService: MessageService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => {
        console.log("Res Payload :" + JSON.stringify(res["payload"]));

        res["payload"];
        this.courseSubject.next(res["payload"]);
      }),
      catchError((err) => {
        const message = "Could not load Courses";
        this.messageService.showErrors(message);
        return throwError(err);
      })
    );
    this.loadingService.showLoaderuntilCompleted(loadCourses$).subscribe();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses.filter((c) => (c.category = category)).sort(sortCoursesBySeqNo)
      )
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.courseSubject.getValue(); // Last value emitted by subject i.e all courses
    const index = courses.findIndex((course) => course.id == courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes,
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.courseSubject.next(newCourses);
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save Course";
        this.messageService.showErrors(message);
        this.courseSubject.next(courses); //For the Old values
        return throwError(err);
      }),
      shareReplay()
    );
  }
}
