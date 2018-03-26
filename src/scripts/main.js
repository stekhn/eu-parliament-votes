import '../styles/main.scss';

import chart from './modules/chart';

import members from '../data/members.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';

function init() {
  chart.init({
    members,
    seats,
    votes
  });
}

document.addEventListener('DOMContentLoaded', init, false);
