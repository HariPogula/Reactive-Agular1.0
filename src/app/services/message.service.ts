import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

@Injectable()
export class MessageService {
  private errorSub = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.errorSub
    .asObservable()
    .pipe(filter((messages) => messages && messages.length > 0));
  constructor() {}

  showErrors(...errors: string[]) {
    this.errorSub.next(errors);
  }
}
