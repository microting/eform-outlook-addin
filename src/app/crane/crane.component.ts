import {Component, OnInit, NgZone, AfterViewInit} from '@angular/core';
import {
  AdvEntitySelectableGroupEditModel,
  AdvEntitySelectableItemModel
} from '../common/models/advanced';
import {EntitySelectService} from '../common/services/advanced';
import {SiteNameDto} from '../common/models/dto';
import {SitesService} from '../common/services/advanced/sites.service';

declare const Office: any;

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css']
})
export class CraneComponent implements OnInit, AfterViewInit {


  selectedShip: AdvEntitySelectableItemModel;
  selectedQuay: AdvEntitySelectableItemModel;
  selectedCrane: AdvEntitySelectableItemModel;
  selectedSites: Array<SiteNameDto> = [];
  currentMessage: string;
  ships: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  quays: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  cranes: AdvEntitySelectableGroupEditModel = new AdvEntitySelectableGroupEditModel();
  sitesDto: Array<SiteNameDto> = [];
  parsedShipId: string;
  parsedQuayId: string;
  parsedCraneId: string;
  parsedSiteIds: Array<string> = [];
  spinnerStatus = false;

  constructor(private zone: NgZone,
              private entitySelectService: EntitySelectService,
              private sitesService: SitesService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.currentMessage = '';
    this.parsedShipId = '';
    this.parsedQuayId = '';
    this.parsedCraneId = '';
    this.loadShips();
    this.loadQuays();
    this.loadCranes();
    this.loadSites();
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
    console.log('loadShips called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5477', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.ships.advEntitySelectableItemModels = data.model.entityGroupItemLst;
        this.ships.advEntitySelectableItemModels.forEach(ship => {
          if (ship.microtingUUID == this.parsedShipId) {
            this.selectedShip = ship;
          }
        });
      }
    });
  }

  loadQuays() {
    console.log('loadQuays called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5482', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.quays.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadCranes() {
    console.log('loadSites called');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    // console.log('userIdentityToken is ' + userIdentityToken);
    this.entitySelectService.getEntitySelectableGroupOutlook('5487', userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.cranes.advEntitySelectableItemModels = data.model.entityGroupItemLst;
      }
    });
  }

  loadSites() {
    console.log('loadSites called!');
    const userIdentityToken = localStorage.getItem('userIdentityToken');
    const callerUrl = localStorage.getItem('callerUrl');
    this.sitesService.getAllSites(userIdentityToken, callerUrl).subscribe((data) => {
      if (data && data.success) {
        this.sitesDto = data.model;
        console.log('loadSites returned successfully!');
        for (const siteId of this.parsedSiteIds) {
          for (const siteDto of this.sitesDto) {
            if (siteDto.siteUId.toString() === siteId) {
              this.selectedSites.push(siteDto);
            }
          }
        }
      }
    });
  }

  onInsert(): void {

    let txt_subject;
    let txt_body;
    txt_subject = 'Kran';
    txt_body = 'Template# 1734 <br>';

    // water - ship
    txt_subject = txt_subject + ' - ' + this.selectedShip.name;
    txt_body = txt_body + 'F1# ' + this.selectedShip.microtingUUID + '<br>';

    // water - quay
    txt_subject = txt_subject + ' - ' + this.selectedQuay.name;
    txt_body = txt_body + 'F2# ' + this.selectedQuay.microtingUUID + '<br>';


    // water - quay
    txt_subject = txt_subject + ' - ' + this.selectedCrane.name;
    txt_body = txt_body + 'F3# ' + this.selectedCrane.microtingUUID + '<br>';

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
    txt_body = txt_body + 'F4# ' + txtVal;

    const item = Office.context.mailbox.item;

    if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
      item.subject.setAsync(txt_subject);
      item.body.setAsync(txt_body, {coercionType: Office.CoercionType.Html});
    }
  }

  parseBody(): void {
    console.log('parseWaterBody called!');

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
              } else if (textLine.startsWith('F3#')) {
                const optionValue = textLine.split('#')[1].trim();
                console.log('F3# is ' + optionValue);
                __this.parsedCraneId = optionValue;
                itemMode = true;
              } else if (textLine.startsWith('Sites#')) {
                itemMode = true;
                const optionValue = textLine.split('#')[1].trim();
                console.log('Sites# is ' + optionValue);
                const cworkers = optionValue.split(', ');
                for (const site of cworkers) {
                  console.log('The found site is ' + site);
                  __this.parsedSiteIds.push(site);
                }
                itemMode = true;
              } else if (textLine.startsWith('F4#')) {
                stringText = textLine.replace('F4# ', '') + '\n';
                console.log('F4# is ' + stringText);

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
  }
}
