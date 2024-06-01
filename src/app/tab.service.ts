import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tab } from 'src/model/tabs';
import { tabToRoute } from './app-routing.module';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TabService {

  // note: non-null because one tab is always expected to be selected
  private currentTab: BehaviorSubject<Tab>;

  constructor(
    private router: Router
  ) {
    this.currentTab = new BehaviorSubject<Tab>(Tab.HOME);
  }

  public get tab(): Tab {
    return this.currentTab.value;
  }

  public get tab$(): Observable<Tab> {
    return this.currentTab.asObservable();
  }

  public selectTabAndRedirect(tab: Tab): void {
    this.selectWithoutRedirect(tab);
    this.redirectTo(tab);
  }

  public selectWithoutRedirect(tab: Tab) {
    this.currentTab.next(tab);
  }

  private redirectTo(tab: Tab) {
    const associatedPath: string = tabToRoute.get(tab) ?? "Unknown Tab";
    console.log("Tab selection of " + tab + " leads to path " + associatedPath);
    this.router.navigate([associatedPath]);
  }
}
