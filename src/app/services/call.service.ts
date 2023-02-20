import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import Peer from "peerjs";
import * as peerjs from "peerjs";
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CallService {

    private peer: Peer;
    private mediaCall: peerjs.MediaConnection;
  
    private localStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public localStream$ = this.localStreamBs.asObservable();
    private remoteStreamBs: BehaviorSubject<MediaStream> = new BehaviorSubject(null);
    public remoteStream$ = this.remoteStreamBs.asObservable();

    private isCallStartedBs = new Subject<boolean>();
    public isCallStarted$ = this.isCallStartedBs.asObservable();

    private id;

    constructor(private snackBar: MatSnackBar) { }

    public initPeer(): string{
        console.log("INIT PEER")
        if (!this.peer || this.peer.disconnected) {
            const peerJsOptions: peerjs.PeerJSOption = {
                debug: 3,
                config: {
                    iceServers: [
                        {
                            urls: [
                                'stun:stun1.l.google.com:19302',
                                'stun:stun2.l.google.com:19302',
                            ],
                        }]
                }
            };
            try {
                this.id = uuidv4();
                this.peer = new Peer(this.id, peerJsOptions);
                return this.id;
            } catch (error) {
                console.error(error);
                return "";
            }
        }else{
            return this.id;
        }
    }

    public async establishMediaCall(remotePeerId: string,callback?) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            console.log(remotePeerId)
            console.log(this.peer)
            const connection = this.peer.connect(remotePeerId);
            connection.on('error', err => {
                console.error(err);
                this.snackBar.open('error', 'Close');
            });
            

            this.mediaCall = this.peer.call(remotePeerId, stream);
            if (!this.mediaCall) {
                let errorMessage = 'Unable to connect to remote peer';
                this.snackBar.open(errorMessage, 'Close');
                throw new Error(errorMessage);
            }
            this.localStreamBs.next(stream);
            this.isCallStartedBs.next(true);

            this.mediaCall.on('stream',
                (remoteStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
            this.mediaCall.on('error', err => {
                this.snackBar.open('error', 'Close');
                console.error(err);
                this.isCallStartedBs.next(false);
            });
            this.mediaCall.on('iceStateChanged',(e)=>{
                if(e=="disconnected"){
                    if(callback){
                        callback();
                    }
                }
            })
            this.mediaCall.on('close', () => this.onCallClose());
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
            this.isCallStartedBs.next(false);
        }
    }

    public async enableCallAnswer() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            this.localStreamBs.next(stream);
            this.peer.on('call', async (call) => {
    
                this.mediaCall = call;
                this.isCallStartedBs.next(true);
    
                this.mediaCall.answer(stream);
                this.mediaCall.on('stream', (remoteStream: MediaStream) => {
                    this.remoteStreamBs.next(remoteStream);
                });
                this.mediaCall.on('error', err => {
                    this.snackBar.open('error', 'Close');
                    this.isCallStartedBs.next(false);
                    console.error(err);
                });
                this.mediaCall.on('close', () => this.onCallClose());
            });            
        }
        catch (ex) {
            console.error(ex);
            this.snackBar.open(ex, 'Close');
            this.isCallStartedBs.next(false);            
        }
    }

    private onCallClose() {
        this.remoteStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.localStreamBs?.value.getTracks().forEach(track => {
            track.stop();
        });
        this.snackBar.open('Call Ended', 'Close');
    }

    public closeMediaCall() {
        this.mediaCall?.close();
        if (!this.mediaCall) {
            this.onCallClose()
        }
        this.isCallStartedBs.next(false);
    }

    public destroyPeer() {
        this.mediaCall?.close();
        this.peer?.disconnect();
        this.peer?.destroy();
    }
}
