import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from 'src/app/services/call.service';
import { RemoteComponent } from '../remote/remote';
import { Call } from 'src/app/model/Call';
import { CallBDService } from 'src/app/services/call-bd.service';
import { UserService } from 'src/app/services/user.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

declare var bootstrap: any;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  public Call:Call[];
  showCall:boolean = false;
  showButton:boolean = false;
  id:number = null;

  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;
  
  @ViewChild(RemoteComponent) videocall:RemoteComponent;
  @ViewChild('mySpan') mySpan: HTMLSpanElement;

  constructor(public dialog: MatDialog, private callService: CallService, private readonly http:CallBDService, private readonly http2:UserService, public signal:SignalrService,
    private local:LocalStorageService) { 
    this.isCallStarted$ = this.callService.isCallStarted$;
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  async ngOnInit(): Promise<void> {
    try{
      await this.signal.startConnection();  //conexión
      this.signal.addTransferChartDataListener();
    }catch(err){
      console.error(err);
    }

    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe((stream: MediaProvider | null) => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe((stream: MediaProvider | null) => this.remoteVideo.nativeElement.srcObject = stream)
  }

  public vnc(){
    setTimeout(()=>{
      this.videocall.connect('172.16.16.226');
    },1000);
  }

  public closevnc(){
    this.videocall.disconnect();
  }

  public endCall() {
    //this.callService.closeMediaCall();
    this.showButton = false;
    this.showCall = false;
    /*
    this.http.callIn.estado = 2;
    this.http.updateCall(this.http.callIn.id,this.http.callIn).subscribe(
      data => {
        console.log("EXITO")
      },
      error => {
        console.log("ERROR")
      }
    );
    */
    //this.CloseAccordion("collapseOne1");
    //this.ExpandAccordion("collapseOne2");
  }

  public update(Call:Call) {
    this.showButton = true;
    /*
    const user = this.local.getUser();
    Call.estado = 1;
    Call.userId = user.id;
    this.http.updateCall(Call.id, Call).subscribe(
      data => {
        console.log("EXITO")
      },
      error => {
        console.log("ERROR")
      }
    );
    */
    this.showCall = true;
    this.id = Call.cajeroId;
    //this.callService.establishMediaCall(Call.p2p);
    this.http.callIn = Call;
    //this.CloseAccordion("collapseOne2");
  }

  public CloseAccordion(id:string) {
    var myCollapse = document.getElementById(id);
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
    show: false
  });
  }

  public ExpandAccordion(id:string) {
    var myCollapse = document.getElementById(id);
    var bsCollapse = new bootstrap.Collapse(myCollapse, {
    show: true
  });
  }
}
