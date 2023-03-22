/* import the fontawesome core */
import { library, dom, config } from "@fortawesome/fontawesome-svg-core";

config.autoReplaceSvg = "nest";

import {
  far,
  faLightbulb,
  faUserCircle,
  faBell,
  faThumbsUp,
  faMessage,
  faCalendarAlt,
  faEdit,
} from "@fortawesome/free-regular-svg-icons";

import {
  fas,
  faEnvelope,
  faSignOutAlt,
  faThumbsUp as faThumbsUpSolid,
  faBell as faBellSolid,
  faTimes,
  faCheck,
  faSpinner,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";

import {
  fab,
  faFacebook,
  faGoogle,
  faTwitter,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  fas,
  far,
  fab,
  faLightbulb,
  faUserCircle,
  faBell,
  faThumbsUp,
  faMessage,
  faCalendarAlt,
  faEdit,
  faEnvelope,
  faSignOutAlt,
  faThumbsUpSolid,
  faBellSolid,
  faTimes,
  faCheck,
  faSpinner,
  faLocationArrow,
  faFacebook,
  faGoogle,
  faTwitter,
  faLinkedin,
  faWhatsapp
);

// Replace any existing <i> tags with <svg> and set up a MutationObserver to
// continue doing this as the DOM changes.

window.addEventListener("DOMContentLoaded", () => {
  dom.i2svg();
  dom.watch();
});
