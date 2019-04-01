import * as d3 from 'd3';

import util from './util';
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
      const offsetY = chart.yScale(y) - 110;

      element.attr('stroke', 'black');
      element.attr('stroke-width', 2);

      chart.$tooltip.html(() => {
        return `
          <img src="http://www.europarl.europa.eu/mepphoto/${d.member.id_mep}.jpg">
          <p>
            <strong>${d.member.name} ${d.member.surname}</strong>
            ${flags.filter(f => f.code.toLowerCase() == d.member.country_code)[0].emoji}
            ${d.member.name.length + d.member.surname.length < 18 ? '<br>' : '/ '}
            ${d.member.group_code}
          </p>
        `;
      });

      chart.$tooltip
        .style('display', 'block')
        .style(
          'border-bottom',
          `4px solid ${util.groupColor(d.member.group_code)}`
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
