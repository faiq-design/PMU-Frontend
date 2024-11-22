import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { WebSocketService } from "src/app/service/web-socket.service";

import { Location } from "@angular/common";
import { NotificationService } from "src/app/service/notification.service";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  modalRef: NgbModalRef;
  @ViewChild('serverDownMessageModal') serverDownMessageModal: TemplateRef<any>;
  title = "demo1";

  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  stock: any = {};
  userInfo: any;

  private webSocket: WebSocket;
  notificationList: any = [];
  serverIsDown: boolean;
  showPopup: boolean;
  // showNotification: boolean = true;
  // closeNotification(): void {
  //   this.showNotification = false;
  //   console.log("this.showNotification = false;",this.showNotification = false);
  // }
  constructor(private router: Router,private webSocketService: WebSocketService, private location: Location,
    private notificationService: NotificationService,   private modalService: NgbModal,
  ) {
    if (!localStorage.getItem("jwtToken")) {
      this.router.navigate(["/login"]);

 
  
    }
  
   
    // this.webSocket = new WebSocket('ws://localhost:8080/notification');
    // this.webSocket.onopen = (event) => {
    //   console.log('WebSocket connected.');
    // };
    // this.webSocket.onmessage = (event) => {
    //   this.notificationList = JSON.parse(event.data);
    //   console.log('Received notificationList:', this.notificationList);
    //   this.notificationService.setNotificationData(this.notificationList);
    //   // this.showNotification = true;
    //   // setTimeout(() => this.showNotification = false, 3000); // Auto-hide after 3 seconds
    // };
    // this.webSocket.onclose = (event) => {
    //   console.log('WebSocket closed.');
    // };
    // this.webSocket.onerror = (event) => {
    //   console.error('WebSocket error:', event);
    // };


    this.webSocketService.getMessages().subscribe((message) => {
        this.notificationList = message;
         console.log('Received notificationList:', this.notificationList);
      this.notificationService.setNotificationData(this.notificationList);
    });

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.showSidebar = true;
        this.showNavbar = true;
        this.showFooter = true;

   

        if (document.querySelector(".main-panel")) {
          document.querySelector(".main-panel").classList.remove("w-100");
        }
        if (document.querySelector(".page-body-wrapper")) {
          document
            .querySelector(".page-body-wrapper")
            .classList.remove("full-page-wrapper");
        }
        if (document.querySelector(".content-wrapper")) {
          document
            .querySelector(".content-wrapper")
            .classList.remove("auth", "auth-img-bg");
          document.querySelector(".content-wrapper").classList.remove("p-0");
        }
      }
    });
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  }

  // ngOnDestroy(): void {
  //   if (this.webSocket) {
  //     this.webSocket.close();
  //   }
  // }


  messages: any[] = [];
  ngOnInit() {
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });


    // this.notificationService.setNotificationVisibility(true);

    const notificationUserId = 5; 
    this.notificationService.setNotificationUserId(notificationUserId);

     // Update the object based on some condition
     const userData: any = { vendorId: this.userInfo?.vendor?.id, hospitalId: this.userInfo?.hospitalId, roleStatus : this.userInfo?.role?.status};
     this.notificationService.setUserData(userData);

     this.notificationService.serverIsDown$.subscribe(data => {
      this.serverIsDown = data; 
      console.log("this.serverIsDown : ",this.serverIsDown );  
      // this.modalRef = this.modalService.open(this.serverDownMessageModal);
      this.showPopup = this.serverIsDown ? true : false;
    });
  }
  
  serverDownMessage = "Connnection Lost To Notification Server Plz Close To Refresh"
  refresh(){
    window.location.reload();
  }

  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    window.location.reload();
  }
  
}
