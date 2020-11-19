import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  catchError,
} from "rxjs/operators";
import {
  merge,
  fromEvent,
  Observable,
  concat,
  throwError,
  combineLatest,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { CourseService } from "../services/course.service";
interface CourseData {
  course: Course;
  lessons: Lesson[];
}
@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  // course$: Observable<Course>;

  // lessons$: Observable<Lesson[]>;
  courseData$: Observable<CourseData>;

  constructor(
    private route: ActivatedRoute,
    private courseSerice: CourseService
  ) {}

  ngOnInit() {
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.courseSerice
      .loadCourseById(courseId)
      .pipe(startWith(null));
    const lessons$ = this.courseSerice
      .loadAllCourseLessons(courseId)
      .pipe(startWith([]));
    this.courseData$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons]) => {
        return {
          course,
          lessons,
        };
      }),
      tap(console.log)
    );
  }
}
