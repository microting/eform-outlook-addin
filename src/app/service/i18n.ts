export const i18n = {
  en: {
    eform: {
      label_eform: 'eForm',
      label_select_crane: 'Crane',
      label_select_water: 'Water'
    },
    crane: {
      label_edit: 'Edit',
      label_refresh: 'Refresh',
      label_ship: 'Ship',
      label_quay: 'Quay',
      label_crane: 'Crane',
      label_workers: 'Workers',
      label_message: 'Message to Workers'
    },
    water: {
      label_edit: 'Edit',
      label_refresh: 'Refresh',
      label_ship: 'Ship',
      label_quay: 'Quay',
      label_workers: 'Workers',
      label_message: 'Message to Workers'
    }
  },
  getTexts: function(locale: string) {
    if ( locale.toLowerCase().includes('da') ) {
      return i18n.en
    } else {
      return i18n.en
    }
  }
}