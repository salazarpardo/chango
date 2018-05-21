
import { Template } from 'meteor/templating';

import './accounts-templates.html';

import fontawesome from '@fortawesome/fontawesome/';
import faFacebook from '@fortawesome/fontawesome-free-brands/faFacebook'

fontawesome.library.add(faFacebook)

// We identified the templates that need to be overridden by looking at the available templates
// here: https://github.com/meteor-useraccounts/unstyled/tree/master/lib
Template['override-atPwdFormBtn'].replaces('atPwdFormBtn');
Template['override-atPwdForm'].replaces('atPwdForm');
Template['override-atTextInput'].replaces('atTextInput');
Template['override-atTitle'].replaces('atTitle');
Template['override-atSocial'].replaces('atSocial');
Template['override-atError'].replaces('atError');
Template['override-atForm'].replaces('atForm');
Template['override-atSep'].replaces('atSep');
