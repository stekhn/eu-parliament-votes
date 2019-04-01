import '../styles/main.scss';

import * as d3 from 'd3';

import hemicycle from './modules/hemicycle';
import groupChart from './modules/group-chart';
import ageChart from './modules/age-chart';

import members from '../data/members-age.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';

const merged = merge();

function init() {
  hemicycle.init(merged);
  groupChart.init(merged);
  ageChart.init(merged);
}

function merge() {
  const [min, max] = d3.extent(members, d => calculateAge(d.birthday));
  const scale = d3.scaleLinear().domain([min, max + 1]);
  const bins = d3.histogram()
    .domain(scale.domain())
    .thresholds([28, 40, 50, 60, 70])(members);
    //.thresholds(scale.ticks(5))(members);

  return seats.map(d => {
    const seat = d;
    const member = members.filter(m => {
      return d.id === m.id_seat;
    })[0];

    return {
      seat,
      member,
      vote: getVote(member) || undefined,
      age: getAge(member, bins) || undefined
    };
  });
}

function getVote(member) {
  if (member) {
    const group = member.group_code;
    const votedYes = votes.yesVotes[group].includes(member.surname) ||
      votes.yesVotes[group].includes(`${member.surname} ${member.name}`);
    const votedNo = votes.noVotes[group].includes(member.surname) ||
      votes.noVotes[group].includes(`${member.surname} ${member.name}`);
    const abstained = votes.abstentions[group].includes(member.surname) ||
      votes.abstentions[group].includes(`${member.surname} ${member.name}`);

    if (votedYes) {
      return 'yes';
    } else if (votedNo) {
      return 'no';
    } else if (abstained) {
      return 'abstained';
    } else {
      return undefined;
    }
  }
}

function getAge(member, bins) {
  if (member) {
    const memberAge = calculateAge(member.birthday);
    const memberBin = [];

    bins.forEach(bin => {
      if (memberAge >= bin.x0 && memberAge < bin.x1) {
        memberBin.push(bin.x0, bin.x1);
      }
    });

    return {
      age: memberAge,
      bin: memberBin
    };
  }
}

function calculateAge(dateString) {
  const ageDiff = Date.now() - new Date(dateString).getTime();
  const ageDate = new Date(ageDiff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

document.addEventListener('DOMContentLoaded', init, false);
