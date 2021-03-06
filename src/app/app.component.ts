import { Component } from '@angular/core';
import * as QRCode from 'easyqrcodejs';
import domtoimage from 'dom-to-image';
// tslint:disable-next-line: prefer-const
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'qr-code-app';
  public qrcode: any = null;
  public fname = '';
  public gname = '';
  public lname = '';
  public position = '';
  public phone = '';
  public email = '';
  public url = 'intergreatme-qr.herokuapp.com';
  public notes = '';

  constructor(private http: HttpClient) {
  }
  generateQRCode(): void {

    let codeText = 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:';
    codeText += this.lname + ';' + this.fname + '\r\n';
    codeText += 'FN:' + this.fname + ' ' + this.lname + '\r\n';
    codeText += 'ORG:' + this.position + '\r\n';
    codeText += 'URL:' + this.url + '\r\n';
    codeText += 'EMAIL;WORK:' + this.email + '\r\n';
    codeText += 'TEL;WORK:' + this.phone + '\r\n';
    codeText += 'NOTE:' + 'Click the link above to make your own QR Code' + '\r\n';
    codeText += 'END:VCARD';
    codeText = decodeURIComponent(codeText);

    console.log(codeText);
    let imagesize = 150;
    if (screen.width < 480) { imagesize = 110; }
    console.log(imagesize);
    this.gname = this.fname.split(' ')[0];

    const config = {
      title: 'Logo',
      config: {
        text: codeText, // Content
        width: imagesize, // Widht
        height: imagesize, // Height
        colorDark: '#000000', // Dark color
        colorLight: '#ffffff', // Light color
        // === Logo
        logo: 'assets/logo.png', // LOGO
        logoBackgroundColor: '#ffffff', // Logo backgroud color, Invalid when `logBgTransparent` is true; default is '#ffffff'
        logoBackgroundTransparent: false, // Whether use transparent image, default is false
        correctLevel: QRCode.CorrectLevel.L // L, M, Q, H
      }
    };
    if (this.qrcode != null) { this.qrcode.clear(); }
    this.qrcode = new QRCode(document.getElementById('qrcode'), config.config);
 //   document.querySelector('#qrcode img').setAttribute('style', 'width: 120px');
   // document.querySelector('#qrcode img').clientWidth = 120;

    /*
    var mailchimp = new Mailchimp("19d84f3037d02061281b4602c0ad2d35-us4");

    mailchimp.post({
        path : '/lists/c21d6d86f2/members',
        body: {
            email_address : 'sddf7se@bsedf.com',
            status : 'subscribed',
            merge_fields: {
                'FNAME': "sdf",
                'LNAME': "sdfa",
                'PHONE': "234234234"
            }
          }
      }, function (err, result) {
        console.log(result);
      }) */
    this.http.post('/api',
    {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      phone: this.phone
    })
    .subscribe(
    data  => {
     console.log('POST Request is successful ', data);
    },
    error  => {
      console.log('Error', error);
    });
  }
  saveImage(): void {
    domtoimage.toPng(document.querySelector('.image-content'))
    .then((dataUrl: string) => {
        // tslint:disable-next-line: prefer-const
        let img = new Image();
        img.src = dataUrl;
        const link = document.createElement('a');
        link.download = 'qr-screen.png';
        link.href = dataUrl;
        link.click();
        link.remove();
    })
    .catch((error: any) => {
        console.error('oops, something went wrong!', error);
    });
  }
}
