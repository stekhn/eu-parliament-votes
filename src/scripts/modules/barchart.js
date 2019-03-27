import * as d3 from 'd3';

export default (function() {
  let config = {
    container: '.barchart',
    tooltip: '.barchart-tooltip',
    width: 960,
    height: 500,
    margin: 50
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

    const groups = Object.assign(
      Object.keys(data.votes.yesVotes),
      Object.keys(data.votes.noVotes),
      Object.keys(data.votes.abstentions)
    );

    chart.$groups = chart.$svg.append('g')
      .selectAll('g')
      .data(groups)
      .enter()
      .append('g')
      .attr('data-group', d => d)
      .attr('transform', (d, i) => `translate(0, ${++i * 50})`)
      .each(function (d) {
        const $group = d3.select(this);
        const chunkedVotes = chunkArray(data.votes.yesVotes[d], 4);

        chunkedVotes.forEach((votes, row) => {
          votes.forEach((vote, column) => {
            $group.append('circle')
              .attr('r', 4.7)
              .attr('cx', (config.width / 2) + (column * 10))
              .attr('cy', row * 10)
              .attr('fill', '#0571b0');
          });
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
