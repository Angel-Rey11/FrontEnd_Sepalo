import { Component, OnInit, ViewChild } from '@angular/core';
import * as RFB from '@novnc/novnc/core/rfb';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {
  @ViewChild('windowVNC') window;
  private vnc:any
  private host = "172.16.16.119";  //test
  private port = "5900";
  private username = ''; //username of vnc
  private password = "password"; // password of your vnc server
  private target;
  private path = "";
  public connected = false;
  private url:any;
  ngOnInit(): void {
    // Read parameters specified in the URL query string
    // By default, use the host and port of server that served this file
    
    // Build the websocket URL used to connect
    //this.url = "ws";

   

    
  }

  public connect(ip){
    
    if (window.location.protocol === "https:") {
      this.url = "wss";
    } else {
      this.url = "ws";
    }
    

    this.url += "://" + ip;
    if (this.port) {
      this.url += ":" + this.port;
    }
    this.url += "/" + this.path;

    console.log("URL: ", this.url);
    this.connected = true;
    this.target=this.window.nativeElement;
    console.log(this.target)
    this.vnc = new RFB.default(this.target, this.url, {
      credentials: { password: this.password,username: this.username,target:this.target },
    });
  }
  public disconnect(){
    this.vnc.disconnect();
    this.connected = false;
  }

}
