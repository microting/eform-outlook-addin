import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import { TemplateDto } from '../common/models/dto';
import {TemplateListModel} from '../common/models/eforms/template-list.model';
import { NgSelectConfig } from '@ng-select/ng-select';
import { IdentityService } from '../common/services/advanced/identity.service';

declare const Office: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  eForms: TemplateListModel;
  state: TemplateDto;
  spinnerStatus = false;

  disabled: boolean

  constructor(private zone: NgZone, private config: NgSelectConfig, private idService: IdentityService ) { }

  ngOnInit() {
    this.eForms = new TemplateListModel();
    this.zone.run(() => {
      this.disabled = true
      this.geteForms();
      this.parseBody();
      this.idService.readIdentity();
    })
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
