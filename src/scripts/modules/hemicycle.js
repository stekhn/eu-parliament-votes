import * as d3 from 'd3';

import tooltip from './tooltip';
import map from '../mapping';

export default (function() {
  let config = {
    container: '.hemicycle',
    tooltip: '.hemicycle-tooltip',
    width: 960,
    height: 500
  };

  let chart = {};
  let data = {};

  function init(_data, _config) {
    config = Object.assign(config, _config);
    data = _data;

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

    chart.$seats = chart.$svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => d.seat.x)
      .attr('cy', d => d.seat.y)
      .attr('r', 4.7)
      .attr('fill', d => map.voteColor(d.vote))
      .attr('stroke', d => d.vote ? 'none' : '#a9a9a9')
      .attr('stroke-width', d => d.vote ? 0 : 1)
      .attr('stroke-alignment', 'inner') // Don't stop believin'
      .on('mouseenter', function (d) {
        tooltip.show(this, d, chart);
      })
      .on('mouseleave', function (d) {
        tooltip.hide(this, d, chart);
      });

    chart.$voteCount = chart.$svg.append('g');

    chart.$yesCount = chart.$voteCount.append('g');
    chart.$yesCount.append('text')
      .attr('font-size', 60)
      .attr('text-anchor', 'end')
      .attr('x', config.width - 30)
      .attr('y', 90)
      .attr('fill', map.voteColor('yes'))
      .text(data.reduce((acc, curr) => {
        return (curr.vote === 'yes') ? ++acc : acc;
      }, 0));

    chart.$yesCount
      .append('text')
      .attr('font-size', 16)
      .attr('text-anchor', 'end')
      .attr('x', config.width - 30)
      .attr('y', 110)
      .attr('fill', map.voteColor('yes'))
      .text('voted in favor');

    chart.$noCount = chart.$voteCount.append('g');
    chart.$noCount.append('text')
      .attr('font-size', 60)
      .attr('x', 30)
      .attr('y', 90)
      .attr('fill', map.voteColor('no'))
      .text(data.reduce((acc, curr) => {
        return (curr.vote === 'no') ? ++acc : acc;
      }, 0));

    chart.$noCount
      .append('text')
      .attr('font-size', 16)
      .attr('x', 30)
      .attr('y', 110)
      .attr('fill', map.voteColor('no'))
      .text('voted against');

    chart.$abstainedCount = chart.$voteCount.append('g');
    chart.$abstainedCount.append('text')
      .attr('font-size', 60)
      .attr('text-anchor', 'middle')
      .attr('x', config.width / 2)
      .attr('y', config.height - 40)
      .attr('fill', map.voteColor('abstained'))
      .text(data.reduce((acc, curr) => {
        return (curr.vote === 'abstained') ? ++acc : acc;
      }, 0));

    chart.$abstainedCount
      .append('text')
      .attr('font-size', 15)
      .attr('text-anchor', 'middle')
      .attr('x', config.width / 2)
      .attr('y', config.height - 20)
      .attr('fill', map.voteColor('abstained'))
      .text('abstained');
  }

  return {
    init
  };
})();
