import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // 当前路由url
  private currentUrl: string;
  // 用于判断返回键是否触发
  private backButtonPressed = false;
  public appPages = [
    {
      title: '',
      url: '/home',
      icon: 'home'
    },
    {
      title: '',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initStatusBarStyle();
      this.splashScreen.hide();
      // this.registerBackButtonAction();
    });
    // this.initRouterListen();
  }
  private initStatusBarStyle() {
    this.statusBar.overlaysWebView(false);
    // set status bar to primary color
    this.statusBar.backgroundColorByHexString('#3880ff');
  }

  registerBackButtonAction() {
    this.platform.backButton.subscribe(() => {
      if (this.currentUrl === '/home' || this.currentUrl === '/list') {
        if (this.backButtonPressed) {
          // this.platform.exitApp();
          // this.appMinimize.minimize();
          this.backButtonPressed = false;
        } else {
          this.backButtonPressed = true;
          setTimeout(() => (this.backButtonPressed = false), 2000);
        }
      } else {
        this.navController.back();
      }
    });
  }

  initRouterListen() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }
}
