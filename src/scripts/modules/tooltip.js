import * as d3 from 'd3';

import { group } from '../mapping';
import flags from '../../data/flags.json';

export default (function() {
 function show(self, d, chart) {
    if (d.member && d.vote) {
      const element = d3.select(self);
      // const x = parseInt(element.attr('cx'));
      const x = parseInt(d3.mouse(self)[0]);
      const offsetX = chart.xScale(x) - 150;
      // const y = parseInt(element.attr('cy'));
      const y = parseInt(d3.mouse(self)[1]);
      const offsetY = chart.yScale(y) - 105;

      element.attr('stroke', 'black');
      element.attr('stroke-width', 2);

      // Empty tooltip
      chart.$tooltip.html('');

      chart.$tooltip.append('img')
        .attr('src', `https://www.europarl.europa.eu/mepphoto/${d.member.id_mep}.jpg`)
        .on('load', function () {
          d3.select(this).classed('loaded', true)
        });

      chart.$tooltip.append('div')
        .text(flags.filter(f => f.code.toLowerCase() == d.member.country_code)[0].emoji)

      chart.$tooltip.append('p')
        .html(`<strong>${d.member.name} ${d.member.surname}</strong>, ${d.age.age},
          Group:&nbsp;${group(d.member.group_code).name}`)

      chart.$tooltip
        .style('display', 'block')
        .style(
          'border-bottom',
          `4px solid ${group(d.member.group_code).color}`
        )
        .style('left', `${offsetX}px`)
        .style('top', `${offsetY}px`);
    }
  }

  function hide(self, d, chart) {
    if (d.member && d.vote) {
      const element = d3.select(self);

      element.attr('stroke', 'none');
      chart.$tooltip.style('display', 'none');
    }
  }

  return {
    show,
    hide
  };
})();
