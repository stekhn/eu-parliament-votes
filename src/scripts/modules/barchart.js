import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { axisLeft } from 'd3-axis';

import { vote } from '../mapping';

const defaults = {
  container: '.barchart',
  tooltip: '.barchart-tooltip',
  width: 960,
  height: 960,
  offsetX: 100,
  barHeight: 30
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
      .range([0, chart.bounds.width - config.offsetX]);

    chart.groupScale = scaleBand()
      .domain(data.map(d => d.key))
      .rangeRound([0, config.height])
      .padding(0.3);

    chart.groupAxis = axisLeft(chart.groupScale)
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

    chart.$bars = chart.$groups
      .selectAll('rect')
      .data(d => d.values)
      .enter();

    chart.$bars
      .append('rect')
      .attr('x', config.offsetX)
      .attr('y', d => chart.voteScale(d.key))
      .attr('width', d => chart.xScale(d.values.length))
      .attr('height', chart.voteScale.bandwidth())
      .attr('fill', d => vote(d.key).color);

    chart.$bars
      .append('text')
      .attr('x', config.offsetX)
      .attr('y', d => chart.voteScale(d.key))
      .attr('dy', 15)
      .attr('dx', d =>
        d.values.length > 6 ? 3 : chart.xScale(d.values.length) + 3
      )
      .attr('fill', d => (d.values.length > 6 ? 'white' : 'black'))
      .text(d => d.values.length);

    chart.$axis = chart.$svg
      .append('g')
      .attr('transform', `translate(${config.offsetX}, 0)`)
      .call(chart.groupAxis);

    chart.$axis
      .selectAll('text')
      .attr('font-size', 16)
      .text(d => mapping(d)[0]);
  }

  resize(instance) {
    const { chart } = instance;

    // chart.bounds = chart.$container.node().getBoundingClientRect();
    // chart.xScale.range([0, chart.bounds.width]);
    // chart.voteScale.range([0, chart.bounds.height]);
  }
}
