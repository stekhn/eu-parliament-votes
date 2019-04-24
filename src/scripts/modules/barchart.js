import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft } from 'd3-axis';

import { vote } from '../mapping';

const defaults = {
  container: '.barchart',
  tooltip: '.barchart-tooltip',
  barHeight: 35
};

export default class BarChart {
  constructor(data, mapping, config) {
    this.data = data;
    this.mapping = mapping;
    this.config = Object.assign(defaults, config);
    this.chart = {};
    this.draw(this);

    window.addEventListener('resize', () => {
      this.chart.$container.html('');
      this.draw(this);
    });
  }

  draw() {
    const { data, mapping, chart, config } = this;

    config.height = data.length * config.barHeight * 3;

    chart.$container = select(config.container);
    chart.$tooltip = select(config.tooltip);

    chart.bounds = chart.$container.node().getBoundingClientRect();

    chart.$svg = chart.$container
      .append('svg')
      .attr('width', chart.bounds.width)
      .attr('height', config.height)
      .attr('viewBox', `0 0 ${chart.bounds.width} ${config.height}`);

    chart.xScale = scaleLinear()
      .domain([0, max(data, d => max(d.values, c => c.values.length))])
      .range([0, chart.bounds.width]);

    chart.groupScale = scaleBand()
      .domain(data.map(d => d.key))
      .rangeRound([0, config.height])
      .paddingInner(0.4)
      .paddingOuter(0.3);

    chart.groupAxis = axisLeft(chart.groupScale)
      .tickValues([])
      .tickSize(0)
      .tickPadding(10);

    chart.voteScale = scaleBand()
      .domain(['yes', 'no', 'abstained'])
      .rangeRound([0, chart.groupScale.bandwidth()])
      .paddingInner(0.05);

    chart.$groups = chart.$svg
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0, ${chart.groupScale(d.key)})`);

    chart.$groups.append('text')
      .selectAll('tspan')
      .data(d => mapping(d.key))
      .enter()
      .append('tspan')
      .attr('dx', 3)
      .attr('dy', (d, i) => i > 0 ? -1 : -5)
      .attr('fill', (d, i) => i > 0 ? '#666' : 'black')
      .attr('font-size', (d, i) => i > 0 ? 12 : 16)
      .text(d => d);

    chart.$bars = chart.$groups
      .selectAll('rect')
      .data(d => d.values)
      .enter();

    chart.$bars
      .append('rect')
      .attr('y', d => chart.voteScale(d.key))
      .attr('width', d => chart.xScale(d.values.length))
      .attr('height', chart.voteScale.bandwidth())
      .attr('fill', d => vote(d.key).color);

    chart.$bars
      .append('text')
      .attr('y', d => chart.voteScale(d.key))
      .attr('dy', 15)
      .attr('dx', d =>
        d.values.length > 5 ? chart.xScale(d.values.length) - 3 : chart.xScale(d.values.length) + 12
      )
      .attr('fill', d => (d.values.length > 5 ? 'white' : 'black'))
      .attr('text-anchor', 'end')
      .text(d => d.values.length);

    chart.$axis = chart.$svg
      .append('g')
      .call(chart.groupAxis);
  }
}
