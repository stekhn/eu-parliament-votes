import '../styles/main.scss';

import hemicycle from './modules/hemicycle';

import members from '../data/members.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';
import flags from '../data/flags.json';

function init() {
  hemicycle.init({
    members,
    seats,
    votes,
    flags
  });
}

document.addEventListener('DOMContentLoaded', init, false);
