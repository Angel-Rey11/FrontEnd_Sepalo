import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { CallService } from 'src/app/services/call.service';
import { CallinfoDialogComponent, DialogData } from 'src/app/dialog/callinfo-dialog/callinfo-dialog.component';
import * as RFB from '@novnc/novnc/core/rfb';
import { RemoteComponent } from '../remote/remote';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {
  public isCallStarted$: Observable<boolean>;
  private peerId: string;

  @ViewChild('localVideo')
  localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo')
  remoteVideo!: ElementRef<HTMLVideoElement>;
  
  @ViewChild(RemoteComponent) videocall:RemoteComponent;

  constructor(public dialog: MatDialog, private callService: CallService) { 
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerId = this.callService.initPeer();
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  ngOnInit(): void {
    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe((stream: MediaProvider | null) => this.localVideo.nativeElement.srcObject = stream)
    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe((stream: MediaProvider | null) => this.remoteVideo.nativeElement.srcObject = stream)
  }

  public showModal(joinCall: boolean): void {
    if(!this.peerId){  alert("Error en la comunicación"); return;}
    let dialogData: DialogData = joinCall ? ({ peerId: undefined, joinCall: true }) : ({ peerId: this.peerId, joinCall: false });
    const dialogRef = this.dialog.open(CallinfoDialogComponent, {
      width: '250px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(
        switchMap(peerId => 
          joinCall ? of(this.callService.establishMediaCall(peerId)) : of(this.callService.enableCallAnswer())
        ),
      )
      .subscribe(_  => { });
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

}
