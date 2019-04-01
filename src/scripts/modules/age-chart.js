import * as d3 from 'd3';

import tooltip from './tooltip';
import util from './util';

export default (function() {
  let config = {
    container: '.age-chart',
    tooltip: '.age-chart-tooltip',
    width: 960,
    height: 470,
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
      .attr('data-index', (d, i) => i);

    chart.$groups.append('text')
      .attr('font-size', 16)
      .attr('x', config.midX - 50)
      .attr('y', (d, i) => {
        const offsetY = (i * 90) + 45;
        return offsetY - 15;
      })
      .text(d => `${d.key} and older`);

    chart.$groups.selectAll('g')
      .data(d => d.values)
      .enter()
      .append('g')
      .each(function (d) {
        const $voteType = d3.select(this);
        const voteType = voteTypes[d.key];
        const chunkedVotes = util.chunkArray(d.values, 4);
        const maxDots = Math.ceil(d.values.length / 4);
        const modifier = voteType.reverse ? -1 : 1;
        const index = d3.select(this.parentNode).attr('data-index');
        const offsetY = (index * 90) + 45;

        chunkedVotes.forEach((votes, row) => {
          votes.forEach((vote, column) => {
            $voteType.append('circle')
              .attr('r', 4.7)
              .attr('cx', voteType.offsetX + (modifier * (column * 11)))
              .attr('cy', offsetY + (row * 11))
              .attr('fill', voteType.color)
              .on('mouseenter', function () {
                tooltip.show(this, vote, chart);
              })
              .on('mouseleave', function () {
                tooltip.hide(this, vote, chart);
              });
          });
        });

        if (voteType.showLabels) {
          $voteType.append('text')
            .attr('font-size', 16)
            .attr('text-anchor', voteType.reverse ? 'end' : 'start')
            .attr('x', voteType.offsetX + (modifier * (maxDots * 11)) + (modifier * 5))
            .attr('y', offsetY + 21)
            .attr('fill', voteType.color)
            .text(d.values.length);
        }
      });
  }

  return {
    init
  };
})();
