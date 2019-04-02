import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';

import tooltip from './tooltip';
import map from '../mapping';

const defaults = {
  container: '.barchart',
  tooltip: '.barchart-tooltip',
  width: 960,
  height: 960,
  midX: 480
};

export default class Barchart {

  constructor(data, prepare, config) {
    this.data = prepare(data);
    this.config = Object.assign(defaults, config);
    this.chart = {};
    this.draw();
  }

  draw() {
    const { data, chart, config, createBars } = this;
    const classThis = this;

    chart.$container = select(config.container);
    chart.$tooltip = select(config.tooltip);

    chart.$svg = chart.$container
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${config.width} ${config.height}`);

    chart.bounds = chart.$container.node().getBoundingClientRect();

    chart.xScale = scaleLinear()
      .domain([0, config.width])
      .range([0, chart.bounds.width]);

    chart.yScale = scaleLinear()
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
      .text(d => d.key);

    chart.$groups.selectAll('g')
      .data(d => d.values)
      .enter()
      .append('g')
      .each(function (d) {
        createBars(d, classThis, this);
      });
  }

  createBars(d, classThis, elementThis) {
    const { chart, config, chunkArray } = classThis;

    const $voteType = select(elementThis);
    const voteType = map.voteType(d.key, config);
    const maxDots = Math.ceil(d.values.length / 4);
    const modifier = voteType.reverse ? -1 : 1;
    const index = select(elementThis.parentNode).attr('data-index');
    const offsetY = (index * 90) + 45;

    chunkArray(d.values, 4).forEach((votes, row) => {
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
  }

  chunkArray(arr, chunkCount) {
    const chunks = [];

    while (arr.length) {
      const chunkSize = Math.ceil(arr.length / chunkCount--);
      const chunk = arr.slice(0, chunkSize);
      chunks.push(chunk);
      arr = arr.slice(chunkSize);
    }

    return chunks;
  }
}
