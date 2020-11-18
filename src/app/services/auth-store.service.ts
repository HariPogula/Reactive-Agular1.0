import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

const AUTH_DATA = "auth_data";

@Injectable({
  providedIn: "root",
})
export class AuthStoreService {
  private userSub = new BehaviorSubject<User>(null);
  user$: Observable<User> = this.userSub.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user)); // !! Returns true if user is there
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));
    const user = localStorage.getItem(AUTH_DATA);
    if (user) {
      this.userSub.next(JSON.parse(user));
    }
  }
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>("/api/login", { email, password })
      .pipe(
        tap((user) => {
          this.userSub.next(user);
          localStorage.setItem(AUTH_DATA, JSON.stringify(user));
        }),
        shareReplay()
      );
  }

  logout() {
    this.userSub.next(null);
    localStorage.removeItem(AUTH_DATA);
  }
}
