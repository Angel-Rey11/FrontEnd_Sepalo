import { Component, OnInit, ViewChild } from '@angular/core';
import * as RFB from '@novnc/novnc/core/rfb';

@Component({
  selector: 'app-remote',
  templateUrl: './remote.html',
  styleUrls: ['./remote.css']
})
export class RemoteComponent implements OnInit {
  @ViewChild('windowVNC') window;
  private vnc:any
  private port = "5900";
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

  public connect(ip,username,password){
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
    this.target=this.window.nativeElement;

    this.vnc = new RFB.default(this.target, this.url, {
      credentials: { password: password,username: username,target:this.target },
    });
  }
  public disconnect(){
    this.vnc.disconnect();
  }

}
