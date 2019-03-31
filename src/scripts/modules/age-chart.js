import * as d3 from 'd3';

export default (function() {
  let config = {
    container: '.age-chart',
    tooltip: '.age-chart-tooltip',
    width: 960,
    height: 640,
    midX: 480
  };

  let voteTypes = {
    'yes': {
      description: 'voted in favor',
      color: '#0571b0',
      offsetX: config.midX + 5,
      reverse: false,
      showLabels: true
    },
    'no': {
      description: 'voted against',
      color: '#ca0020',
      offsetX: config.midX - 65,
      reverse: true,
      showLabels: true
    },
    'abstained': {
      description: 'abstained',
      color: '#a9a9a9',
      offsetX: config.midX - 45,
      reverse: false,
      showLabels: false
    }
  };

  let data = {};
  let chart = {};

  function init(_data, _config) {
    data = d3.nest()
      .key(d => d.age.bin[0])
      .sortKeys(d3.ascending)
      .key(d => d.vote)
      .entries(_data.filter(d => d.member && d.vote));
    config = Object.assign(config, _config);

    console.log(data);

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
      .data(data)
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0, ${(++i * 90) - 45})`)

    chart.$groups.append('text')
      .attr('font-size', 16)
      .attr('x', config.midX - 50)
      .attr('y', -15)
      .text(d => d.key);

    chart.$groups.selectAll('g')
      .data(d => d.values)
      .enter()
      .append('g')
      .each(function (d) {
        const $voteType = d3.select(this);
        const voteType = voteTypes[d.key];
        const chunkedVotes = chunkArray(d.values, 4);
        const maxDots = Math.ceil(d.values.length / 4);
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
            .text(d.values.length);
        }
      });
  }

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
