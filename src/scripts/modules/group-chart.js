import * as d3 from 'd3';

export default (function() {
  let config = {
    container: '.group-chart',
    tooltip: '.group-chart-tooltip',
    width: 960,
    height: 820,
    midX: 480
  };

  let voteTypes = [{
    key: 'yesVotes',
    description: 'voted in favor',
    color: '#0571b0',
    offsetX: config.midX + 5,
    reverse: false,
    showLabels: true
  }, {
    key: 'noVotes',
    description: 'voted against',
    color: '#ca0020',
    offsetX: config.midX - 65,
    reverse: true,
    showLabels: true
  }, {
    key: 'abstentions',
    description: 'abstained',
    color: '#a9a9a9',
    offsetX: config.midX - 45,
    reverse: false,
    showLabels: false
  }];

  let data = {};
  let groups = {};
  let chart = {};

  function init(_data, _config, _voteTypes) {
    data = _data;
    config = Object.assign(config, _config);
    voteTypes = _voteTypes || voteTypes;
    groups = Object.assign(
      Object.keys(data.votes.yesVotes),
      Object.keys(data.votes.noVotes),
      Object.keys(data.votes.abstentions)
    );

    render();
  }

  function render() {
    chart.$container = d3.select(config.container);
    chart.$tooltip = d3.select(config.tooltip);

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

    chart.$svg.append('line')
      .attr('x1', config.midX - 55)
      .attr('y1', 0)
      .attr('x2', config.midX - 55)
      .attr('y2', config.height)
      .attr('shape-rendering', 'crispEdges')
      .attr('stroke', 'black')
      .attr('stroke-width', '1');

    chart.$groups = chart.$svg.selectAll('g')
      .data(groups)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${(++i * 90) - 45})`)
      .each(function (group) {
        const $group = d3.select(this);

        $group.append('text')
          .attr('font-size', 16)
          .attr('x', config.midX - 50)
          .attr('y', -15)
          .text(group);

        chart.$groups = $group.selectAll('g')
          .data(voteTypes)
          .enter()
          .append('g')
          .each(function (voteType) {
            const $voteType = d3.select(this);
            const votes = data.votes[voteType.key];
            const chunkedVotes = chunkArray(votes[group], 4);
            const maxDots = Math.ceil(votes[group].length / 4);
            const modifier = voteType.reverse ? -1 : 1;

            chunkedVotes.forEach((votes, row) => {
              votes.forEach((vote, column) => {
                $voteType.append('circle')
                  .attr('r', 4.7)
                  .attr('cx', voteType.offsetX + (modifier * (column * 11)))
                  .attr('cy', row * 11)
                  .attr('fill', voteType.color);
              });
            });

            if (voteType.showLabels) {
              $voteType.append('text')
                .attr('font-size', 16)
                .attr('text-anchor', voteType.reverse ? 'end' : 'start')
                .attr('x', voteType.offsetX + (modifier * (maxDots * 11)) + (modifier * 5))
                .attr('y', 21)
                .attr('fill', voteType.color)
                .text(votes[group].length);
            }
          });
      });
  }

  // function showTooltip(d) {
  //   if (d.member) {
  //     const element = d3.select(this);
  //     const x = parseInt(element.attr('cx'));
  //     const offsetX = chart.xScale(x) - 150;
  //     const y = parseInt(element.attr('cy'));
  //     const offsetY = chart.yScale(y) - 110;

  //     element.attr('stroke', 'black');
  //     element.attr('stroke-width', 2);

  //     chart.$tooltip.html(() => {
  //       return `
  //         <img src="http://www.europarl.europa.eu/mepphoto/${d.member.id_mep}.jpg">
  //         <p>
  //           <strong>${d.member.name} ${d.member.surname}</strong>
  //           ${data.flags.filter(f => f.code.toLowerCase() == d.member.country_code)[0].emoji}
  //           ${d.member.name.length + d.member.surname.length < 18 ? '<br>' : '/ '}
  //           ${d.member.group_code}
  //         </p>
  //       `;
  //     });

  //     chart.$tooltip
  //       .style('display', 'block')
  //       .style(
  //         'border-bottom',
  //         `4px solid ${getGroupColor(d.member.group_code)}`
  //       )
  //       .style('left', `${offsetX}px`)
  //       .style('top', `${offsetY}px`);
  //   }
  // }

  // function hideTooltip(d) {
  //   if (d.member) {
  //     const element = d3.select(this);

  //     element.attr('stroke', 'none');
  //     chart.$tooltip.style('display', 'none');
  //   }
  // }

  // function getGroupColor(name) {
  //   const groupColors = {
  //     'PPE': '#003C78',
  //     'S&D': '#C80000',
  //     'ECR': '#0082FF',
  //     'ALDE': '#FFAA00',
  //     'Verts/ALE': '#009900',
  //     'GUE/NGL': '#460000',
  //     'EFDD': '#8B9FA0',
  //     'ENF': '#9B20A9',
  //     'NI': '#666666'
  //   };

  //   return groupColors[name] || '#a9a9a9';
  // }

  function chunkArray(arr, chunkCount) {
    const chunks = [];
    while(arr.length) {
      const chunkSize = Math.ceil(arr.length / chunkCount--);
      const chunk = arr.slice(0, chunkSize);
      chunks.push(chunk);
      arr = arr.slice(chunkSize);
    }
    return chunks;
  }

  return {
    init
  };
})();
