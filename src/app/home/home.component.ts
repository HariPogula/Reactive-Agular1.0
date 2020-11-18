import { Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { CourseService } from "../services/course.service";
import { LoadingService } from "../services/loading.service";
import { MessageService } from "../services/message.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private courseService: CourseService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.courseService.getAllCourses().pipe(
      map((courses) => courses.sort(sortCoursesBySeqNo)),
      catchError((err) => {
        const message = "Could not Load Services";
        this.messageService.showErrors(message);
        return throwError(err);
      })
    );

    const loadCourses$ = this.loadingService.showLoaderuntilCompleted(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "BEGINNER")
      )
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "ADVANCED")
      )
    );
  }
}
