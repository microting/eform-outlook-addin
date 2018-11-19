import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import { TemplateDto } from '../common/models/dto';
import {TemplateListModel} from '../common/models/eforms/template-list.model';
import { NgSelectConfig } from '@ng-select/ng-select';

declare const Office: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, AfterViewInit {

  eForms: TemplateListModel;
  state: TemplateDto;
  spinnerStatus = false;

  constructor(private zone: NgZone, private config: NgSelectConfig) { }

  ngOnInit() {
    this.eForms = new TemplateListModel();
    this.geteForms();
    this.parseBody();
  }

  ngAfterViewInit() {
    this.zone.run(() => {
      this.getAuthToken();
    });
  }

  geteForms(): void {
    let eform = new TemplateDto();
    eform.label = 'Kran';
    eform.id = 60;
    this.eForms.templates = [eform];

    eform = new TemplateDto();
    eform.label = 'Vand';
    eform.id = 62;
    this.eForms.templates = [...this.eForms.templates, eform];

    this.state = this.eForms.templates[0];
    // console.log(JSON.stringify(this.state));
  }

  getAuthToken() {
    console.log('getAuthToken called');
    Office.context.mailbox.getUserIdentityTokenAsync(function(result) {
      console.log('this.window.location.hostname is : ' + window.location.hostname);
      localStorage.setItem('callerUrl', 'https://' + window.location.hostname + '/');
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log('success result for getting new token : ' + result.value);
        localStorage.setItem('userIdentityToken', result.value);
        // this.userIdentityToken = result.value;
      } else {
        console.log('Error on trying to get new token, error was : ' + result.error.message);
      }
    });
  }

  parseBody(): void {
    this.spinnerStatus = true;
    this.zone.run(() => {
      const item = Office.context.mailbox.item;
      if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
        const __this = this;
        item.body.getAsync(Office.CoercionType.Text, function (result) {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            const txtVal: string = result.value;
            console.log('We have a result back. Result is : ' + txtVal);
            const textLines = txtVal.split('\n');
            let newLine = false;
            console.log('Looping through lines...');
            for (let i = 0; i < textLines.length; i++) {
              const textLine = textLines[i];
              console.log('Line : ' + i.toString() + ' contains : ' + textLine);
              if (newLine === false && textLine.length === 0) {
                continue;
              } else {
                newLine = true;
              }
              if (textLine.startsWith('Template#')) {
                const optionValue = textLine.split('#')[1].trim();
                console.log('Template# is ' + optionValue);
                for (const eform of __this.eForms.templates ) {
                  if (eform.id.toString() === optionValue) {
                    console.log('selected eform is ' + JSON.stringify(eform));
                    __this.eForms.templates = [eform];
                  }
                }
              }
            }
          }
          __this.state = new TemplateDto();
          __this.state.id = __this.eForms.templates[0].id;
          __this.state.label = __this.eForms.templates[0].label;
        });
      }
    });
    // this.state =this.eForms.templates[0]; //test purpose
    this.spinnerStatus = false;
  }
}
