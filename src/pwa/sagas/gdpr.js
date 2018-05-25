/* eslint-disable no-console */
import { call, select } from 'redux-saga/effects';
import { dep } from 'worona-deps';

export default function* gdprSagas() {
  const getSetting = dep('settings', 'selectorCreators', 'getSetting');
  const gdprSettings = (yield select(getSetting('theme', 'gdpr'))) || {};

  if (!gdprSettings.pwa) return;

  window.cmpLang = {
    // en: {
    //   footerTitle: 'Your privacy is important to us',
    //   footerLogoUrl: '',
    //   footerDescription:
    //     'We and our partners use cookies to personalize your content and create more valuable experiences for you. We may collect non-sensitive information about your usage. You can consent to the use of this technology or manage your settings to fully control what information is being collected and processed. For more information on our data policies, please visit our Privacy Statement.',
    //   footerManageBtnText: 'Manage my choices',
    //   footerAcceptAllBtnText: 'Accept',
    //   modalTitle: 'Your privacy is important to us',
    //   modalDescription:
    //     'We and our partners use cookies to personalize your content and create more valuable experiences for you. We may collect non-sensitive information about your usage. You can consent to the use of this technology or manage your settings to fully control what information is being collected and processed. For more information on our data policies, please visit our Privacy Statement.',
    //   modalPurposeTitle: 'You authorize',
    //   modalVendorTitle: 'For the following partners',
    //   modalSaveBtnText: 'Save',
    //   modalAcceptAllBtnText: 'Accept all',
    //   modalRejectAllBtnText: 'Reject all',
    // },
    en: {
      footerTitle: 'Política de privacidad',
      footerLogoUrl: '',
      footerDescription:
      `Utilizamos cookies para personalizar el contenido, características y anuncios.
        Compartimos información sobre el uso de nuestro sitio con nuestros socios, que pueden
        combinarla con otros datos aportados en sus servicios. `,
      footerManageBtnText: 'Opciones',
      footerAcceptAllBtnText: 'Aceptar',
      modalTitle: 'Política de privacidad',
      modalDescription:
      `Utilizamos cookies para personalizar el contenido, características y anuncios.
        Compartimos información sobre el uso de nuestro sitio con nuestros socios, que pueden
        combinarla con otros datos aportados en sus servicios. `,
      modalPurposeTitle: 'Tú autorizas',
      modalVendorTitle: 'para los siguientes socios',
      modalSaveBtnText: 'Guardar',
      modalAcceptAllBtnText: 'Aceptar todos',
      modalRejectAllBtnText: 'Rechazar todos',
    },
  };

  const gdprStub = window.document.createElement('script');
  gdprStub.src = '//cmp.smartadserver.mgr.consensu.org/stub.js';
  gdprStub.async = 'async';
  window.document.head.appendChild(gdprStub);

  yield call(() => new Promise(resolve => gdprStub.addEventListener('load', resolve)));

  const gdprCmp = window.document.createElement('script');
  gdprCmp.src = '//cmp.smartadserver.mgr.consensu.org/cmp.js';
  gdprCmp.async = 'async';
  window.document.head.appendChild(gdprCmp);
}