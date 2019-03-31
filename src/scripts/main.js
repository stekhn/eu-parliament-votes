import '../styles/main.scss';

import hemicycle from './modules/hemicycle';
import groupChart from './modules/group-chart';
// import ageChart from './modules/age-chart';

import members from '../data/members-age.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';
import flags from '../data/flags.json';

const merged = merge();

console.log(merged);

function init() {
  hemicycle.init({
    merged,
    flags
  });

  groupChart.init({
    members,
    votes
  });

  // ageChart.init({
  //   members,
  //   votes
  // });
}

function merge() {
  return seats.map(d => {
    d.member = members.filter(m => {
      return d.id === m.id_seat;
    })[0];

    if (d.member) {
      const group = d.member.group_code;

      if (votes.yesVotes[group]
        .includes(d.member.surname)) {
          d.vote = 'yes';
      } else if (votes.noVotes[group]
        .includes(d.member.surname)) {
          d.vote = 'no';
      } else if (votes.abstentions[group]
        .includes(d.member.surname)) {
          d.vote = 'abstained';
      } else {
        d.vote = false;
      }
    }

    return d;
  });
}

document.addEventListener('DOMContentLoaded', init, false);
