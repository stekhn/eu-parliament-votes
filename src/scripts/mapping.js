export function vote(key, config = { midX: 0 }) {
  const vote = {
    'yes': {
      name: 'voted in favor',
      color: '#0571b0',
      offsetX: config.midX + 5,
      reverse: false,
      showLabels: true
    },
    'no': {
      name: 'voted against',
      color: '#ca0020',
      offsetX: config.midX - 66,
      reverse: true,
      showLabels: true
    },
    'abstained': {
      name: 'abstained',
      color: '#a9a9a9',
      offsetX: config.midX - 45,
      reverse: false,
      showLabels: false
    }
  };

  return vote[key] || { color: 'none' };
}

export function group(key) {
  const group = {
    'PPE': {
      name: 'EPP',
      long: 'European People\'s Party',
      type: 'Christian Democrats',
      color: '#003C78'
    },
    'S&D': {
      name: 'S&D',
      long: 'Progressive Alliance of Socialists and Democrats',
      type: 'Social Democrats',
      color: '#C80000'
    },
    'ECR': {
      name: 'ECR',
      long: 'European Conservatives and Reformists',
      type: 'Eurosceptic Conservatives',
      color: '#0082FF'
    },
    'ALDE': {
      name: 'ALDE',
      long: 'Alliance of Liberals and Democrats for Europe',
      type: 'Liberals and Centrists',
      color: '#FFAA00'
    },
    'Verts/ALE': {
      name: 'Greens/EFA',
      long: 'The Greens–European Free Alliance',
      type: 'Greens and Regionalists',
      color: '#009900'
    },
    'GUE/NGL': {
      name: 'GUE/NGL',
      long: 'European United Left–Nordic Green Left',
      type: 'Communists and Socialists',
      color: '#460000'
    },
    'EFDD': {
      name: 'EFDD',
      long: 'Europe of Freedom and Direct Democracy',
      type: 'Eurosceptic Populists',
      color: '#8B9FA0'
    },
    'ENF': {
      name: 'ENF',
      long: 'Europe of Nations and Freedom',
      type: 'Far-right Nationalists',
      color: '#9B20A9'
    },
    'NI': {
      name: 'NI',
      long: 'Non-Inscrits',
      type: 'Other',
      color: '#666666'
    }
  };

  return group[key] || name;
}

export function age(key) {
  const age = {
    '28': {
      name: '28 and older'
    },
    '40': {
      name: '40 and older'
    },
    '50': {
      name: '50 and older'
    },
    '60': {
      name: '60 and older'
    },
    '70': {
      name: '70 and older'
    }
  };

  return age[key] || key;
}
