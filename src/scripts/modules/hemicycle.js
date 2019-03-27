import * as d3 from 'd3';
import flags from '../../data/flags.json';

export default (function() {
  let config = {
    selector: '.chart',
    width: 960,
    height: 500,
    margin: 50
  };

  let chart = {};
  let data = {};

  function init(_data, _config) {
    config = Object.assign(config, _config);
    data = _data;
    render();
  }

  function render() {
    chart.$container = d3.select('.chart');
    chart.$tooltip = d3.select('.tooltip');
    chart.$tooltipStyle = d3.select('.tooltip-style');

    chart.$svg = chart.$container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${config.width} ${config.height}`);

    chart.bounds = chart.$container.node().getBoundingClientRect();

    chart.xScale = d3
      .scaleLinear()
      .domain([0, config.width])
      .range([0, chart.bounds.width]);

    chart.yScale = d3.scaleLinear()
      .domain([0, config.height])
      .range([0, chart.bounds.height]);

    chart.$seats = chart.$svg.append('g')
      .selectAll('circle')
      .data(data.seats)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 4.7)
      .attr('fill', getVoteColor)
      .attr('stroke', d => d.voted ? 'none' : '#a9a9a9')
      .attr('stroke-width', d => d.voted ? 0 : 1)
      .attr('stroke-alignment', 'inner') // Don't stop believin'
      .on('mouseenter', showTooltip)
      .on('mouseleave', hideTooltip);

    const yesCount = Object.keys(data.votes.yesVotes).reduce((prev, curr) => {
      return prev + data.votes.yesVotes[curr].length;
    }, 0);

    const noCount = Object.keys(data.votes.noVotes).reduce((prev, curr) => {
      return prev + data.votes.noVotes[curr].length;
    }, 0);

    const abstainedCount = Object.keys(data.votes.abstentions).reduce((prev, curr) => {
      return prev + data.votes.abstentions[curr].length;
    }, 0);

    chart.$voteCount = chart.$svg.append('g');

    chart.$yesCount = chart.$voteCount.append('g');
    chart.$yesCount.append('text')
      .attr('font-size', 60)
      .attr('dx', 30)
      .attr('dy', 90)
      .attr('fill', '#0571b0')
      .text(yesCount);

    chart.$yesCount
      .append('text')
      .attr('font-size', 16)
      .attr('dx', 30)
      .attr('dy', 110)
      .attr('fill', '#0571b0')
      .text('voted in favor');

    chart.$noCount = chart.$voteCount.append('g');
    chart.$noCount.append('text')
      .attr('font-size', 60)
      .attr('text-anchor', 'end')
      .attr('dx', config.width - 30)
      .attr('dy', 90)
      .attr('fill', '#ca0020')
      .text(noCount);

    chart.$noCount
      .append('text')
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .attr('dx', config.width - 30)
      .attr('dy', 110)
      .attr('fill', '#ca0020')
      .text('voted against');

    chart.$abstainedCount = chart.$voteCount.append('g');
    chart.$abstainedCount.append('text')
      .attr('font-size', 60)
      .attr('text-anchor', 'middle')
      .attr('dx', config.width / 2)
      .attr('dy', config.height - 40)
      .attr('fill', '#a9a9a9')
      .text(abstainedCount);

    chart.$abstainedCount
      .append('text')
      .attr('font-size', 15)
      .attr('text-anchor', 'middle')
      .attr('dx', config.width / 2)
      .attr('dy', config.height - 20)
      .attr('fill', '#a9a9a9')
      .text('abstained');
  }

  function showTooltip(d) {
    if (d.member) {
      const element = d3.select(this);
      const x = parseInt(element.attr('cx'));
      const offsetX = chart.xScale(x) - 150;
      const y = parseInt(element.attr('cy'));
      const offsetY = chart.yScale(y) - 110;

      element.attr('stroke', 'black');
      element.attr('stroke-width', 2);

      chart.$tooltip.html(() => {
        return `
          <img src="http://www.europarl.europa.eu/mepphoto/${d.member.id_mep}.jpg">
          <p>
            <strong>${d.member.name} ${d.member.surname}</strong>
            ${flags.filter(f => f.code.toLowerCase() == d.member.country_code)[0].emoji}
            ${d.member.name.length + d.member.surname.length < 18 ? '<br>' : '/ '}
            ${d.member.group_code}
          </p>
        `;
      });

      chart.$tooltip
        .style('display', 'block')
        .style(
          'border-bottom',
          `4px solid ${getGroupColor(d.member.group_code)}`
        )
        .style('left', `${offsetX}px`)
        .style('top', `${offsetY}px`);
    }
  }

  function hideTooltip(d) {
    if (d.member) {
      const element = d3.select(this);

      element.attr('stroke', 'none');
      chart.$tooltip.style('display', 'none');
    }
  }

  function getVoteColor(d) {
    d.member = data.members.filter(m => {
      return d.id === m.id_seat;
    })[0];

    if (d.member) {
      d.member.votedYes = data.votes.yesVotes[d.member.group_code]
        .includes(d.member.surname);
      d.member.votedNo = data.votes.noVotes[d.member.group_code]
        .includes(d.member.surname);
      d.member.abstained = data.votes.abstentions[d.member.group_code]
        .includes(d.member.surname);
      d.voted = d.member.votedYes || d.member.votedNo || d.member.abstained;

      if (d.member.votedYes) { return '#0571b0'; }
      if (d.member.votedNo) { return '#ca0020'; }
      if (d.member.abstained) { return '#a9a9a9'; }
    }
    return 'none';
  }

  function getGroupColor(name) {
    const groupColors = {
      'PPE': '#003C78',
      'S&D': '#C80000',
      'ECR': '#0082FF',
      'ALDE': '#FFAA00',
      'Verts/ALE': '#009900',
      'GUE/NGL': '#460000',
      'EFDD': '#8B9FA0',
      'ENF': '#9B20A9',
      'NI': '#666666'
    };

    return groupColors[name] || '#a9a9a9';
  }

  return {
    init
  };
})();
