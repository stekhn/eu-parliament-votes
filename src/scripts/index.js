import '../styles/main.scss';

import { nest } from 'd3-collection';
import { ascending, extent, histogram } from 'd3-array';
import { scaleLinear } from 'd3-scale';

import { group, age } from './mapping';
import HemiCycle from './modules/hemicycle';
import DotChart from './modules/dotchart';
import PieChart from './modules/piechart';
import BarChart from './modules/barchart';

import members from '../data/members.json';
import seats from '../data/seats.json';
import votes from '../data/votes.json';

const mergedData = mergeData();
const state = { isMobile: undefined }
const charts = [];

function init() {
  handleUpdate();

  let timeout;
  window.onresize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleUpdate();
    }, 200);
  };
}

function handleUpdate() {
  const lastState = Object.assign({}, state);
  state.isMobile = document.body.clientWidth < 680;
  const hasChanged = lastState.isMobile !== state.isMobile;

  charts.forEach(chart => {
    chart.resize();
  });

  if (hasChanged) {
    charts.forEach(chart => {
      chart.destroy();
    });
    charts.length = 0;

    drawCharts();
  }
}

function drawCharts() {
  const ParliamentChart = state.isMobile ? PieChart : HemiCycle;
  const BreakdownChart = state.isMobile ? BarChart : DotChart;

  const parliamentChart = new ParliamentChart(
    mergedData,
    {
      container: '.parliament',
      tooltip: '.parliament-tooltip',
      width: 960,
      height: 500
    }
  );
  charts.push(parliamentChart);

  const groupChart = new BreakdownChart(
    nest()
      .key(d => d.member.group_code)
      .key(d => d.vote)
      .entries(mergedData.filter(d => d.member && d.vote))
      .sort(sortByLength),
    key => [group(key).name, group(key).type],
    {
      container: '.group-chart',
      tooltip: '.group-chart-tooltip',
      width: 960,
      height: 820,
      midX: 480
    }
  );
  charts.push(groupChart);

  const ageChart = new BreakdownChart(
    nest()
      .key(d => d.age.bin[0])
      .sortKeys(ascending)
      .key(d => d.vote)
      .entries(mergedData.filter(d => d.member && d.vote)),
    key => [age(key).name],
    {
      container: '.age-chart',
      tooltip: '.age-chart-tooltip',
      width: 960,
      height: 470,
      midX: 480
    }
  );
  charts.push(ageChart);
}

function mergeData() {
  const [min, max] = extent(members, d => calculateAge(d.birthday));
  const scale = scaleLinear().domain([min, max + 1]);
  const bins = histogram()
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

function sortByLength(a, b) {
  const aLength = a.values.reduce((acc, cur) => {
    return acc + cur.values.length;
  }, 0);
  const bLength = b.values.reduce((acc, cur) => {
    return acc + cur.values.length;
  }, 0);

  return (aLength > bLength) ? -1 : ((bLength > aLength) ? 1 : 0);
}

document.addEventListener('DOMContentLoaded', init, false);
