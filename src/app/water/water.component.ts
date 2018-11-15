import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import {EntitySelectService} from '../common/services/advanced';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel
} from '../common/models/advanced';
import {SitesService} from '../common/services/advanced/sites.service';
import {SiteNameDto} from '../common/models/dto';

declare const Office: any;

@Component({
  selector: 'app-water',
  templateUrl: './water.component.html',
  styleUrls: ['./water.component.css']
})

export class WaterComponent implements OnInit, AfterViewInit {

  selectedShip: AdvEntitySelectableItemModel;
  selectedQuay: AdvEntitySelectableItemModel;
  selectedSites: Array<SiteNameDto> = [];
  currentMessage: string;
  ships: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  quays: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  sitesDto: Array<SiteNameDto> = [];
  parsedShipId: string;
  parsedQuayId: string;
  parsedSiteIds: Array<number> = [];
  spinnerStatus = false;

  constructor(private zone: NgZone,
              private entitySelectService: EntitySelectService,
              private sitesService: SitesService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.currentMessage = '';
    this.parsedShipId = '';
    this.parsedQuayId = '';
    this.loadSites();
    this.loadQuays();
    this.loadShips();
    this.parseBody();
  }

  onSites(site: SiteNameDto) {
    if (!this.selectedSites.includes(site)) {
      this.selectedSites.push(site);
    } else {
      this.selectedSites.splice(this.selectedSites.indexOf(site), 1);
    }
    console.log('selectedSites now contains ' + JSON.stringify(this.selectedSites));
  }

  loadShips() {
    this.spinnerStatus = true;
    console.log('loadShips called!');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    this.entitySelectService.getEntitySelectableGroupOutlook('5477', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.ships.advEntitySelectableItemModels = data.model.entityGroupItemLst;
        console.log('loadShips returned successfully!');
        this.spinnerStatus = false;
      } else {
      }
    });
  }

  loadQuays() {
    this.spinnerStatus = true;
    console.log('loadQuays called!');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.quays.advEntitySelectableItemModels = data.model.entityGroupItemLst;
        console.log('loadQuays returned successfully!');
        this.spinnerStatus = false;
      }
    });
  }

  loadSites() {
    this.spinnerStatus = true;
    console.log('loadSites called!');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    this.sitesService.getAllSites(userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.sitesDto = data.model;
        console.log('loadSites returned successfully!');
        this.spinnerStatus = false;
        // for (const siteId of this.parsedSiteIds) {
        //   for (const siteDto of this.sitesDto) {
        //     if (siteDto.siteUId === siteId) {
        //       this.selectedSites.push(siteDto);
        //     }
        //   }
        // }
      }
    });
  }

  onInsert(): void {

    let txt_subject;
    let txt_body;
    txt_subject = 'Vand';
    txt_body = 'Template# 1200 <br>';

    // water - ship
    txt_subject = txt_subject + ' - ' + this.selectedShip.name;
    txt_body = txt_body + 'F1# ' + this.selectedShip.microtingUUID + '<br>';

    // water - quay
    txt_subject = txt_subject + ' - ' + this.selectedQuay.name;
    txt_body = txt_body + 'F2# ' + this.selectedQuay.microtingUUID + '<br>';

    // water - waters
    const cworkerids = [];
    const cworkervalues = [];
    for (const site of this.selectedSites) {
      cworkerids.push(site.siteUId);
      cworkervalues.push(site.siteName);
    }
    txt_subject = txt_subject + ' - ' + cworkervalues.join(', ');
    txt_body = txt_body + 'Sites# ' + cworkerids.join(', ') + '<br>';


    // water - message
    let txtVal = this.currentMessage;
    txtVal = txtVal.replace(/\r/g, '<br>');
    txtVal = txtVal.replace(/\n/g, '<br>');
    txt_body = txt_body + 'F3# ' + txtVal;

    const item = Office.context.mailbox.item;

    if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
      item.subject.setAsync(txt_subject);
      item.body.setAsync(txt_body, {coercionType: Office.CoercionType.Html});
    }
  }

  parseBody(): void {
    console.log('parseWaterBody called!');

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
            let stringText = '';
            let itemMode = false;
            let newLine = false;
            console.log('Looping through lines...');
            for (let i = 0; i < textLines.length; i++) {
              const textLine = textLines[i];
              console.log('Line : ' + i.toString() + ' contains : ' + textLine);
              itemMode = false;
              if (newLine === false && textLine.length === 0) {
                continue;
              } else {
                newLine = true;
              }
              if ( textLine.startsWith( 'Template#' ) ) {
                  itemMode = true;
              } else if (textLine.startsWith('F1#')) {
                const optionValue = textLine.split('#')[1].trim();
                console.log('F1# is ' + optionValue);
                __this.parsedShipId = optionValue;
                    itemMode = true;
              } else if (textLine.startsWith('F2#')) {
                const optionValue = textLine.split('#')[1].trim();
                console.log('F2# is ' + optionValue);
                __this.parsedQuayId = optionValue;
                    itemMode = true;
              } else if (textLine.startsWith('Sites#')) {
                itemMode = true;
                const optionValue = textLine.split('#')[1].trim();
                console.log('Sites# is ' + optionValue);
                const cworkers = optionValue.split(', ');
                for (const site of cworkers) {
                  console.log('The found site is ' + site);
                  __this.parsedSiteIds.push(parseInt(site, 10));
                }
                    itemMode = true;
              } else if (textLine.startsWith('F3#')) {
                stringText = textLine.replace('F3# ', '') + '\n';
                console.log('F3# is ' + stringText);

                itemMode = true;
              } else {
                if (stringText.length > 0) {
                  itemMode = true;
                }
                stringText = stringText + textLine + '\n';
              }

              if (itemMode === false) {
                break;
              }
            }

            __this.currentMessage = stringText;
          }
        });
      }
    });

    this.spinnerStatus = false;
  }
}
