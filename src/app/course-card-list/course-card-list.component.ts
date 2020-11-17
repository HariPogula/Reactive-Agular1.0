import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { filter, tap } from "rxjs/operators";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { Course } from "../model/course";

@Component({
  selector: "course-card-list",
  templateUrl: "./course-card-list.component.html",
  styleUrls: ["./course-card-list.component.scss"],
})
export class CourseCardListComponent implements OnInit {
  @Input() courses: Course[] = [];
  @Output() coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
    dialogRef
      .afterClosed()
      //This is in the success crtieria. !! will make true condition
      .pipe(
        filter((succ) => !!succ),
        tap(() => this.coursesChanged.emit())
      )
      .subscribe();
  }
}
