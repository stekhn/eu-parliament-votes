import * as d3 from 'd3';

export default (function() {
  let config = {
    selector: '.chart',
    width: 960,
    height: 500,
    margin: 50
  };

  let chart = {};

  function init(data, _config) {
    config = Object.assign(config, _config);
    render(data);
  }

  function render(data) {
    chart.$container = d3.select('.chart');
    chart.$tooltip = d3.select('.tooltip');
    chart.$tooltipStyle = d3.select('.tooltip-style');

    chart.$svg = chart.$container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${config.width} ${config.height}`);

    chart.$seats = chart.$svg
      .append('g')
      .selectAll('circle')
      .data(data.seats)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('fill', d => {
        d.member = data.members.filter(m => {
          return d.id === m.id_seat;
        })[0];
        // return member ? getColor(member.group_code) : '#dedede';

        if (d.member) {
          const votedYes = data.votes.yesVotes[d.member.group_code].includes(
            d.member.surname
          );
          const votedNo = data.votes.noVotes[d.member.group_code].includes(
            d.member.surname
          );
          const abstained = data.votes.abstentions[
            d.member.group_code
          ].includes(d.member.surname);
          if (votedYes) {
            return '#0571b0';
          }
          if (votedNo) {
            return '#ca0020';
          }
          if (abstained) {
            return '#a9a9a9';
          }
        }
        return '#dedede';
      })
      .on('mouseenter', updateTooltip)
      .on('mouseleave', () => {
        chart.$tooltip.style('display', 'none');
      });
  }

  function updateTooltip(d, self) {

    if(d.member) {
      const target = this || self;
      const left = parseInt(d3.select(target).attr('cx'));
      const top = parseInt(d3.select(target).attr('cy')) - 95;
      const leftPerc = (left / config.width) * 100;
      const leftOffsetPerc = leftPerc - ((200 / config.width) * 100 * left) / config.width;

      chart.$tooltip
        .transition()
        .duration(200)
        .style('opacity', 1);

      chart.$tooltip.html(() => {
        return `<p><strong>${d.member.name} ${d.member.surname}</strong>, ${d.member.group_code}, ${d.member.country_code.toUpperCase()}</p>`;
      });

      chart.$tooltip
        .style('display', 'block')
        .style('left', leftOffsetPerc + '%')
        .style('top', top + 'px');
    }
  }

  function getColor(name) {
    const groups = {
      PPE: '#003C78',
      'S&D': '#C80000',
      ECR: '#0082FF',
      ALDE: '#FFAA00',
      'Verts/ALE': '#32C800',
      'GUE/NGL': '#460000',
      EFDD: '#8B9FA0',
      ENF: '#9B20A9',
      NI: '#666666'
    };

    return groups[name] || '#dedede';
  }

  return {
    init
  };
})();
