import { select } from 'd3-selection';
import { pie, arc } from 'd3-shape';

import { vote } from '../mapping';

const defaults = {
  container: '.piechart'
};

export default class PieChart {
  constructor(data, config) {
    this.data = data;
    this.config = Object.assign({}, defaults, config);
    this.chart = {};
    this.draw(this);
  }

  draw() {
    const { data, chart, config } = this;

    chart.$container = select(config.container);
    chart.bounds = chart.$container.node().getBoundingClientRect();

    const voteTypes = ['yes', 'abstained', 'no'];
    const voteData = voteTypes.map(d => {
      return {
        key: d,
        value: data.reduce((acc, curr) => {
          return curr.vote === d ? ++acc : acc;
        }, 0)
      };
    });

    const radius = chart.bounds.width / 2;

    const pies = pie()
      .value(d => d.value)
      .sort(null)
      .startAngle(0.5 * Math.PI * -1)
      .endAngle(0.5 * Math.PI);

    const voteArc = arc()
      .outerRadius(radius)
      .innerRadius(radius / 1.1);

    const labelArc = arc()
      .outerRadius(radius / 1.1)
      .innerRadius(radius / 2);

    chart.$svg = chart.$container
      .append('svg')
      .attr('width', chart.bounds.width)
      .attr('height', chart.bounds.width / 2);

    chart.$groups = chart.$svg
      .append('g')
      .attr(
        'transform',
        `translate(${chart.bounds.width / 2}, ${chart.bounds.width / 2})`
      );

    chart.$segments = chart.$groups
      .selectAll('g')
      .data(pies(voteData))
      .enter();

    chart.$segments
      .append('path')
      .attr('fill', d => vote(d.data.key).color)
      .attr('d', voteArc);

    chart.$labels = chart.$segments.append('g').attr('transform', d => {
      let offsetX = 0;

      if (d.data.key === 'yes') {
        offsetX = -chart.bounds.width / 4;
      }

      if (d.data.key === 'no') {
        offsetX = chart.bounds.width / 4;
      }

      return `translate(${offsetX}, -30)`;
    });

    chart.$labels
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', 32)
      .attr('fill', d => vote(d.data.key).color)
      .text(d => d.value);

    chart.$labels
      .append('text')
      .attr('dy', '18')
      .attr('text-anchor', 'middle')
      .attr('font-size', 16)
      .attr('fill', d => vote(d.data.key).color)
      .text(d => vote(d.data.key).name.replace('voted ', ''));
  }

  resize() {
    this.chart.$container.html('');
    this.draw(this);
  }

  destroy() {
    this.chart.$container.html('')
  }
}
