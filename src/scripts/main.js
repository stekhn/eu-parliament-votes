import '../styles/main.scss';

import hemicycle from './modules/hemicycle';
import groupChart from './modules/group-chart';
// import ageChart from './modules/age-chart';

import members from '../data/members-age.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';
import flags from '../data/flags.json';

const merged = merge();

function init() {
  hemicycle.init({
    merged,
    flags
  });

  groupChart.init(merged);

  // ageChart.init({
  //   members,
  //   votes
  // });
}

function merge() {
  return seats.map(d => {
    const seat = d;
    const member = members.filter(m => {
      return d.id === m.id_seat;
    })[0];
    let vote = undefined;

    if (member) {
      const group = member.group_code;
      const votedYes = votes.yesVotes[group].includes(member.surname) ||
        votes.yesVotes[group].includes(`${member.surname} ${member.name}`);
      const votedNo = votes.noVotes[group].includes(member.surname) ||
        votes.noVotes[group].includes(`${member.surname} ${member.name}`);
      const abstained = votes.abstentions[group].includes(member.surname) ||
        votes.abstentions[group].includes(`${member.surname} ${member.name}`);

      if (votedYes) {
        vote = 'yes';
      } else if (votedNo) {
        vote = 'no';
      } else if (abstained) {
        vote = 'abstained';
      }
    }

    return { seat, member, vote };
  });
}

document.addEventListener('DOMContentLoaded', init, false);
