import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from 'src/app/services/call.service';
import { RemoteComponent } from '../remote/remote';
import { Call } from 'src/app/model/Call';
import { CallBDService } from 'src/app/services/call-bd.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;
  public Call:Call[];

  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;
  
  @ViewChild(RemoteComponent) videocall:RemoteComponent;

  constructor(public dialog: MatDialog, private callService: CallService, private readonly http:CallBDService, private readonly http2:UserService) { 
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  async ngOnInit(): Promise<void> {
    this.Call = await this.http.getAllCalls().toPromise();
    console.log(this.Call);
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
    this.callService.closeMediaCall();
  }

  public update(Call:Call) {
    //const id = Call.id;
    //Call.estado = 1;
    //this.http.updateCall(id, Call);
    //console.log(Call);
    this.callService.establishMediaCall(Call.p2p);
  }
}
