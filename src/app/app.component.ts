import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthStoreService } from "./services/auth-store.service";
import { LoadingService } from "./services/loading.service";
import { MessageService } from "./services/message.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(public authStore: AuthStoreService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authStore.logout();
    this.router.navigate(["/login"]);
  }
}
